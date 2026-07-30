import { type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Comments from './comments';
import type { TComment } from '../../types/types';
import {
  expectMockProps,
  getMockComponents,
} from '../../library/test/test';

// Заглушка вместо реального Comment: проверяем только проброс props из Comments.
// async import — иначе createMockComponent будет undefined из‑за hoist vi.mock.
vi.mock('../comment/comment', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return {
    default: createMockComponent('Comment'),
  };
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

const sampleComments = [
  makeComment({ id: '1', comment: 'First review', rating: 5 }),
  makeComment({ id: '2', comment: 'Second review', rating: 3, user: { name: 'Angelina', avatarUrl: '/a.jpg', isPro: true } }),
  makeComment({ id: '3', comment: 'Third review', rating: 4 }),
];

type TCommentsTestProps = Partial<ComponentProps<typeof Comments>>;

const renderComments = (props: TCommentsTestProps = {}) => {
  const {
    data = sampleComments,
    bemBlock = 'reviews',
  } = props;

  return render(<Comments data={data} bemBlock={bemBlock} />);
};

describe('Comments', () => {
  // Контейнер списка — всегда ul.reviews__list
  it('renders reviews list container', () => {
    renderComments();

    expect(screen.getByRole('list')).toHaveClass('reviews__list');
  });

  // Пустой data — список без дочерних Comment
  it('renders no comments when data is empty', () => {
    renderComments({ data: [] });

    expect(getMockComponents('Comment')).toHaveLength(0);
  });

  // В каждый Comment уходит свой объект отзыва (поля TComment)
  it('passes each comment fields to the corresponding Comment', () => {
    renderComments({ data: sampleComments });

    const comments = getMockComponents('Comment');
    sampleComments.forEach((comment, index) => {
      expectMockProps(comments[index], comment);
    });
  });

  // Общий bemBlock пробрасывается во все Comment вместе с полями отзыва
  it('forwards bemBlock to every Comment', () => {
    renderComments({ data: sampleComments, bemBlock: 'reviews' });

    getMockComponents('Comment').forEach((comment) => {
      expectMockProps(comment, { bemBlock: 'reviews' });
    });
  });
});
