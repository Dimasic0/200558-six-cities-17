import { JSX, useEffect, useState, memo } from 'react';
import { TCity, TCities } from '../../types/types';

export type TLocationsProps = {
  cities: TCities;
  onClick: (el: TCity)=>void;
  defaultActive?:TCity;
  city?:TCity;
};

const LocationsFun = ({ cities, onClick, city, defaultActive}: TLocationsProps): JSX.Element => {
  const [active, setActive] = useState(city || defaultActive);
  useEffect(()=>{
    if(city !== undefined) {
      setActive(city);
    }
  }, [active, city]);

  return (
    <ul className="locations__list tabs__list">
      {
        cities.map((citie:TCity): JSX.Element => (

          <li className="locations__item" key={citie}>
            <div className={`locations__item-link tabs__item   ${active === citie ? 'tabs__item--active' : ''}`} onClick={() => {
              setActive(citie); onClick(citie);
            }}
            >
              <span>{citie}</span>
            </div>
          </li>

        ))
      }
    </ul>
  );
};

export const Locations = memo(LocationsFun);
