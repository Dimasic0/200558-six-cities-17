import { memoize } from '../../data/constant';

type TOfferInsideList = { list:string[]};

function OfferInsideList({ list }: TOfferInsideList):JSX.Element {
  return (
    <ul className="offer__inside-list">
      {
        list.map((el) => (
          <li className="offer__inside-item" key={el}>
            {el}
          </li>
        ))
      }
    </ul>
  );
}

export default memoize(OfferInsideList, (oldProps, newProps) => JSON.stringify(oldProps) === JSON.stringify(newProps));
