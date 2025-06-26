import { memoize } from '../../data/constant';
import { TOffer } from '../../types/types';
import Card from '../card/card';

type TCardsProps = {
  offers: TOffer[];
  onHover?: (id:string | null)=>void;
  variant: 'vertical' | 'horizontal';
  classTextBlock?:string;
};

function CardsFunc({ offers,...props}: TCardsProps):JSX.Element {
  // const config = {
  //   vertical:  'cities__places-list',
  //   horizontal: 'favorites',
  // } as const;

  return (
    <>
      {
        offers.map((el: TOffer): JSX.Element => (
          <Card
            offer={el}
            key={el.id}
            {...props}
          />
        ))
      }
    </>
  );
}

const Cards = memoize(CardsFunc);

export default Cards;
