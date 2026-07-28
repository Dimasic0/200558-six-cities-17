import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Comment from './comment';
import type { TComment } from '../../types/types';
import {
  expectAttributeTestId,
  expectTestIdToHaveClass,
  expectTestIdToTextContent,
} from '../../library/test/test';

const makeComment = (overrides: Partial<TComment> = {}): TComment => ({
  id: '1',
  date: '2019-04-24',
  comment: 'A quiet cozy and picturesque that hides behind a river',
  rating: 4,
  ...overrides,
  user: {
    name: 'Max',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: false,
    ...overrides.user,
  },
});

const renderComment = (overrides: Partial<TComment> = {}) =>
  render(<Comment {...makeComment(overrides)} />);

describe('Comment', () => {
  // Имя автора берётся из user.name
  it('renders user name', () => {
    renderComment({ user: { name: 'Angelina', avatarUrl: '/img/a.jpg', isPro: true } });

    expectTestIdToTextContent(['comment-user-name', 'Angelina']);
  });

  // Текст отзыва — prop comment
  it('renders comment text', () => {
    renderComment({ comment: 'Great place to stay!' });

    expectTestIdToTextContent(['comment-text', 'Great place to stay!']);
  });

  // Аватар: src из user.avatarUrl, фиксированный alt
  it('renders avatar with correct src and alt', () => {
    renderComment({
      user: { name: 'Max', avatarUrl: 'https://cdn.test/max.png', isPro: false },
    });

    expectAttributeTestId('comment-avatar', {
      src: 'https://cdn.test/max.png',
      width: 54,
      height: 54,
      alt: 'Reviews avatar',
    });
  });

  // width = rating / 5 * 100% (4 → 80%)
  it('sets rating stars width from rating prop', () => {
    renderComment({ rating: 4 });
    expect(screen.getByTestId('comment-rating')).toHaveStyle({ width: '80%' });
  });

  // Дата в разметке пока захардкожена (prop date не используется)
  it('renders review time', () => {
    renderComment();

    expectTestIdToTextContent(['comment-time', 'April 2019']);
    expectAttributeTestId('comment-time', { dateTime: '2019-04-24' });
    expectTestIdToHaveClass(['comment-time', 'reviews__time']);
    expect(screen.getByTestId('comment-time').tagName).toBe('TIME');
  });
});
