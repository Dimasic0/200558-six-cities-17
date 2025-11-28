import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CommentForm, TCommentFromEvt } from '../../components/commentForm/commentForm';
import OfferInsideList from '../../components/offerInsideList/offerInsideList';
import OfferGallery from '../../components/offerGallery/offerGallery';
import Comments from '../../components/comments/comments.tsx';
import {Header} from '../../components/header/header';
import Cards from '../../components/cards/cards';
import { jsxElementNull, TComment, TOffer, TOffers, TPropSignal } from '../../types/types';
// import { TOfferGalleryChildren } from '../../components/offerGallery/offerGallery';
import Map, { point } from '../../components/map/map';
import { useEmail } from '../../store/selectors';
import Loading from '../../components/loading/loading.tsx';
import { useParams } from 'react-router-dom';
import { api } from '../../api.ts';
import { JSX } from 'react';
import { OfferData } from '../../components/offerData/OfferData.tsx';


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
  const OfferGallery = useMemo(() => (
    <div className="offer__gallery">
      {
        offer?.images.map((el, i) => (
          <div className="offer__image-wrapper" key={i}>
            <img className='offer__image' src={el} />
          </div>
        ))
      }
    </div>
  ), [offer?.images]);
  const getComment = ({ signal }: TPropSignal) => {
    api.get<TComment[]>(`comments/${offerId}`, { signal }).then(({ data }) => {
      setComments(data);
    });
  };
  const requestsController = useMemo(()=>new AbortController(),[]);
  
  const getCommentController = useCallback(() => getComment(requestsController), []); 

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
          <Header/>

          <main className="page__main page__main--offer">
            <OfferData offer={offer} comments={comments} nearOffers={nearOffers} getComment={getCommentController}/>
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
