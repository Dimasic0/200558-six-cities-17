import { type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Cards from './cards';
import { offers } from '../../mocks/offers';
import type { TOffers } from '../../types/types';
import {
  expectMockProps,
  getMockComponents,
} from '../../library/test/test';

// Заглушка вместо реального Card: проверяем только то, что Cards пробрасывает props.
// async import — иначе createMockComponent будет undefined из‑за hoist vi.mock.
vi.mock('../card/card', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return {
    default: createMockComponent('Card'),
  };
});

const sampleOffers = offers.slice(0, 3);

type TCardsTestProps = Partial<ComponentProps<typeof Cards>> & {
  offers?: TOffers[];
};

const renderCards = (props: TCardsTestProps = {}) => {
  const {
    offers: offersProp = sampleOffers,
    variant = 'vertical',
    onHover,
    classTextBlock,
  } = props;

  return render(
    <Cards
      offers={offersProp}
      variant={variant}
      onHover={onHover}
      classTextBlock={classTextBlock}
    />,
  );
};

describe('Cards', () => {
  // По одному Card на каждый offer в массиве
  it('renders a Card for each offer', () => {
    renderCards({ offers: sampleOffers });

    expect(getMockComponents('Card')).toHaveLength(sampleOffers.length);
  });

  // Пустой список — разметка без карточек
  it('renders nothing when offers is empty', () => {
    renderCards({ offers: [] });

    expect(getMockComponents('Card')).toHaveLength(0);
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  // В каждую карточку уходит свой offer (проверяем id в data-prop)
  it('passes each offer to the corresponding Card', () => {
    renderCards({ offers: sampleOffers });

    const cards = getMockComponents('Card');
    sampleOffers.forEach((offer, index) => {
      expectMockProps(cards[index], { offer });
    });
  });

  // Общие props (variant, classTextBlock, onHover) пробрасываются во все Card
  it('forwards variant, classTextBlock and onHover to every Card', () => {
    const onHover = vi.fn();
    renderCards({
      offers: sampleOffers,
      variant: 'horizontal',
      classTextBlock: 'favorites__card-info',
      onHover,
    });

    getMockComponents('Card').forEach((card) => {
      expectMockProps(card, {
        variant: 'horizontal',
        classTextBlock: 'favorites__card-info',
        onHover,
      });
    });
  });
});
