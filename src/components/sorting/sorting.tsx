import { useState } from 'react';
import { sortingName } from '../../data/constant';
import { TSortingName } from '../../data/constant';

type TFormSorting ={
  onClick: (el: TSortingName) => void;
};

const FormSorting = ({ onClick }: TFormSorting):JSX.Element => {
  const [isDisclosed, setIsDisclosed] = useState(false);
  const [active, setActive] = useState<TSortingName>('Popular');

  function onLiClick(el: TSortingName) {
    setActive(el);
    setIsDisclosed(false);
    onClick(el);
  }

  return(
    <>
      <span className="places__sorting-type" tabIndex={0} onClick={() => setIsDisclosed(!isDisclosed)}>
        {active}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      {
        isDisclosed &&
    <ul className="places__options places__options--custom places__options--opened">
      {/* <li className="places__option" tabIndex={0} onClick={() => setActive('Popular')}>Popular</li>
      <li className="places__option" tabIndex={1} onClick={() => setActive('Price: low to high')}>Price: low to high</li>
      <li className="places__option" tabIndex={2} style={{ backgroundColor: 'blue' }} onClick={() => setActive('Price: high to low')}>Price: high to low</li>
      <li className="places__option" tabIndex={3} onClick={() => setActive('Top rated first')}>Top rated first</li> */}
      {
        [sortingName.popular, sortingName.low, sortingName.high, sortingName.rated].map((el: TSortingName)=>(
          <li className="places__option" tabIndex={0} onClick={() => onLiClick(el)} style={ active === el ? {backgroundColor:'blue' } : undefined} key={el}>{el}</li>
        ))
      }
    </ul>
      }
    </>);
};

export { FormSorting };
