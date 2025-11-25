import { useCallback, useEffect, useRef, useState } from 'react';
import CommentForm, { TCommentFromEvt } from '../../components/commentForm/commentForm';
import OfferInsideList from '../../components/offerInsideList/offerInsideList';
import OfferGallery from '../../components/offerGallery/offerGallery';
import Comments from '../../components/comments/comments.tsx';
import Header from '../../components/header/header';
import Cards from '../../components/cards/cards';
import { TComment, TOffer, TOffers, TPropSignal } from '../../types/types';
import { TOfferGalleryChildren } from '../../components/offerGallery/offerGallery';
import Map, { point } from '../../components/map/map';
import { useEmail } from '../../store/selectors';
import Loading from '../../components/loading/loading.tsx';
import { useParams } from 'react-router-dom';
import { api } from '../../api.ts';


export default function Offer() {
  const [offer, setOffer] = useState<TOffer>();
  const [nearOffers, setNearOffers] = useState<TOffers[]>([]);

  nearOffers.length = Math.min(3, nearOffers.length);
  const mapOffers: point[] = [...nearOffers];
  if(offer) {
    mapOffers.push(offer);
  }

  const [comments, setComments] = useState<TComment[]>([]);
  if(comments.length > 10) {
    comments.splice(0, comments.length - 10);
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const email = useEmail();

  const { offerId } = useParams();

  let offerGalleryParams: TOfferGalleryChildren[] = [];
  if (offer !== undefined) {
    offerGalleryParams = offer.images.map((el, i) => ({ src: el, alt: '', id: `${i}` }));
  }
  const getComment = ({ signal }: TPropSignal) => {
    api.get<TComment[]>(`comments/${offerId}`, { signal }).then(({ data }) => {
      setComments(data);
    });
  };
  const requestsController = new AbortController();
  const onCommentFormSubmit = useCallback((evt: TCommentFromEvt) => {
    const textarea = textareaRef.current as HTMLTextAreaElement;
    api.post(`comments/${offerId}`, evt).then(() => {
      getComment(requestsController);
      textarea.value = '';

    });
  },[]);

  useEffect(() => {
    api.get<TOffer>(`offers/${offerId}`, { signal: requestsController.signal }).then(({ data }) => {
      setOffer(data);
    });
    api.get<TOffers[]>(`offers/${offerId}/nearby`, { signal: requestsController.signal }).then(({ data }) => {
      setNearOffers(data);
    });
    getComment(requestsController);
    return () => requestsController.abort();
  }, []);
  return (
    <div className="page">
      {offer === undefined ?

        <Loading />

        :
        <>
          <Header isAuthorized />

          <main className="page__main page__main--offer">
            <section className="offer">
              <div className="offer__gallery-container container">
                <OfferGallery>{offerGalleryParams}</OfferGallery>
              </div>
              <div className="offer__container container">
                <div className="offer__wrapper">
                  {offer.isPremium &&
                    <div className="offer__mark">
                      <span>Premium</span>
                    </div>}
                  <div className="offer__name-wrapper">
                    <h1 className="offer__name">{offer.title}</h1>
                    <button className="offer__bookmark-button button" type="button">
                      <svg className="offer__bookmark-icon" width="31" height="33">
                        <use xlinkHref="#icon-bookmark"></use>
                      </svg>
                      <span className="visually-hidden">To bookmarks</span>
                    </button>
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
            <div className="container">
              <section className="near-places places">
                <h2 className="near-places__title">Other places in the neighbourhood</h2>
                <div className="near-places__list places__list">
                  <Cards offers={nearOffers}
                    variant='vertical'
                  />
                </div>
              </section>
            </div>
          </main>
        </>}
    </div>
  );
}
