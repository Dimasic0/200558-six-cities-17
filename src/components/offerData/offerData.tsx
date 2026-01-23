import {JSX, memo, useCallback, useMemo, useRef } from 'react';
import { TComment, TOffer, TOffers } from '../../types/types';
import OfferInsideList from '../offerInsideList/offerInsideList';
import Comments from '../comments/comments';
import { CommentForm, TCommentFromEvt } from '../commentForm/commentForm';
import Map, { point } from '../map/map';
import { useEmail } from '../../store/selectors';
import { api } from '../../api';
import { useParams } from 'react-router-dom';
import { BookmarkButton } from '../bookmarkButton/bookmarkButton';

interface OfferContainerProp {
  offer: TOffer;
  comments: TComment[];
  nearOffers: TOffers[];
  getComment: ()=>void;
}
const OfferDataFun = ({ offer, comments, nearOffers, getComment }: OfferContainerProp): JSX.Element => {
  const email = useEmail();
  const { offerId } = useParams();
  const mapOffers: point[] = useMemo(() => [...nearOffers, offer], [nearOffers, offer]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (comments.length > 10) {
    comments.splice(0, comments.length - 10);
  }

  const onCommentFormSubmit = useCallback((evt: TCommentFromEvt) => {
    const textarea = textareaRef.current as HTMLTextAreaElement;
    api.post(`comments/${offerId}`, evt).then(() => {
      getComment();
      textarea.value = '';
    });
  },[]);

  return (
    <section className="offer">
      <div className="offer__gallery-container container">
        {useMemo(()=>(
          <div className="offer__gallery">
            {
              offer.images.map((el, i) => (
                <div className="offer__image-wrapper" key={i}>
                  <img className='offer__image' src={el} />
                </div>
              ))
            }
          </div>
        ),[offer.images])}
      </div>
      <div className="offer__container container">
        <div className="offer__wrapper">
          {offer.isPremium &&
          <div className="offer__mark">
            <span>Premium</span>
          </div>}
          {useMemo(() => (
            <>
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <BookmarkButton width="31" height="33" defoultState={offer.isFavorite} id={offer.id} bemBlock='offer' />
                {/* <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button> */}
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${offer.rating / 5 * 100}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
            Max {offer.maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <OfferInsideList list={offer.goods} />
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl || 'img/avatar-angelina.jpg'} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">
                    {offer.host.name}
                  </span>
                  <span className="offer__user-status">
                    {offer.host.isPro && 'Pro'}
                  </span>
                </div>
                <div className="offer__description">
                  <p className="offer__text">
              A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.
                  </p>
                  <p className="offer__text">
              An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.
                  </p>
                </div>
              </div>
            </>
          ), [offer])}
          <section className="offer__reviews reviews">
            <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{comments?.length}</span></h2>
            <Comments data={comments} bemBlock="reviews" />
            {email && <CommentForm onSubmit={onCommentFormSubmit} textareaRef={textareaRef} key="CommentForm" />}
          </section>
        </div>
      </div>
      <section className="offer__map map">
        <Map points={mapOffers}
          city={offer.city.location}
          selectedPoint={offer.id}
        />
      </section>

    </section>
  );
};
export const OfferData = memo(OfferDataFun);
