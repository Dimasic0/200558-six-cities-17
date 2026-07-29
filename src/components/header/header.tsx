import { Link } from 'react-router-dom';
import { Address, Token } from '../../data/constant';
import { useFavorites } from '../../store/useSelectors/useSelectors';
//import { setEmail } from '../../store/action';
import { useDispatch } from 'react-redux';
import { memo } from 'react';
import {TOffers } from '../../types/types';
import { useUser } from '../../store/useSelectors/useSelectors';
import { setEmail } from '../../store/userSlice/userSlice';

function HeaderFun() {
  type TOffersFavorites = Array<TOffers | TOffers[]>;
  let offersFavorites: TOffersFavorites = useFavorites();
  offersFavorites = offersFavorites.flatMap((offers) => offers);
  const {email,...user} = useUser();
  const dispatch = useDispatch();
  function onExit() {
    dispatch(setEmail(''));
    Token.delete();
  }
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link className="header__logo-link header__logo-link--active" to="/">
              <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
            </Link>
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item user">
                <Link className="header__nav-link header__nav-link--profile" to={email ? Address.favorites : Address.login}>
                  <div className="header__avatar-wrapper user__avatar-wrapper" style={email ? {backgroundImage: `url(${user.avatarUrl})`} : {}}>
                  </div>
                  {email ?
                    <>
                      <span className="header__user-name user__name">{user.name}</span>
                      <span className="header__favorite-count">{offersFavorites.length}</span>
                    </>
                    :
                    <span className="header__login">Sign in</span>}
                </Link>
              </li>
              {
                email &&
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#" onClick={onExit}>
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              }
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export const Header = memo(HeaderFun);
