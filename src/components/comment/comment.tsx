import { TComment } from '../../types/types';

type TCommentProps = TComment & {bemBlock: string};
export default function Comment({ comment, rating, user, bemBlock }: TCommentProps) {
  const widthRating = `${rating / 5 * 100}%`;
  return (
    <li className={`${bemBlock}__item`}>
      <div className={`${bemBlock}__user user`}>
        <div className={`${bemBlock}__avatar-wrapper user__avatar-wrapper`}>
          <img
            className={`${bemBlock}__avatar user__avatar`}
            src={user.avatarUrl}
            width={54}
            height={54}
            alt="Reviews avatar"
          />
        </div>
        <span className={`${bemBlock}__user-name`}>{user.name}</span>
      </div>
      <div className={`${bemBlock}__info`}>
        <div className={`${bemBlock}__rating rating`}>
          <div className={`${bemBlock}__stars rating__stars`}>
            <span style={{ width: widthRating }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className={`${bemBlock}__text`}>
          {comment}
        </p>
        <time className={`${bemBlock}__time`} dateTime="2019-04-24">
          April 2019
        </time>
      </div>
    </li>
  );
}
