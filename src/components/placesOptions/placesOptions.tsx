import { ComponentProps } from 'react';
import { memoize } from '../../data/constant';

type TPlacesOptions = { params: ((ComponentProps<'li'> & {key?: string}) | string)[]};

const PlacesOptions = ({ params }: TPlacesOptions) => (
  <ul className="places__options places__options--custom places__options--opened">
    {
      params.map((el) => (
        <li className="places__option" tabIndex={0} {...(typeof el === 'object' ? el : {children: el})} />
      ))
    }
  </ul>
);

export default memoize(PlacesOptions);
