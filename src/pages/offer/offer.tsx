import { useEffect, useState } from 'react';
import CommentForm from '../../components/commentForm/commentForm';
import OfferInsideList from '../../components/offerInsideList/offerInsideList';
import OfferGallery from '../../components/offerGallery/offerGallery';
import Comments from '../../components/comments/comments.tsx';
import Header from '../../components/header/header';
import Cards from '../../components/cards/cards';
import { TComment, TOffer, TDataOfferProps, TOffers } from '../../types/types';
import { TOfferGalleryChildren } from '../../components/offerGallery/offerGallery';
import Map from '../../components/map/map';
import { useOffers } from '../../store/selectors';
import Loading from '../../components/loading/loading.tsx';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Offer() {
  const [offer, setOffer] = useState<TOffer | null>(null);
  const [nearOffer, setNearOffer] = useState<TOffers[]>(null);

  const [comments, setComments] = useState<TComment[] | null>(null);
  console.log('use comments=', comments);
  const [cardHover, setCardHover] = useState<string | null>(null);

  const offers = useOffers();

  const {id} = useParams();

  let offerGalleryParams: TOfferGalleryChildren[];
  if (offer !== null) {
    offerGalleryParams = offer.images.map((el,i) => ({src:el, alt: '', id: `${i}`}));
  }

  // const offerGalleryParams = [
  //   { src: 'img/room.jpg', alt: 'Photo studio', id: '1' },
  //   { src: 'img/apartment-01.jpg', alt: 'Photo studio', id: '2' },
  //   { src: 'img/apartment-02.jpg', alt: 'Photo studio', id: '3' },
  //   { src: 'img/apartment-03.jpg', alt: 'Photo studio', id: '4' },
  //   { src: 'img/studio-01.jpg', alt: 'Photo studio', id: '5' },
  //   { src: 'img/apartment-01.jpg', alt: 'Photo studio', id: '6' },
  // ];

  const onCommontFormSubmit = (evt) => {
    console.log('onCommontFormSubmit evt=', { "comment": evt.text, "rating": evt.rating }, 'axios=', axios.defaults);
    axios.post(`comments/${id}`, evt).then((response)=>{
      console.log('response=', response);
    });
  };
  // const comments: TComment[] = [{
  //   id: 'b67ddfd5-b953-4a30-8c8d-bd083cd6b62a',
  //   date: '2019-05-08T14:13:56.569Z',
  //   user: {
  //     name: 'Oliver Conner',
  //     avatarUrl: 'https://url-to-image/image.png',
  //     isPro: false
  //   },
  //   comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
  //   rating: 4
  // },
  // {
  //   id: 'b67ddfd5-b953-4a30-8c8d-bd083cd6b63a',
  //   date: '2019-05-08T14:13:56.569Z',
  //   user: {
  //     name: 'IVan budco',
  //     avatarUrl: 'https://url-to-image/image.png',
  //     isPro: false
  //   },
  //   comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
  //   rating: 3
  // }];
  useEffect(()=>{
    const controllerOffer = new AbortController();
    const controllerNearOffer = new AbortController();
    const controllerComments = new AbortController();
    axios.get(`offers/${id}`, { signal: controllerOffer.signal }).then(({ data }: TDataOfferProps) => {
      console.log('offer=', data);
      setOffer(data);
    });
    axios.get(`offers/${id}/nearby`, { signal: controllerNearOffer.signal }).then(({ data }: TDataOfferProps) => {
      console.log('offer rad=', data);
      setNearOffer(data);
    });
    axios.get(`comments/${id}`, { signal: controllerComments.signal }).then(({ data }: TDataOfferProps) => {
      console.log('comment=', data);
      setComments(data);
    });
    return () => {
      controllerOffer.abort();
      controllerNearOffer.abort();
      controllerComments.abort();
    };
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
                    }}/>}
                </div>
              </section>
            </div>
          </main>
        </>}
    </div>
  );
}
