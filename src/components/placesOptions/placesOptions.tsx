import { ComponentProps } from "react";
import { memoize } from "../../data/constant";

type TPlacesOptions = { params: ((ComponentProps<'li'> & {key?: string}) | string)[]};

const PlacesOptionsFun = ({ params }: TPlacesOptions) =>(
  <ul className="places__options places__options--custom places__options--opened">
    {
      params.map((el) => (
        <li className="places__option" tabIndex={0} {...(typeof el === 'object' ? el : {children: el})} />
      ))
    }
  </ul>
);

const PlacesOptions = memoize(PlacesOptionsFun);

export default PlacesOptions;
