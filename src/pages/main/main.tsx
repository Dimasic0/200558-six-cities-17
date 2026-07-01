import Cards from '../../components/cards/cards';
import {useCallback, useEffect, useMemo, useState } from 'react';
import Map from '../../components/map/map';
import {Header} from '../../components/header/header';
import { useOffers } from '../../store/useSelectors';
import {Locations} from '../../components/locations/locations';
import { cityDefault, СITIES } from '../../data/constant';
import { TCity } from '../../types/types';
import { FormSorting } from '../../components/sorting/sorting';
import { sortingName } from '../../data/constant';
import { TSortingName } from '../../data/constant';
import {Spinner} from '../../components/spinner/spinner';
import { getOffers, setCity } from '../../store/action';
import { useAppDispatch } from '../../store';

export default function Main() {

  const [cardHover, setCardHover] = useState<string | null>(null);
  const [sorting, setSorting] = useState<TSortingName>(sortingName.popular);

  const offers = useOffers();
  console.log('offers=', offers);

  const offersLength = offers.length;
  const dispatch = useAppDispatch();


  const onLocationsClick = useCallback((city:TCity) => {
    dispatch(setCity(city));
  },[]);

  const offersSort = useMemo(()=>{
    switch (sorting) {
      case sortingName.low:
        return offers.toSorted((a,b) => a.price - b.price);
      case sortingName.high:
        return offers.toSorted((a,b) => b.price - a.price);
      case sortingName.rated:
        return offers.toSorted((a,b) => a.rating - b.rating);
    }
    return [...offers];
  }, [sorting ,offers]);

  useEffect(() => {
    const controller = new AbortController();
     dispatch(getOffers(controller.signal));
  },[]);

  return (
    <div className="page page--gray page--main">
      {offersLength < 1 ?
        <Spinner />
        :
        <>
          <Header />
          <main className="page__main page__main--index">
            <h1 className="visually-hidden">Cities</h1>
            <div className="tabs">
              <section className="locations container">
                <Locations cities={СITIES} onClick={onLocationsClick} defaultActive={cityDefault} />
              </section>
            </div>
            <div className="cities">
              {offersLength > 0 ?
                <div className="cities__places-container container">
                  <section className="cities__places places">
                    <h2 className="visually-hidden">Places</h2>
                    <b className="places__found">{offersSort?.length} places to stay in Amsterdam</b>
                    <form className="places__sorting" action="#" method="get">
                      <span className="places__sorting-caption">Sort by </span>
                      <FormSorting onClick={setSorting}/>
                    </form>
                    <div className="cities__places-list places__list tabs__content">
                      {offersLength > 0 &&
                        <Cards offers={offersSort}
                          onHover={setCardHover}
                          variant="vertical"
                          classTextBlock="favorites__card-info"
                        />}
                    </div>
                  </section>
                  <div className="cities__right-section">
                    <section className="cities__map map">
                      {offersLength > 0 &&
                        <Map points={offersSort}
                          selectedPoint={cardHover}
                          city={offers[0].city.location}
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

