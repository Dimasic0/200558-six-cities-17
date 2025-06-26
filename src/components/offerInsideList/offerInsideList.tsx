import { memoize } from "../../data/constant";

type TOfferInsideList = { list:string[]};

function OfferInsideListFun({ list }: TOfferInsideList):JSX.Element {
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

const OfferInsideList = memoize(OfferInsideListFun, (oldProps, newProps) => JSON.stringify(oldProps) === JSON.stringify(newProps));

export default OfferInsideList;
