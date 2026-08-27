import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { BookmarkButton, type BookmarkButtonProps } from './bookmarkButton';
import { expectAttribute } from '../../store/library/test/test';
const mockStore = configureMockStore();
const store = mockStore({});

function renderBookmarkButton({
  width = 31,
  height = 33,
  defaultState = false,
  bemBlock = 'bookmark-button',
  id,
}: Partial<BookmarkButtonProps> = {}) {
  return render(
    <Provider store={store}>
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
    renderBookmarkButton({ defaultState: true });
    const button = document.querySelector('.offer__bookmark-button--active');
    const svg = button.querySelector('.offer__bookmark-icon');
    expectAttribute(svg, { width: 40, height: 40 });
  });
});
