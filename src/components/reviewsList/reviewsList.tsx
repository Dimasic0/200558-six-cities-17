import ReviewsItem from '../reviewsItem/reviewsItem';
import { TComment } from '../../types/types';

type TReviewsListProps = {
  data: TComment[];
};
export default function ReviewsList({ data }: TReviewsListProps):JSX.Element {
  return (
    <ul className="reviews__list">
      {data.map((dataComment) => (<ReviewsItem {...dataComment} key={dataComment.id}/>))}
    </ul>
  );
}
