import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { offers } from '../../mocks/offers';
import { TOffers } from '../../types/types';
import Cards from './cards';

const { mockCard } = vi.hoisted(() => ({
  mockCard: vi.fn(() => <div data-testid="card-mock" />),
}));

vi.mock('../card/card', () => ({
  default: mockCard,
}));

describe('Cards', () => {
  const [firstOffer, secondOffer] = offers.slice(0, 2);
  const onHover = vi.fn();
  const sharedProps = {
    variant: 'vertical' as const,
    onHover,
    classTextBlock: 'cities__card-info',
  };

  beforeEach(() => {
    mockCard.mockClear();
  });

  const renderCards = (offersList: TOffers[]) => {
    render(<Cards offers={offersList} {...sharedProps} />);
  };

  const expectCardsToReceiveOffers = (offersList: TOffers[]) => {
    expect(mockCard).toHaveBeenCalledTimes(offersList.length);

    offersList.forEach((offer, index) => {
      expect(mockCard.mock.calls[index][0]).toEqual(expect.objectContaining({
        offer,
        ...sharedProps,
      }));
    });
  };

  it.each<[string, TOffers[]]>([
    ['one offer', [firstOffer]],
    ['two different offers', [firstOffer, secondOffer]],
  ])('passes matching offer props to Card when offers array has %s', (_, offersList) => {
    renderCards(offersList);
    expectCardsToReceiveOffers(offersList);
  });

  it('does not render Card when offers array is empty', () => {
    renderCards([]);
    expect(mockCard).not.toHaveBeenCalled();
  });
});
