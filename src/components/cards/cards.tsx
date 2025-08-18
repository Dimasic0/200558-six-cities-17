import { memoize } from '../../data/constant';
import { TOffers } from '../../types/types';
import Card from '../card/card';

type TCardsProps = {
  offers: TOffers[];
  onHover?: (id:string | null)=>void;
  variant: 'vertical' | 'horizontal';
  classTextBlock?:string;
};

const Cards = ({ offers, ...props }: TCardsProps): JSX.Element => (
  <>
    {
      offers.map((el: TOffers): JSX.Element => (
        <Card
          offer={el}
          key={el.id}
          {...props}
        />
      ))
    }
  </>
);

export default memoize(Cards);
