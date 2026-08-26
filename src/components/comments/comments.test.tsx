import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Comments from './comments';
import type { TComment } from '../../types/types';

const { mockComment } = vi.hoisted(() => ({
  mockComment: vi.fn(),
}));

vi.mock('../comment/comment', () => ({
  default: mockComment,
}));

describe('Comments', () => {
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
    makeComment({
      id: '2',
      comment: 'Second review',
      rating: 3,
      user: { name: 'Angelina', avatarUrl: '/a.jpg', isPro: true },
    }),
    makeComment({ id: '3', comment: 'Third review', rating: 4 }),
  ];

  const bemBlock = 'reviews';

  beforeEach(() => {
    mockComment.mockClear();
  });

  const renderComments = (data: TComment[] = sampleComments) => {
    render(<Comments data={data} bemBlock={bemBlock} />);
  };

  const expectCommentsToReceiveData = (commentsList: TComment[]) => {
    expect(mockComment).toHaveBeenCalledTimes(commentsList.length);

    commentsList.forEach((comment, index) => {
      expect(mockComment.mock.calls[index][0]).toEqual(expect.objectContaining({
        ...comment,
        bemBlock,
      }));
    });
  };

  // По одному Comment на каждый элемент data
  it.each<[string, TComment[]]>([
    ['one comment', [sampleComments[0]]],
    ['three comments', sampleComments],
  ])('passes matching comment props to Comment when data has %s', (_, commentsList) => {
    renderComments(commentsList);
    expectCommentsToReceiveData(commentsList);
  });

  // Пустой data — список без дочерних Comment
  it('does not render Comment when data is empty', () => {
    renderComments([]);

    expect(mockComment).not.toHaveBeenCalled();
  });
});
