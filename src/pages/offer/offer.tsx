import { useEffect, useState } from 'react';
import CommentForm from '../../components/commentForm/commentForm';
import OfferInsideList from '../../components/offerInsideList/offerInsideList';
import OfferGallery from '../../components/offerGallery/offerGallery';
import Comments from '../../components/comments/comments.tsx';
import Header from '../../components/header/header';
import Cards from '../../components/cards/cards';
import { TComment, TOffer, TDataOfferProps, TOffers, TCommentForm } from '../../types/types';
import { TOfferGalleryChildren } from '../../components/offerGallery/offerGallery';
import Map from '../../components/map/map';
import { useOffers } from '../../store/selectors';
import Loading from '../../components/loading/loading.tsx';
import {useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Offer() {
  const navigate = useNavigate();
  const [offer, setOffer] = useState<TOffer | null>(null);
  const [nearOffer, setNearOffer] = useState<TOffers[] | null>(null);

  const [comments, setComments] = useState<TComment[] | null>(null);
  console.log('offer=', offer);
  console.log('nearOffer=', nearOffer);
  console.log('comments=', comments);
  console.log('----------------------------------------');
  const [cardHover, setCardHover] = useState<string | null>(null);

  const offers = useOffers();

  const {id} = useParams();

  let offerGalleryParams: TOfferGalleryChildren[];
  if (offer !== null) {
    offerGalleryParams = offer.images.map((el,i) => ({src:el, alt: '', id: `${i}`}));
  }

  const requests = () => {
    const controller = new AbortController();
    (async () => {
      let res = await axios.get<TOffer>(`offers/${id}`, { signal: controller.signal }).catch(() => navigate('*'));
      setOffer(res.data);
      res = await axios.get<TOffers[]>(`offers/${id}/nearby`, { signal: controller.signal });
      setNearOffer(res.data);
      res = await axios.get(`comments/${id}`, { signal: controller.signal });
      setComments(res.data);
    })();
    return controller;
  };

  const onCommontFormSubmit = (evt: TCommentForm) => {
    console.log('onCommontFormSubmit evt=',evt, 'axios=', axios.defaults);
    axios.post(`comments/${id}`, evt).then((response)=>{
      console.log('response=', response);
      requests();
    });
  };

  useEffect(() => {
    const requestsController = requests();
    return () => requestsController.abort();
  },[]);
  return (
    <div className="page" data-t={cardHover}>
      {offer === null ?

        <Loading/>

        :
        <>
          <Header isAuthorized/>

          <main className="page__main page__main--offer">
            <section className="offer">
              <div className="offer__gallery-container container">
                {/* <div className="offer__gallery">
              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/room.jpg" alt="Photo studio" />
              </div>
              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/apartment-01.jpg" alt="Photo studio" />
              </div>
              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/apartment-02.jpg" alt="Photo studio" />
              </div>
              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/apartment-03.jpg" alt="Photo studio" />
              </div>
              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/studio-01.jpg" alt="Photo studio" />
              </div>
              <div className="offer__image-wrapper">
                <img className="offer__image" src="img/apartment-01.jpg" alt="Photo studio" />
              </div>
            </div> */}
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
                      <span style={{ width: `${offer.rating / 5 * 100 }%` }}></span>
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
                    <OfferInsideList list={offer.goods}/>
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
                    <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">1</span></h2>
                    <Comments data={comments} bemBlock="reviews"/>
                    <CommentForm onSubmit={onCommontFormSubmit} key="CommentForm" />
                  </section>
                </div>
              </div>
              <section className="offer__map map">
                <Map points={offers}
                  selectedPoint={cardHover}
                  city={offer.city.location}
                />
              </section>
            </section>
            <div className="container">
              <section className="near-places places">
                <h2 className="near-places__title">Other places in the neighbourhood</h2>
                <div className="near-places__list places__list">
                  {nearOffer && <Cards offers={nearOffer}
                    variant='vertical'
                    onHover={(id) => {
                      setCardHover(id);
                    }}
                  />}
                </div>
              </section>
            </div>
          </main>
        </>}
    </div>
  );
}
