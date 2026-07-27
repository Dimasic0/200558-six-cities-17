import { type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { describe, expect, it, vi } from 'vitest';
import Card from './card';
import { offers } from '../../mocks/offers';
import type { TOffers } from '../../types/types';
import {
  expectAttributeTestId,
  expectByTestIdClass,
  expectTestIdToHaveClass,
  expectTestIdToTextContent,
} from '../../store/library/test/test';

const mockStore = configureMockStore();

// Два разных оффера: с Premium и без — чтобы проверить условный рендер
const premiumOffer = offers[0];
const regularOffer = offers[3];

type TCardTestProps = Partial<ComponentProps<typeof Card>> & {
  offer?: TOffers;
};

/**
 * Обёртка для рендера Card.
 * Provider — BookmarkButton внутри Card ходит в Redux через useAppDispatch.
 * MemoryRouter — нужен для <Link>, иначе React Router падает в тесте.
 */
const renderCard = (props: TCardTestProps = {}) => {
  const store = mockStore({});
  const {
    offer = premiumOffer,
    variant = 'vertical',
    onHover,
    classTextBlock,
  } = props;

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Card
          offer={offer}
          variant={variant}
          onHover={onHover}
          classTextBlock={classTextBlock}
        />
      </MemoryRouter>
    </Provider>,
  );
};

describe('Card', () => {
  // variant='vertical' → configs.vertical → класс cities__card
  it('renders vertical card with cities BEM class', () => {
    renderCard({ variant: 'vertical' });

    expectByTestIdClass('card', 'cities__card', 'place-card');
  });

  // variant='horizontal' → favorites__card и уменьшенная картинка 150×110
  it('renders horizontal card with favorites BEM class and image size', () => {
    renderCard({ variant: 'horizontal' });

    expectByTestIdClass('card', 'favorites__card');
    expectAttributeTestId('card-image', { width: 150, height: 110 });
  });

  // isPremium: true → блок .place-card__mark; false → блока нет
  it('shows Premium mark only for premium offers', () => {
    const { rerender } = renderCard({ offer: premiumOffer });
    expect(screen.getByTestId('premium')).toBeInTheDocument();

    // rerender меняет props на том же дереве, без полного unmount
    const store = mockStore({});
    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <Card offer={regularOffer} variant="vertical" />
        </MemoryRouter>
      </Provider>,
    );
    // queryBy* возвращает null, если элемента нет (getBy* бросил бы ошибку)
    expect(screen.queryByTestId('premium')).not.toBeInTheDocument();
  });

  // Данные оффера должны попасть в разметку «как есть»
  it('renders offer title, price, type and preview image', () => {
    renderCard();

    expectTestIdToTextContent(
      ['card-title', premiumOffer.title],
      ['card-price', premiumOffer.price],
      ['card-type', premiumOffer.type],
    );
    expectAttributeTestId('card-image', {
      src: premiumOffer.previewImage,
      width: 260,
      height: 200,
    });
  });

  // В карточке рейтинг рисуется полоской: rating * 20% (5 ★ = 100%)
  it('sets rating width as rating * 20%', () => {
    renderCard();

    expect(screen.getByTestId('card-rating')).toHaveStyle({
      width: `${premiumOffer.rating * 20}%`,
    });
  });

  // classTextBlock добавляется к place-card__info (например, на странице favorites)
  it('applies classTextBlock to info container', () => {
    renderCard({ classTextBlock: 'favorites__card-info' });

    expectTestIdToHaveClass([
      'card-info',
      'favorites__card-info',
      'place-card__info',
    ]);
  });

  // Картинка ведёт на /offer/:id — проверяем, что id из оффера попал в href
  it('links to offer page by id', () => {
    renderCard();

    expectAttributeTestId('card-link', { href: `/offer/${premiumOffer.id}` });
  });

  // Карта подсвечивает пин на карте: enter → id, leave → null
  it('calls onHover with id on mouse enter and null on mouse leave', async () => {
    const user = userEvent.setup();
    const onHover = vi.fn(); // мок-колбэк: запоминает вызовы
    renderCard({ onHover });

    const card = screen.getByTestId('card');
    await user.hover(card);
    expect(onHover).toHaveBeenCalledWith(premiumOffer.id);

    await user.unhover(card);
    expect(onHover).toHaveBeenCalledWith(null);
  });
});
