import { Link } from 'react-router-dom';
import { Address, memoize } from '../../data/constant';
import { useEmail } from '../../store/selectors';

function Header() {
  const email:string = useEmail();
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
                {/* <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                  <div className="header__avatar-wrapper user__avatar-wrapper">
                  </div>
                  {
                    isAuthorized ?
                      <>
                        <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                        <span className="header__favorite-count">3</span>
                      </>
                      :
                      <span className="header__login">Sign in</span>
                  }
                </Link> */}
                <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                  <div className="header__avatar-wrapper user__avatar-wrapper">
                  </div>
                  {email ?
                    <>
                      <span className="header__user-name user__name">{email}</span>
                      <span className="header__favorite-count">3</span>
                    </>
                    :
                    <Link className="header__login" to={Address.login}>Sign in</Link>}
                </Link>
              </li>
              {
                email &&
                <li className="header__nav-item">
                  <div className="header__nav-link">
                    <span className="header__signout">Sign out</span>
                  </div>
                </li>
              }
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default memoize(Header);
