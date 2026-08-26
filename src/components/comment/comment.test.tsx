import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TComment } from '../../types/types';
import Comment from './comment';

describe('Comment', () => {
  const commentProps: TComment = {
    id: '1',
    date: '2019-04-24',
    user: {
      name: 'Max',
      avatarUrl: 'avatar.jpg',
      isPro: false,
    },
    comment: 'A quiet place for a great holiday.',
    rating: 4,
  };

  it('renders data matching props', () => {
    const { container } = render(<Comment {...commentProps} />);

    expect(screen.getByText(commentProps.user.name)).toBeInTheDocument();
    expect(screen.getByText(commentProps.comment)).toBeInTheDocument();

    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toHaveAttribute('src', commentProps.user.avatarUrl);

    const ratingBar = container.querySelector('.reviews__stars > span:first-child');
    expect(ratingBar).toHaveStyle({ width: `${commentProps.rating / 5 * 100}%` });
  });
});
