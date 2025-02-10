import { TOffer } from '../../types/types';
import { СITIES } from '../../data/constant';
import Cards from '../../components/cards/cards';
import { useState } from 'react';
import Map from '../../components/map/map';
import Locations from '../../components/locations/locations';
import { setCity } from '../../store/action';
import Header from '../../components/header/header';
import { useOffersByCity } from '../../store/selectors';
import { useDispatch } from 'react-redux';

let offer: TOffer[];

export default function Main() {
  const dispatch = useDispatch();
  const [cardHover, setCardHover] = useState<string | null>(null);
  offer = useOffersByCity();
  return (
    <div className="page page--gray page--main">
      <Header/>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <Locations onClick={(сity) => dispatch(setCity(сity))} cities={СITIES} />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{offer?.length} places to stay in Amsterdam</b>
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
              <Cards offers={offer}
                onHover={(id)=>{
                  setCardHover(id);
                }}
                variant="vertical"
              />
            </section>
            <div className="cities__right-section">
              <section className="cities__map map">
                <Map points={offer}
                  selectedPoint={cardHover}
                  city={offer?.[0].city.location}
                />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
