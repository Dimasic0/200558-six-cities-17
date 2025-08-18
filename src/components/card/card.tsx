import { TOffers } from '../../types/types';
import { Link } from 'react-router-dom';
import cls from 'classnames';
import { memoize } from '../../data/constant';

type TCardProps = {
  offer: TOffers & { point?: object };
  onHover?: (id: string | null) => void;
  variant: 'vertical' | 'horizontal';
  classTextBlock?: string;
};

type TSetConfig = {className:string; width: number; height: number};
const setConfig = (className: string, width: number, height: number): TSetConfig => ({
  className,
  width,
  height,
});

const configs = {
  vertical: setConfig('cities', 260, 200),
  horizontal: setConfig('favorites', 150, 110)
} as const;

function Card({ offer, variant, onHover = () => { }, classTextBlock = ''}: TCardProps): JSX.Element {
  const config = configs[variant];
  const raringWidth = `${offer?.rating * 20}%`;
  return (
    <article
      className={`${config.className}__card place-card`}
      onMouseEnter={() => onHover(offer.id)}
      onMouseLeave={() => onHover(null)}
    >
      {offer.isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}
      <div className={`${config.className}__image-wrapper place-card__image-wrapper`}>
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
      <div className={`${classTextBlock} place-card__info`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">{offer.price}</b>
            <span className="place-card__price-text">/&nbsp;night</span>
          </div>
          <button className={cls('place-card__bookmark-button', { 'place-card__bookmark-button--active': offer.isFavorite }, 'button')} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg><span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: raringWidth }}></span>
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

export default memoize(Card);
