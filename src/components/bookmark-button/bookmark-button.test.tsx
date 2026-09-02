import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { vi } from 'vitest';
import { BookmarkButton, type BookmarkButtonProps } from './bookmark-button';
import { expectAttribute } from '../../store/library/test/test';
import { offers } from '../../mocks/offers';

const mockStore = configureMockStore();
const ACTIVE_CLASS = 'offer__bookmark-button--active';

function createStore() {
  const store = mockStore({});
  store.dispatch = vi.fn(() => Promise.resolve(undefined)) as typeof store.dispatch;

  return store;
}

function renderBookmarkButton({
  width = 31,
  height = 33,
  defaultState = false,
  bemBlock = 'bookmark-button',
  id = offers[0].id,
}: Partial<BookmarkButtonProps> = {}) {
  return render(
    <Provider store={createStore()}>
      <BookmarkButton
        width={width}
        height={height}
        defaultState={defaultState}
        bemBlock={bemBlock}
        id={id}
      />
    </Provider>
  );
}

function getBookmarkButton(bemBlock = 'bookmark-button') {
  return document.querySelector(`.${bemBlock}__bookmark-button`);
}

describe('BookmarkButton', () => {
  it('defaultState= false', () => {
    renderBookmarkButton();
    const button = document.querySelector('.bookmark-button__bookmark-button');
    expect(button).toBeInTheDocument();
  });
  it('defaultState=true', () => {
    renderBookmarkButton({ defaultState: true });
    const button = document.querySelector('.offer__bookmark-button--active');
    const svg = button.querySelector('.offer__bookmark-icon');
    expectAttribute(svg, { width: 31, height: 33 });
  });
  it('defaultState=true width="other" height="other"', () => {
    const size = { width: 40, height: 40 };
    renderBookmarkButton({ defaultState: true, ...size });
    const button = document.querySelector('.offer__bookmark-button--active');
    const svg = button.querySelector('.offer__bookmark-icon');
    expectAttribute(svg, size);
  });

  it('adds active class on click when defaultState is false', async () => {
    const user = userEvent.setup();
    renderBookmarkButton({ defaultState: false });

    const button = getBookmarkButton();
    expect(button).not.toHaveClass(ACTIVE_CLASS);

    await user.click(button!);

    expect(button).toHaveClass(ACTIVE_CLASS);
  });

  it('removes active class on click when defaultState is true', async () => {
    const user = userEvent.setup();
    renderBookmarkButton({ defaultState: true });

    const button = getBookmarkButton();
    expect(button).toHaveClass(ACTIVE_CLASS);

    await user.click(button!);

    expect(button).not.toHaveClass(ACTIVE_CLASS);
  });
});
