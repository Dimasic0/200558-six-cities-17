import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Main from './main';
import { offers } from '../../mocks/offers';
import type { TOffers } from '../../types/types';
import {
  cityDefault,
  sortingName,
  СITIES,
} from '../../data/constant';
import {
  expectMockProps,
  getMockComponent,
} from '../../library/test/test';
import { getOffers, setCity } from '../../store/action/action';
import { useOffers } from '../../store/useSelectors/useSelectors';

const { mockDispatch } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
}));

vi.mock('../../store', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../../store/useSelectors/useSelectors', () => ({
  useOffers: vi.fn(),
}));

vi.mock('../../store/action/action', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../store/action/action')>();
  return {
    ...actual,
    getOffers: vi.fn((signal: AbortSignal) => ({
      type: 'offers/offers',
      payload: signal,
    })),
  };
});

vi.mock('../../components/header/header', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { Header: createMockComponent('Header') };
});

vi.mock('../../components/cards/cards', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { default: createMockComponent('Cards') };
});

vi.mock('../../components/map/map', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { default: createMockComponent('Map') };
});

vi.mock('../../components/spinner/spinner', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { Spinner: createMockComponent('Spinner') };
});

/** Три оффера с разными price/rating — удобно проверять сортировку */
const mainOffers: TOffers[] = [
  { ...offers[0], price: 300, rating: 2 },
  { ...offers[1], price: 100, rating: 5 },
  { ...offers[2], price: 200, rating: 3 },
];

const byPriceLow = [...mainOffers].sort((a, b) => a.price - b.price);
const byPriceHigh = [...mainOffers].sort((a, b) => b.price - a.price);
/** Как в Main: a.rating - b.rating (по возрастанию) */
const byRatingAsc = [...mainOffers].sort((a, b) => a.rating - b.rating);

const renderMain = () =>
  render(
    <MemoryRouter>
      <Main />
    </MemoryRouter>,
  );

const openSortingAndChoose = async (option: string) => {
  const user = userEvent.setup();
  await user.click(
    document.querySelector('.places__sorting-type') as HTMLElement,
  );
  await user.click(screen.getByText(option, { selector: '.places__option' }));
  return user;
};

describe('Main', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    vi.mocked(getOffers).mockClear();
    vi.mocked(useOffers).mockReturnValue(mainOffers);
  });

  // При маунте грузим офферы; AbortSignal — отмена при размонтировании
  it('dispatches getOffers with AbortSignal on mount', () => {
    renderMain();

    expect(getOffers).toHaveBeenCalledTimes(1);
    expect(getOffers.mock.calls[0][0]).toBeInstanceOf(AbortSignal);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'offers/offers',
      payload: getOffers.mock.calls[0][0],
    });
  });

  // Пока офферов нет — только Spinner, без Header/Cards/Map
  it('renders Spinner while offers are empty', () => {
    vi.mocked(useOffers).mockReturnValue([]);

    renderMain();

    expect(getMockComponent('Spinner')).toBeInTheDocument();
    expect(getMockComponent('Header')).not.toBeInTheDocument();
  });

  // Данные есть → шапка, вкладки городов, счётчик и сортировка
  it('renders Header, city tabs, places count and sorting when offers loaded', () => {
    const { container } = renderMain();

    expect(getMockComponent('Spinner')).not.toBeInTheDocument();
    expect(getMockComponent('Header')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Cities', hidden: true }),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.places__found')
    ).toHaveTextContent(mainOffers.length + '');
    expect(screen.getByText('Places')).toBeInTheDocument();

    СITIES.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
    expect(
      document.querySelector('.locations__item-link.tabs__item--active'),
    ).toHaveTextContent(cityDefault);
  });

  // Cards и Map получают список и layout-пропсы страницы
  it('passes offers to Cards and Map with page layout props', () => {
    renderMain();

    expectMockProps('Cards', {
      offers: mainOffers,
      variant: 'vertical',
      classTextBlock: 'favorites__card-info',
    });
    expectMockProps('Map', {
      points: mainOffers,
      selectedPoint: null,
      city: mainOffers[0].city.location,
    });
  });

  // Клик по городу → setCity в store
  it('dispatches setCity when a city tab is clicked', async () => {
    const user = userEvent.setup();
    renderMain();

    await user.click(screen.getByText('Cologne'));

    expect(mockDispatch).toHaveBeenCalledWith(setCity('Cologne'));
  });

  // Сортировка low/high/rated меняет порядок в Cards и Map
  it.each([
    [sortingName.low, byPriceLow],
    [sortingName.high, byPriceHigh],
    [sortingName.rated, byRatingAsc],
  ] as const)(
    'reorders Cards and Map offers for %s',
    async (option, expectedOffers) => {
      renderMain();

      await openSortingAndChoose(option);

      expectMockProps('Cards', { offers: expectedOffers });
      expectMockProps('Map', { points: expectedOffers });
    },
  );
});
