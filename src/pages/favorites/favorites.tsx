import { Link } from 'react-router-dom';
import Cards from '../../components/cards/cards';
import {Header} from '../../components/header/header';
import { useFavorites, useOffersСities } from '../../store/useSelectors/useSelectors';
import Loading from '../../components/loading/loading';
import { useEffect } from 'react';
import {  rqFavoriteGet } from '../../store/action/action';
import { useAppDispatch } from '../../store';


export default function Favorites(): JSX.Element {
  const dispatch = useAppDispatch();

  const offers = useOffersСities();
  const favorites = useFavorites();

  const CARDS_CLASSTEXTBLOCK = 'favorites__card-info';

  useEffect(()=>{
    const controller = new AbortController();
    dispatch(rqFavoriteGet(controller.signal));
  },[]);

  return (
    <div className="page">
      <Header />

      {!offers ?
        <Loading/>
        :
        <main className="page__main page__main--favorites">
          <div className="page__favorites-container container">
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {
                  favorites.map((offers)=>(
                    <li className="favorites__locations-items" key={offers[0].city.name}>
                      <div className="favorites__locations locations locations--current">
                        <div className="locations__item">
                          <Link className="locations__item-link" to="#">
                            <span>{offers[0].city.name}</span>
                          </Link>
                        </div>
                      </div>
                      <div className="favorites__places">
                        <Cards
                          offers={offers}
                          variant='horizontal'
                          classTextBlock={CARDS_CLASSTEXTBLOCK}
                        />
                      </div>
                    </li>
                  ))
                }
                {/* <li className="favorites__locations-items">
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <Link className="locations__item-link" to="#">
                        <span>Cologne</span>
                      </Link>
                    </div>
                  </div>
                  <div className="favorites__places">
                    <Cards
                      offers={offers.Cologne}
                      variant='horizontal'
                      classTextBlock={CARDS_CLASSTEXTBLOCK}
                    />
                  </div>
                </li> */}
              </ul>
            </section>
          </div>
        </main>}
      <footer className="footer container">
        <Link className="footer__logo-link" to="main.html">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </Link>
      </footer>
    </div>
  );
}
