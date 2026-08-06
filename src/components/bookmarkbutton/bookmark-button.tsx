import cls from 'classnames';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address } from '../../data/constant';
import { useAppDispatch } from '../../store';
import { rqFavorite } from '../../store/action/action';
import { useEmail } from '../../store/useSelectors/useSelectors';

interface BookmarkButtonProps {
  width: number | string;
  height: number | string;
  defaultState: boolean | number;
  bemBlock: string;
  id?: string;
}

export const BookmarkButton = ({ width = 31, height = 33, defaultState = false, bemBlock, id }: BookmarkButtonProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useEmail();

  defaultState = !!defaultState;
  const [state, setState] = useState<boolean>(defaultState);

  const [sending, setSending] = useState<boolean>(false);

  const onSending = () => {
    if (!email) {
      navigate(Address.login);
      return;
    }

    if (id && !sending) {
      dispatch(rqFavorite({ id, state: !state })).unwrap().then((data) => {
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
