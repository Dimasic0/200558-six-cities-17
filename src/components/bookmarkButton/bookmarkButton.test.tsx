import { type ComponentProps } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarkButton } from './bookmarkButton';
import { rqFavorite } from '../../store/action/action';

const { mockDispatch } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
}));

vi.mock('../../store', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../../store/action/action', () => ({
  rqFavorite: vi.fn((payload: { id: string; state: boolean }) => ({
    type: 'offers/favorite',
    payload,
  })),
}));

type TBookmarkButtonTestProps = Partial<ComponentProps<typeof BookmarkButton>>;

const defaultProps = {
  width: 31,
  height: 33,
  defaultState: false,
  bemBlock: 'offer',
  id: 'offer-1',
} as const;

const renderBookmarkButton = (props: TBookmarkButtonTestProps = {}) => {
  const merged = { ...defaultProps, ...props };

  return {
    props: merged,
    ...render(<BookmarkButton {...merged} />),
  };
};

const getButton = () => screen.getByRole('button', { name: 'To bookmarks' });

describe('BookmarkButton', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockDispatch.mockResolvedValue(undefined);
    vi.mocked(rqFavorite).mockClear();
  });

  // BEM-класс строится из bemBlock; type="button" — чтобы не сабмитить формы
  it('renders button with bemBlock class and type="button"', () => {
    const { container } = renderBookmarkButton({ bemBlock: 'place-card' });

    expect(getButton()).toHaveClass('place-card__bookmark-button', 'button');
    expect(getButton()).toHaveAttribute('type', 'button');
    expect(container.querySelector('.visually-hidden')).toHaveTextContent(
      'To bookmarks',
    );
  });

  // width/height пробрасываются в svg иконки
  it('passes width and height to svg icon', () => {
    const { container } = renderBookmarkButton({ width: 18, height: 19 });

    const svg = container.querySelector('.offer__bookmark-icon');
    expect(svg).toHaveAttribute('width', '18');
    expect(svg).toHaveAttribute('height', '19');
  });

  // useState(defaultState) читает props только при маунте — отдельный рендер на каждый кейс
  it('applies active class from defaultState', () => {
    const { unmount } = renderBookmarkButton({ defaultState: false });
    expect(getButton()).not.toHaveClass('offer__bookmark-button--active');
    unmount();

    renderBookmarkButton({ defaultState: true });
    expect(getButton()).toHaveClass('offer__bookmark-button--active');
  });

  // !!defaultState: число 1 → избранное, 0 → нет
  it('coerces numeric defaultState to boolean', () => {
    renderBookmarkButton({ defaultState: 1 });
    expect(getButton()).toHaveClass('offer__bookmark-button--active');
  });

  // Клик с id → rqFavorite с инвертированным state и dispatch
  it('dispatches rqFavorite with inverted state on click', async () => {
    const user = userEvent.setup();
    renderBookmarkButton({ defaultState: false, id: 'offer-1' });

    await user.click(getButton());

    expect(rqFavorite).toHaveBeenCalledWith({ id: 'offer-1', state: true });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'offers/favorite',
      payload: { id: 'offer-1', state: true },
    });
  });

  // После успешного ответа state переключается → появляется --active
  it('toggles active class after successful dispatch', async () => {
    const user = userEvent.setup();
    renderBookmarkButton({ defaultState: false });

    await user.click(getButton());

    await waitFor(() => {
      expect(getButton()).toHaveClass('offer__bookmark-button--active');
    });
  });

  // Без id клик ничего не делает (гость / незалогиненный сценарий не шлёт запрос)
  it('does not dispatch when id is missing', async () => {
    const user = userEvent.setup();
    renderBookmarkButton({ id: undefined });

    await user.click(getButton());

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(rqFavorite).not.toHaveBeenCalled();
  });

  // Пока промис не резолвился, sending=true → повторный клик игнорируется
  it('ignores clicks while request is in flight', async () => {
    const user = userEvent.setup();
    let resolveDispatch!: (value?: unknown) => void;
    mockDispatch.mockReturnValue(
      new Promise((resolve) => {
        resolveDispatch = resolve;
      }),
    );

    renderBookmarkButton();

    await user.click(getButton());
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    await user.click(getButton());
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    resolveDispatch(undefined);
    await waitFor(() => {
      expect(getButton()).toHaveClass('offer__bookmark-button--active');
    });
  });

  // Ошибка запроса: state не меняется, но sending сбрасывается → можно кликнуть снова
  it('does not toggle state on dispatch error and allows retry', async () => {
    const user = userEvent.setup();
    mockDispatch.mockRejectedValueOnce(new Error('network'));

    renderBookmarkButton({ defaultState: false });

    await user.click(getButton());

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(getButton()).not.toHaveClass('offer__bookmark-button--active');

    mockDispatch.mockResolvedValueOnce(undefined);
    await user.click(getButton());

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(getButton()).toHaveClass('offer__bookmark-button--active');
    });
  });
});
