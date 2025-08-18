import { Link, Navigate } from 'react-router-dom';
import HeaderLogo from '../../components/headerLogo/HeaderLogo';
import { getLoginPost } from '../../store/action';
import { useRef } from 'react';
import { useAppDispatch } from '../../store';
import { useAuthorizationStatus } from '../../store/selectors';
import { tokenSet } from '../../data/constant';
export default function Login():JSX.Element {
  const dispatch = useAppDispatch();
  const AuthorizationStatus = useAuthorizationStatus();
  const emailTagRef = useRef<HTMLInputElement>(null);
  const passwordTagRef = useRef<HTMLInputElement>(null);
  function onSubmit(evt) {
    evt.preventDefault();
    console.log('emailTagRef.current=', emailTagRef.current);
    console.log('passwordTagRef.current=', passwordTagRef.current);
    const email = emailTagRef.current?.value || '';
    const password = passwordTagRef.current?.value || '';
    dispatch(getLoginPost({ email:email, password:password}));
  }
  if (AuthorizationStatus!=='') {
    console.log('AuthorizationStatus=', AuthorizationStatus);
    return <Navigate to='/' />;
  }

  return (
    <div className="page page--gray page--login">
      {HeaderLogo}
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" action="#" method="post" onSubmit={onSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input className="login__input form__input" type="email" name="email" placeholder="Email" required ref={emailTagRef} defaultValue='dmitriy.golovin.2001.03@mail.ru'/>
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input className="login__input form__input" type="password" name="password" placeholder="Password" required ref={passwordTagRef} defaultValue='1d' />
              </div>
              <button className="login__submit form__submit button" type="submit">Sign in</button>
            </form>x
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link className="locations__item-link" to="#">
                <span>Amsterdam</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
