import cls from 'classnames';
import { useState } from 'react';
import { useAppDispatch } from '../../store';
import { rqFavorite } from '../../store/action';

interface BookmarkButtonProps {
  width: number | string;
  height: number | string;
  defoultState: boolean | number;
  bemBlock: string;
  id?: string;
}

export const BookmarkButton = ({ width = 31, height = 33, defoultState = false, bemBlock, id }: BookmarkButtonProps): JSX.Element => {
  const dispatch = useAppDispatch();

  defoultState = !!defoultState;
  const [state, setState] = useState<boolean>(defoultState);

  const [sending, setSending] = useState<boolean>(false);

  const onSending = () => {
    if (id && !sending) {
      dispatch(rqFavorite({ id, state: !state })).then((data) => {
        setState((state) => !state);
        setSending(false);
      }).catch(() => { setSending(false); });
      setSending(true);
    }
  };

  return (<button className={cls(`${bemBlock}__bookmark-button button`, { 'offer__bookmark-button--active': state })} onClick={onSending} type="button">
    <svg className="offer__bookmark-icon" width={width} height={height}>
      <use xlinkHref="#icon-bookmark"></use>
    </svg>
    <span className="visually-hidden">To bookmarks</span>
  </button>);
};
