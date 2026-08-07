import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Offer from './offer';
import { api } from '../../api';
import { offers } from '../../mocks/offers';
import type { TComment, TOffer, TOffers } from '../../types/types';
import {
  expectMockProps,
  getMockComponent,
} from '../../library/test/test';

vi.mock('../../api', () => ({
  api: {
    get: vi.fn(),
  },
}));

vi.mock('../../components/header/header', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { Header: createMockComponent('Header') };
});

vi.mock('../../components/cards/cards', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { default: createMockComponent('Cards') };
});

vi.mock('../../components/loading/loading.tsx', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { default: createMockComponent('Loading') };
});

vi.mock('../../components/offerdata/offer-data.tsx', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { OfferData: createMockComponent('OfferData') };
});

const OFFER_ID = 'offer-1';

const sampleOffer: TOffer = {
  id: OFFER_ID,
  title: 'Beautiful apartment',
  type: 'apartment',
  price: 120,
  bedrooms: 3,
  maxAdults: 4,
  rating: 4.5,
  isFavorite: false,
  isPremium: true,
  description: 'Nice place',
  goods: ['Wi-Fi', 'Heating'],
  images: ['/img/1.jpg', '/img/2.jpg'],
  location: { latitude: 52.390955, longitude: 4.853096, zoom: 16 },
  host: {
    name: 'Angelina',
    avatarUrl: '/img/avatar.jpg',
    isPro: true,
  },
  city: {
    name: 'Amsterdam',
    location: { latitude: 52.37, longitude: 4.89, zoom: 10 },
  },
};

const sampleComments: TComment[] = [
  {
    id: '1',
    date: '2019-04-24',
    comment: 'A quiet cozy place',
    rating: 4,
    user: {
      name: 'Max',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro: false,
    },
  },
];

const nearbyOffers: TOffers[] = offers.slice(0, 2);

const mockApiSuccess = (
  nearby: TOffers[] = nearbyOffers,
  comments: TComment[] = sampleComments,
) => {
  vi.mocked(api.get).mockImplementation((url: string) => {
    if (url === `offers/${OFFER_ID}`) {
      return Promise.resolve({ data: sampleOffer });
    }
    if (url === `offers/${OFFER_ID}/nearby`) {
      return Promise.resolve({ data: nearby });
    }
    if (url === `comments/${OFFER_ID}`) {
      return Promise.resolve({ data: comments });
    }
    return Promise.reject(new Error(`Unexpected URL: ${url}`));
  });
};

const renderOffer = () =>
  render(
    <MemoryRouter initialEntries={[`/offer/${OFFER_ID}`]}>
      <Routes>
        <Route path="/offer/:offerId" element={<Offer />} />
      </Routes>
    </MemoryRouter>,
  );

describe('Offer', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
  });

  // Пока offer не пришёл — только Loading, без Header/OfferData
  it('renders Loading while offer is not loaded', () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {}));

    renderOffer();

    expect(getMockComponent('Loading')).toBeInTheDocument();
    expect(getMockComponent('Header')).not.toBeInTheDocument();
  });

  // При маунте три GET с одним AbortSignal (offer / nearby / comments)
  it('fetches offer, nearby and comments with AbortSignal on mount', async () => {
    mockApiSuccess();
    renderOffer();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(3);
    });

    const signal = vi.mocked(api.get).mock.calls[0][1]?.signal;
    expect(signal).toBeInstanceOf(AbortSignal);

    expect(api.get).toHaveBeenCalledWith(`offers/${OFFER_ID}`, { signal });
    expect(api.get).toHaveBeenCalledWith(`offers/${OFFER_ID}/nearby`, {
      signal,
    });
    expect(api.get).toHaveBeenCalledWith(`comments/${OFFER_ID}`, { signal });
  });

  // Данные есть → Header, заголовок соседних мест, OfferData и Cards
  it('renders Header, OfferData and nearby Cards after offer loads', async () => {
    mockApiSuccess();
    renderOffer();

    await waitFor(() => {
      expect(getMockComponent('OfferData')).toBeInTheDocument();
    });

    expect(getMockComponent('Loading')).not.toBeInTheDocument();
    expect(getMockComponent('Header')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Other places in the neighbourhood',
      }),
    ).toBeInTheDocument();

    expectMockProps('OfferData', {
      offer: sampleOffer,
      comments: sampleComments,
      nearOffers: nearbyOffers,
      getComment: () => {},
    });
    expectMockProps('Cards', {
      offers: nearbyOffers,
      variant: 'vertical',
    });
  });

  // Страница режет nearby до 3 карточек
  it('limits nearby offers passed to Cards and OfferData to 3', async () => {
    const manyNearby = offers.slice(0, 5);
    mockApiSuccess(manyNearby);
    renderOffer();

    const expectedNear = manyNearby.slice(0, 3);

    await waitFor(() => {
      expect(getMockComponent('OfferData')).toBeInTheDocument();
    });

    expectMockProps('OfferData', { nearOffers: expectedNear });
    expectMockProps('Cards', { offers: expectedNear, variant: 'vertical' });
  });

  // Размонтирование отменяет незавершённые запросы
  it('aborts in-flight requests on unmount', () => {
    let capturedSignal: AbortSignal | undefined;
    vi.mocked(api.get).mockImplementation((_url, config) => {
      capturedSignal = config?.signal as AbortSignal;
      return new Promise(() => {});
    });

    const { unmount } = renderOffer();

    expect(capturedSignal?.aborted).toBe(false);
    unmount();
    expect(capturedSignal?.aborted).toBe(true);
  });
});
