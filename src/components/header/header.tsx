import { Link } from 'react-router-dom';
import { Token } from '../../data/constant';
import { useEmail } from '../../store/selectors';
import { setEmail } from '../../store/action';
import { useDispatch } from 'react-redux';
import { memo } from 'react';

function HeaderFun() {
  const email = useEmail();
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
                <Link className="header__nav-link header__nav-link--profile" to="/login">
                  <div className="header__avatar-wrapper user__avatar-wrapper">
                  </div>
                  {email ?
                    <>
                      <span className="header__user-name user__name">{email}</span>
                      <span className="header__favorite-count">3</span>
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
