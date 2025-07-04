import { memoize } from '../../data/constant';
import { TOffer } from '../../types/types';
import Card from '../card/card';

type TCardsProps = {
  offers: TOffer[];
  onHover?: (id:string | null)=>void;
  variant: 'vertical' | 'horizontal';
  classTextBlock?:string;
};

const Cards = ({ offers, ...props }: TCardsProps): JSX.Element => (
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

export default memoize(Cards);
