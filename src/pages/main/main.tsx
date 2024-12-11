import type { TCard } from '../../mocks/offers';
import Cards from '../../cards/cards';
import { useState } from 'react';
import { Link } from 'react-router-dom';
type MainProp = { offersCount: number; cards: TCard[] };
export default function Main({ offersCount, cards }: MainProp): JSX.Element {
  const [cardHover, setCardHover] = useState<string | null>(null);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>6 cities</title>
        <link rel="stylesheet" href="css/main.css"/>
      </head>

      <body>
        <div style={{display: 'none'}}>
          <svg xmlns="http://www.w3.org/2000/svg"><symbol id="icon-arrow-select" viewBox="0 0 7 4"><path fillRule="evenodd" clipRule="evenodd" d="M0 0l3.5 2.813L7 0v1.084L3.5 4 0 1.084V0z"></path></symbol><symbol id="icon-bookmark" viewBox="0 0 17 18"><path d="M3.993 2.185l.017-.092V2c0-.554.449-1 .99-1h10c.522 0 .957.41.997.923l-2.736 14.59-4.814-2.407-.39-.195-.408.153L1.31 16.44 3.993 2.185z"></path></symbol><symbol id="icon-star" viewBox="0 0 13 12"><path fillRule="evenodd" clipRule="evenodd" d="M6.5 9.644L10.517 12 9.451 7.56 13 4.573l-4.674-.386L6.5 0 4.673 4.187 0 4.573 3.549 7.56 2.483 12 6.5 9.644z"></path></symbol></svg>
        </div>

        <div className="page page--gray page--main">
          <header className="header">
            <div className="container">
              <div className="header__wrapper">
                <div className="header__left">
                  <Link className="header__logo-link header__logo-link--active">
                    <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41"/>
                  </Link>
                </div>
                <nav className="header__nav">
                  <ul className="header__nav-list">
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to="#">
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                        </div>
                        <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                        <span className="header__favorite-count">3</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <Link className="header__nav-link" to="#">
                        <span className="header__signout">Sign out</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>

          <main className="page__main page__main--index">
            <h1 className="visually-hidden">Cities</h1>
            <div className="tabs">
              <section className="locations container">
                <ul className="locations__list tabs__list">
                  <li className="locations__item">
                    <Link className="locations__item-link tabs__item" to="#">
                      <span>Paris</span>
                    </Link>
                  </li>
                  <li className="locations__item">
                    <Link className="locations__item-link tabs__item" to="#">
                      <span>Cologne</span>
                    </Link>
                  </li>
                  <li className="locations__item">
                    <Link className="locations__item-link tabs__item" to="#">
                      <span>Brussels</span>
                    </Link>
                  </li>
                  <li className="locations__item">
                    <Link className="locations__item-link tabs__item tabs__item--active">
                      <span>Amsterdam</span>
                    </Link>
                  </li>
                  <li className="locations__item">
                    <Link className="locations__item-link tabs__item" to="#">
                      <span>Hamburg</span>
                    </Link>
                  </li>
                  <li className="locations__item">
                    <Link className="locations__item-link tabs__item" to="#">
                      <span>Dusseldorf</span>
                    </Link>
                  </li>
                </ul>
              </section>
            </div>
            <div className="cities">
              <div className="cities__places-container container">
                <section className="cities__places places">
                  <h2 className="visually-hidden">Places</h2>
                  <b className="places__found">{offersCount} places to stay in Amsterdam</b>
                  <form className="places__sorting" action="#" method="get">
                    <span className="places__sorting-caption">Sort by</span>
                    <span className="places__sorting-type" tabIndex={0}>
                              Popular
                      <svg className="places__sorting-arrow" width="7" height="4">
                        <use xlinkHref="#icon-arrow-select"></use>
                      </svg>
                    </span>
                    <ul className="places__options places__options--custom places__options--opened">
                      <li className="places__option places__option--active" tabIndex={0}>Popular</li>
                      <li className="places__option" tabIndex={0}>Price: low to high</li>
                      <li className="places__option" tabIndex={0}>Price: high to low</li>
                      <li className="places__option" tabIndex={0}>Top rated first</li>
                    </ul>
                  </form>
                  <Cards cards={cards} classBlock='cities' classFraper="cities__places-list tabs__content" onHover={(id)=>{
                    setCardHover(id);
                  }}
                  />
                </section>
                <div className="cities__right-section">
                  <section className="cities__map map"></section>
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
