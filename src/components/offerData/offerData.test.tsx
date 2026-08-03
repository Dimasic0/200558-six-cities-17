import { type ComponentProps, type RefObject } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OfferData } from './offerData';
import { api } from '../../api';
import { useEmail } from '../../store/useSelectors/useSelectors';
import { offers } from '../../mocks/offers';
import type { TComment, TOffer } from '../../types/types';
import {
  expectMockProps,
  getMockComponent,
  getMockComponents,
} from '../../library/test/test';

vi.mock('../../store/useSelectors/useSelectors', () => ({
  useEmail: vi.fn(() => 'user@example.com'),
}));

vi.mock('../../api', () => ({
  api: {
    post: vi.fn(() => Promise.resolve({})),
  },
}));

vi.mock('../bookmarkButton/bookmarkButton', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return {
    BookmarkButton: createMockComponent('BookmarkButton'),
  };
});

vi.mock('../offerInsideList/offerInsideList', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return {
    default: createMockComponent('OfferInsideList'),
  };
});

vi.mock('../comments/comments', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return {
    default: createMockComponent('Comments'),
  };
});

vi.mock('../map/map', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return {
    default: createMockComponent('Map'),
  };
});

type TCommentFormProps = {
  onSubmit: (evt: { comment: string; rating: number }) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
};

let commentFormProps: TCommentFormProps | null = null;

// Интерактивный мок: нужен ref на textarea и доступ к onSubmit для проверки api.post
vi.mock('../commentForm/commentForm', async () => {
  const { createElement: el } = await import('react');
  return {
    CommentForm: (props: TCommentFormProps) => {
      commentFormProps = props;
      return el(
        'div',
        { 'data-component': 'CommentForm' },
        el('textarea', {
          ref: props.textareaRef,
          'data-testid': 'comment-textarea',
        }),
      );
    },
  };
});

const makeOffer = (overrides: Partial<TOffer> = {}): TOffer => ({
  id: 'offer-1',
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
  images: ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg'],
  location: { latitude: 52.390955, longitude: 4.853096, zoom: 16 },
  ...overrides,
  host: {
    name: 'Angelina',
    avatarUrl: '/img/avatar.jpg',
    isPro: true,
    ...overrides.host,
  },
  city: {
    name: 'Amsterdam',
    location: { latitude: 52.37, longitude: 4.89, zoom: 10 },
    ...overrides.city,
  },
});

const makeComment = (overrides: Partial<TComment> = {}): TComment => ({
  id: '1',
  date: '2019-04-24',
  comment: 'A quiet cozy and picturesque place',
  rating: 4,
  ...overrides,
  user: {
    name: 'Max',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: false,
    ...overrides.user,
  },
});

const sampleOffer = makeOffer();
const sampleComments = [
  makeComment({ id: '1', comment: 'First review' }),
  makeComment({ id: '2', comment: 'Second review' }),
];
const sampleNearOffers = offers.slice(0, 2);

type TOfferDataTestProps = Partial<ComponentProps<typeof OfferData>> & {
  initialEntries?: string[];
};

const renderOfferData = (props: TOfferDataTestProps = {}) => {
  const {
    offer = sampleOffer,
    comments = sampleComments,
    nearOffers = sampleNearOffers,
    getComment = vi.fn(),
    initialEntries = [`/offer/${offer.id}`],
  } = props;

  return {
    getComment,
    ...render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route
            path="/offer/:offerId"
            element={
              <OfferData
                offer={offer}
                comments={comments}
                nearOffers={nearOffers}
                getComment={getComment}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    ),
  };
};

describe('OfferData', () => {
  beforeEach(() => {
    commentFormProps = null;
    vi.mocked(useEmail).mockReturnValue('user@example.com');
    vi.mocked(api.post).mockClear();
  });

  // Заголовок, тип, спальни, взрослые, цена — из props.offer
  it('renders offer title, features and price', () => {
    renderOfferData();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      sampleOffer.title,
    );
    expect(screen.getByText(sampleOffer.type)).toBeInTheDocument();
    expect(
      screen.getByText(`${sampleOffer.bedrooms} Bedrooms`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Max ${sampleOffer.maxAdults} adults`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`€${sampleOffer.price}`, { exact: false }),
    ).toBeInTheDocument();
  });

  // Рейтинг: число и ширина полоски rating/5*100%
  it('renders rating value and star width', () => {
    renderOfferData();

    expect(screen.getByText(String(sampleOffer.rating))).toBeInTheDocument();
    const ratingBar = document.querySelector(
      '.offer__stars span:not(.visually-hidden)',
    );
    expect(ratingBar).toHaveStyle({
      width: `${(sampleOffer.rating / 5) * 100}%`,
    });
  });

  // isPremium: true → блок Premium; false → блока нет
  it('shows Premium mark only for premium offers', () => {
    const { unmount } = renderOfferData({
      offer: makeOffer({ isPremium: true }),
    });
    expect(screen.getByText('Premium')).toBeInTheDocument();
    unmount();

    renderOfferData({ offer: makeOffer({ isPremium: false }) });
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  // Галерея: по одной картинке на каждый URL в offer.images
  it('renders gallery images from offer.images', () => {
    const { container } = renderOfferData();

    const images = container.querySelectorAll('.offer__image');
    expect(images).toHaveLength(sampleOffer.images.length);
    sampleOffer.images.forEach((src, index) => {
      expect(images[index]).toHaveAttribute('src', src);
    });
  });

  // Хост: имя, статус Pro, аватар
  it('renders host name, Pro status and avatar', () => {
    renderOfferData();

    expect(screen.getByText(sampleOffer.host.name)).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByAltText('Host avatar')).toHaveAttribute(
      'src',
      sampleOffer.host.avatarUrl,
    );
  });

  // Пустой avatarUrl → запасной img/avatar-angelina.jpg
  it('uses fallback host avatar when avatarUrl is empty', () => {
    renderOfferData({
      offer: makeOffer({ host: { name: 'Max', avatarUrl: '', isPro: false } }),
    });

    expect(screen.getByAltText('Host avatar')).toHaveAttribute(
      'src',
      'img/avatar-angelina.jpg',
    );
    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  // В заголовке отзывов — фактическая длина comments
  it('shows reviews count from comments length', () => {
    renderOfferData({ comments: sampleComments });

    expect(screen.getByTestId('reviews-amount')).toHaveTextContent(
      String(sampleComments.length),
    );
  });

  // При >10 комментариев оставляются последние 10 (splice с начала)
  it('keeps only the last 10 comments when there are more', () => {
    const manyComments = Array.from({ length: 12 }, (_, i) =>
      makeComment({ id: String(i + 1), comment: `Review ${i + 1}` }),
    );

    renderOfferData({ comments: manyComments });

    expect(screen.getByTestId('reviews-amount')).toHaveTextContent('10');
    expectMockProps('Comments', {
      data: manyComments.slice(-10),
      bemBlock: 'reviews',
    });
  });

  describe('child components', () => {
    // goods уходят в OfferInsideList
    it('passes offer.goods to OfferInsideList', () => {
      renderOfferData();

      expectMockProps('OfferInsideList', {
        list: sampleOffer.goods,
      });
    });

    // comments и bemBlock уходят в Comments
    it('passes comments and bemBlock to Comments', () => {
      renderOfferData();

      expectMockProps('Comments', {
        data: sampleComments,
        bemBlock: 'reviews',
      });
    });

    // Карта: nearOffers + текущий offer, город и selectedPoint
    it('passes nearOffers with current offer to Map', () => {
      renderOfferData();

      expectMockProps('Map', {
        points: [...sampleNearOffers, sampleOffer],
        city: sampleOffer.city.location,
        selectedPoint: sampleOffer.id,
      });
    });

    // BookmarkButton получает id, isFavorite и размеры из оффера
    it('passes id, defaultState and size to BookmarkButton', () => {
      renderOfferData({
        offer: makeOffer({ isFavorite: true }),
      });

      expectMockProps('BookmarkButton', {
        id: sampleOffer.id,
        defaultState: true,
        bemBlock: 'offer',
        width: '31',
        height: '33',
      });
    });
  });

  describe('CommentForm', () => {
    // Авторизован (email есть) → форма комментария на экране
    it('renders CommentForm when user email is present', () => {
      renderOfferData();

      expect(getMockComponent('CommentForm')).toBeInTheDocument();
    });

    // Гость (email пустой) → формы нет
    it('does not render CommentForm when user email is empty', () => {
      vi.mocked(useEmail).mockReturnValue('');
      renderOfferData();

      expect(getMockComponents('CommentForm')).toHaveLength(0);
    });

    // submit → POST comments/:offerId из URL (initialEntries), затем getComment и очистка textarea
    it('posts comment to offerId from route, refreshes list and clears textarea', async () => {
      const routeOfferId = 'route-offer-99';
      const {getComment} = renderOfferData({
        initialEntries: [`/offer/${routeOfferId}`],
      });

      const textarea = screen.getByTestId(
        'comment-textarea',
      ) as HTMLTextAreaElement;
      textarea.value = 'draft text';

      const payload = {
        comment: 'Nice stay overall with great location nearby.',
        rating: 4,
      };
      commentFormProps?.onSubmit(payload);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith(
          `comments/${routeOfferId}`,
          payload,
        );
        expect(getComment).toHaveBeenCalledTimes(1);
        expect(textarea.value).toBe('');
      });
    });
  });
});
