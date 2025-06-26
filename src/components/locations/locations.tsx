import { JSX, useEffect, useState } from 'react';
import { TCity, TCities } from '../../types/types';

type TLocationsProps = {
  cities: TCities;
  onClick: (el: TCity)=>void;
  defaultActive?:TCity;
  city?:TCity;
};

export default function Locations({ cities, onClick, city, defaultActive}: TLocationsProps): JSX.Element {
  const [active, setActive] = useState(city || defaultActive);
  useEffect(()=>{
    if(city !== undefined) {
      setActive(city);
    }
  }, [active, city]);

  return (
    <ul className="locations__list tabs__list">
      {
        cities.map((citie): JSX.Element => (

          <li className="locations__item" key={citie}>
            <div className={`locations__item-link tabs__item   ${active === citie && 'tabs__item--active'}`} onClick={() => {
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
}
