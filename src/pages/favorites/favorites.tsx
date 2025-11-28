import { Link } from 'react-router-dom';
import Cards from '../../components/cards/cards';
import {Header} from '../../components/header/header';
import { useOffersСities } from '../../store/selectors';
import Loading from '../../components/loading/loading';


export default function Favorites(): JSX.Element {
  const offers = useOffersСities();
  const CARDS_CLASSTEXTBLOCK = 'favorites__card-info';
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
                <li className="favorites__locations-items">
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <Link className="locations__item-link" to="#">
                        <span>Amsterdam</span>
                      </Link>
                    </div>
                  </div>
                  <div className="favorites__places">
                    <Cards
                      offers={offers.Amsterdam}
                      variant='horizontal'
                      classTextBlock={CARDS_CLASSTEXTBLOCK}
                    />
                  </div>
                </li>

                <li className="favorites__locations-items">
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
                </li>
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
