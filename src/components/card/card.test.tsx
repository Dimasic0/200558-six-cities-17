import { type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Card from './card';
import { configs, TConfig } from './card';
import { offers } from '../../mocks/offers';
import type { TOffers } from '../../types/types';
import {
  expectAttributeTestId,
  expectByTestIdClass,
  expectTestIdToHaveClass,
  expectTestIdToTextContent,
} from '../../library/test/test';

// Заглушка вместо реального BookmarkButton (без Redux).
// async import — иначе createMockComponent будет undefined из‑за hoist vi.mock.
vi.mock('../bookmarkButton/bookmark-button', async () => {
  const { createMockComponent: mockComp } = await import(
    '../../library/test/test'
  );
  return {
    BookmarkButton: mockComp('BookmarkButton'),
  };
});

// Два разных оффера: с Premium и без — чтобы проверить условный рендер
const premiumOffer = offers[0];
const regularOffer = offers[3];

type TCardTestProps = Partial<ComponentProps<typeof Card>> & {
  offer?: TOffers;
};

/**
 * Обёртка для рендера Card.
 * MemoryRouter — нужен для <Link>, иначе React Router падает в тесте.
 * Provider больше не нужен: BookmarkButton замокан.
 */
const renderCard = (props: TCardTestProps = {}) => {
  const {
    offer = premiumOffer,
    variant = 'vertical',
    onHover,
    classTextBlock,
  } = props;

  return render(
    <MemoryRouter>
      <Card
        offer={offer}
        variant={variant}
        onHover={onHover}
        classTextBlock={classTextBlock}
      />
    </MemoryRouter>,
  );
};

const getBookmarkMock = () =>
  document.querySelector('[data-component="BookmarkButton"]');

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
    const config: TConfig = configs.horizontal;
    expectAttributeTestId('card-image', { width: config.width, height: config.height });
  });

  // isPremium: true → блок .place-card__mark; false → блока нет
  it('shows Premium mark only for premium offers', () => {
    const { rerender } = renderCard({ offer: premiumOffer });
    expect(screen.getByTestId('premium')).toBeInTheDocument();

    // rerender меняет props на том же дереве, без полного unmount
    rerender(
      <MemoryRouter>
        <Card offer={regularOffer} variant="vertical" />
      </MemoryRouter>,
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

  describe('BookmarkButton', () => {
    // Card должен пробросить в кнопку избранного id, isFavorite и bem-блок карточки
    it('receives id, defaultState and bemBlock from offer', () => {
      renderCard({ offer: premiumOffer });

      const bookmark = getBookmarkMock();
      expect(bookmark).toBeInTheDocument();
      expect(bookmark).toHaveAttribute('data-prop-id', premiumOffer.id);
      expect(bookmark).toHaveAttribute(
        'data-prop-defaultstate',
        JSON.stringify(premiumOffer.isFavorite),
      );
      expect(bookmark).toHaveAttribute('data-prop-bemblock', 'place-card');
      expect(bookmark).toHaveAttribute('data-prop-width', '18');
      expect(bookmark).toHaveAttribute('data-prop-height', '19');
    });

    it('gets defaultState true when offer is favorite', () => {
      const favoriteOffer = { ...premiumOffer, isFavorite: true };
      renderCard({ offer: favoriteOffer });

      expect(getBookmarkMock()).toHaveAttribute('data-prop-defaultstate', 'true');
    });
  });
});
