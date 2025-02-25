import { TOffer } from '../../types/types';
import { Link } from 'react-router-dom';
import cls from 'classnames';

 type TCardProps = {
   offer: TOffer & { point?:object};
  onHover?: (id: string | null) => void;
  variant: 'vertical' | 'horizontal';
};

export function Card({ offer, variant, onHover = ()=>{} }: TCardProps): JSX.Element {
  const configs = {
    vertical: {
      class: 'cities',
      width: 260,
      height: 200
    },
    horizontal: {
      class: 'favorites',
      width: 150,
      height: 110
    },
  } as const;
  const config = configs[variant];
  const RARING_WIDTH = `${offer?.rating / 5 * 100} %`;
  return (
    <article
      className={`${config.class}__card place-card`}
      onMouseEnter={() => onHover(offer.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="place-card__mark" style={{ display: offer.isPremium ? 'block' : 'none'}}>
        <span>Premium</span>
      </div>
      <div className={`${config.class}__image-wrapper place-card__image-wrapper`}>
        <Link to={`/offer/${offer.id}`}>
          <img
            className="place-card__image"
            src={offer.previewImage}
            width={config.width}
            height={config.height}
            alt={offer.title}
          />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">{offer.price}</b>
            <span className="place-card__price-text">/&nbsp;night</span>
          </div>
          <button className={cls('place-card__bookmark-button',{'place-card__bookmark-button--active':offer.isFavorite}, 'button')} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg><span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: RARING_WIDTH }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`offer/${offer.id}`}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
}
