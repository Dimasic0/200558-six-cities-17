import Cards from '../../components/cards/cards';
import { useState } from 'react';
import Map from '../../components/map/map';
import Header from '../../components/header/header';
import { useOffers } from '../../store/selectors';
import PlacesOptions from '../../components/placesOptions/placesOptions';
import Loading from '../../components/loading/loading';

const PlacesOptionsParams = [
  'Popular',
  'Price: low to high',
  { children: 'Price: high to low', style: { backgroundColor: 'blue' }, key: 'blue' },
  'Top rated first'
];

export default function Main() {
  const [cardHover, setCardHover] = useState<string | null>(null);
  const offers = useOffers();

  const offersLength = offers.length;

  return (
    <div className="page page--gray page--main">
      {offersLength < 0 ?
        <Loading />
        :
        <>
          <Header />
          <main className="page__main page__main--index">
            <h1 className="visually-hidden">Cities</h1>
            <div className="tabs">
              <section className="locations container">
                <Loading />
              </section>
            </div>
            <div className="cities">
              { offersLength > 0 ?
                <div className="cities__places-container container">
                  <section className="cities__places places">
                    <h2 className="visually-hidden">Places</h2>
                    <b className="places__found">{offers?.length} places to stay in Amsterdam</b>
                    <form className="places__sorting" action="#" method="get">
                      <span className="places__sorting-caption">Sort by</span>
                      <span className="places__sorting-type" tabIndex={0}>
                    Popular
                        <svg className="places__sorting-arrow" width="7" height="4">
                          <use xlinkHref="#icon-arrow-select"></use>
                        </svg>
                      </span>
                      {/* <ul className="places__options places__options--custom places__options--opened">
                        <li className="places__option places__option--active" tabIndex={0}>Popular</li>
                        <li className="places__option" tabIndex={0}>Price: low to high</li>
                        <li className="places__option" tabIndex={0}>Price: high to low</li>
                        <li className="places__option" tabIndex={0}>Top rated first</li>
                      </ul> */}
                      <PlacesOptions params={PlacesOptionsParams}/>
                    </form>
                    <div className="cities__places-list places__list tabs__content">
                      { offersLength > 0 &&
              <Cards offers={offers}
                onHover={(id)=>{
                  setCardHover(id);
                }}
                variant="vertical"
                classTextBlock="favorites__card-info"
              />}
                    </div>
                  </section>
                  <div className="cities__right-section">
                    <section className="cities__map map">
                      {offersLength > 0 &&
                <Map points={offers}
                  selectedPoint={cardHover}
                  city={offers?.[0]?.city.location}
                />}
                    </section>
                  </div>
                </div>
                :
                <div className="cities__places-container cities__places-container--empty container">
                  <section className="cities__no-places">
                    <div className="cities__status-wrapper tabs__content">
                      <b className="cities__status">No places to stay available</b>
                      <p className="cities__status-description">We could not find any property available at the moment in Dusseldorf</p>
                    </div>
                  </section>
                  <div className="cities__right-section"></div>
                </div>}
            </div>
          </main>
        </>}
    </div>
  );
}
