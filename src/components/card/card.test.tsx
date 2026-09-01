import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { beforeEach, vi } from 'vitest';
import Card, { type TCardProps } from './card';
import { offers } from '../../mocks/offers';
import { TOffers } from '../../types/types';
import { expectAttribute } from '../../store/library/test/test';

const { mockBookmarkButton } = vi.hoisted(() => ({
  mockBookmarkButton: vi.fn(() => <div data-testid="bookmark-button-mock" />),
}));

vi.mock('../bookmarkButton/bookmarkButton', () => ({
  BookmarkButton: mockBookmarkButton,
}));

const mockStore = configureMockStore();

type RenderCardOptions = Partial<Omit<TCardProps, 'offer'>> & {
  offer?: Partial<TCardProps['offer']>;
};

const defaultOffer = offers[0];
function renderCard({
  offer = {},
  variant = 'vertical',
  onHover,
  classTextBlock = '',
}: RenderCardOptions = {}) {
  const store = mockStore({});

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Card
          offer={{ ...defaultOffer, ...offer }}
          variant={variant}
          onHover={onHover}
          classTextBlock={classTextBlock}
        />
      </MemoryRouter>
    </Provider>
  );
}

const renderCardOffer = (offer: Partial<TOffers>) => {
  return renderCard({ offer });
}


beforeEach(() => {
  mockBookmarkButton.mockClear();
});

it('renders links with matching href', () => {
  const id = 'test-offer-id';
  renderCardOffer( { id  });

  const links = screen.getAllByRole('link');

  expect(links).toHaveLength(2);
  expect(links[0]).toHaveAttribute('href', `/offer/${id}`);
  expect(links[1]).toHaveAttribute('href', `/offer/${id}`);
});

it('renders info block with matching classTextBlock', () => {
  const classTextBlock = 'cities__card-info';
  renderCard({ classTextBlock });

  const info = document.querySelector('.place-card__info');

  expect(info).toBeInTheDocument();
  expect(info).toHaveClass(classTextBlock);
});

it.each<[RenderCardOptions['variant'], number, number]>([
  ['vertical', 260, 200],
  ['horizontal', 150, 110],
])('renders %s card image with matching attributes', (variant, width, height) => {
  const previewImage = 'https://example.com/preview.jpg';
  const title = 'Test offer title';

  renderCard({
    variant,
    offer: { previewImage, title },
  });

  const image = document.querySelector('.place-card__image');

  expectAttribute(image, {
    class: 'place-card__image',
    src: previewImage,
    width,
    height,
    alt: title,
  });
});

it('renders matching price value', () => {
  renderCardOffer({ price: 500 } );

  const priceValue = document.querySelector('.place-card__price-value');

  expect(priceValue).toHaveTextContent('500');
});

it.each<[number, string]>([
  [4, '80%'],
  [3, '60%'],
  [0, '0%'],
  [5, '100%'],
])('renders rating stars with width %s when rating is %s', (rating, expectedWidth) => {
  renderCardOffer({ rating });

  const ratingBar = screen.getByTestId('rating');

  expect(ratingBar).toHaveStyle({ width: expectedWidth });
});

it('passes matching props to BookmarkButton', () => {
  const id = 'bookmark-offer-id';
  renderCardOffer( { id, isFavorite: true } );

  expect(mockBookmarkButton).toHaveBeenCalledWith(
    expect.objectContaining({
      id,
      width: '18',
      height: '19',
      defaultState: true,
      bemBlock: 'place-card',
    }),
    {},
  );
});

it.each<[RenderCardOptions['variant'], string]>([
  ['vertical', 'cities__card'],
  ['horizontal', 'favorites__card'],
])('renders %s card with matching card class', (variant, expectedClass) => {
  renderCard({ variant });
  const card = screen.getByTestId('card');
  expect(card.className).toContain(expectedClass);
});

it.each<[RenderCardOptions['variant'], string]>([
  ['vertical', 'cities__image-wrapper'],
  ['horizontal', 'favorites__image-wrapper'],
])('renders %s card with matching image-wrapper class', (variant, expectedClass) => {
  renderCard({ variant });
  const card = screen.getByTestId('card');
  const imageWrapper = card.querySelector('.place-card__image-wrapper');

  expect(imageWrapper).toBeInTheDocument();
  expect(imageWrapper?.className).toContain(expectedClass);
});

it.each<[boolean]>([
  [true],
  [false],
])('premium badge when isPremium is %s', (isPremium) => {
  renderCardOffer( { isPremium });

  const premium = screen.queryByTestId('premium');

  if (isPremium) {
    expect(premium).toBeInTheDocument();
  } else {
    expect(premium).not.toBeInTheDocument();
  }
});

it('calls onHover with offer id on mouse enter and null on mouse leave', async () => {
  const id = 'hover-offer-id';
  const onHover = vi.fn();
  renderCard({ offer: { id }, onHover });

  const card = screen.getByTestId('card');
  const user = userEvent.setup();

  await user.hover(card);

  expect(onHover).toHaveBeenCalledWith(id);

  await user.unhover(card);

  expect(onHover).toHaveBeenCalledWith(null);
});

it('renders matching type===default', () => {
  renderCardOffer({});

  const type = screen.getByText(defaultOffer.type);

  expect(type).toBeInTheDocument();
});

it('renders matching type ==== apartment', () => {
  renderCardOffer({ type: 'apartment' });

  const type = screen.getByText('apartment');

  expect(type).toBeInTheDocument();
});

it.each<[boolean]>([
  ['apartment'],
  ['room'],
])('offer.type', (type) => {
  renderCardOffer({type });

  screen.getByText(type);
});

it('offer.title', ()=>{
  renderCardOffer({});

  screen.getByText(defaultOffer.title);
});