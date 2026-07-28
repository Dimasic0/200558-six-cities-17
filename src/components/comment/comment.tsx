import { TComment } from '../../types/types';

type TCommentProps = TComment;
export default function Comment({ comment, rating, user }: TCommentProps) {
  const widthRating = `${rating / 5 * 100}%`;
  return (
    <li className='reviews__item' data-testid='comment-item'>
      <div className='reviews__user user'>
        <div className='reviews__avatar-wrapper user__avatar-wrapper'>
          <img
            className='reviews__avatar user__avatar'
            data-testid='comment-avatar'
            src={user.avatarUrl}
            width={54}
            height={54}
            alt="Reviews avatar"
          />
        </div>
        <span className='reviews__user-name' data-testid='comment-user-name'>{user.name}</span>
      </div>
      <div className='reviews__info'>
        <div className='reviews__rating rating'>
          <div className='reviews__stars rating__stars'>
            <span data-testid='comment-rating' style={{ width: widthRating }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className='reviews__text' data-testid='comment-text'>
          {comment}
        </p>
        <time className='reviews__time' data-testid='comment-time' dateTime="2019-04-24">
          April 2019
        </time>
      </div>
    </li>
  );
}
