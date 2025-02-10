type TOfferInsideList = { list:string[]};

export default function OfferInsideList({ list }: TOfferInsideList) {
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
