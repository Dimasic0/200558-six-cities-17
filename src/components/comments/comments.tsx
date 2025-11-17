import Comment from '../comment/comment';
import { TComment } from '../../types/types';

type TReviewsListProps = {
  data: TComment[];
  bemBlock:string;
};
export default function Comments({ data, ...props }: TReviewsListProps): JSX.Element {
  return (
    <ul className='reviews__list'>
      {data && data.map((dataComment) => (<Comment {...dataComment} {...props} key={dataComment.id} />))}
    </ul>
  );
}
