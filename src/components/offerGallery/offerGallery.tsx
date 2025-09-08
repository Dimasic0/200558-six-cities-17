type TOfferGallery = { children: Array<{ id: string; src: string; alt: string }> };

export default function OfferGallery({ children }: TOfferGallery) {
  return (
    <div className="offer__gallery">
      {
        children.map((el) => (
          <div className="offer__image-wrapper" key={el.id}>
            <img className='offer__image' src={el.src} alt={el.alt} key={el.id}/>
          </div>
        ))
      }
    </div>
  );
}
