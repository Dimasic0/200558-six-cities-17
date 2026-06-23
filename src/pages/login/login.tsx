import { Link, useNavigate } from 'react-router-dom';
import HeaderLogo from '../../components/headerLogo/headerLogo';
import { FormEvent } from 'react';
import axios from 'axios';
import { Token } from '../../data/constant';
import { useAppDispatch } from '../../store';
import { IResLogin } from '../../types/types';
import { setUser } from '../../store/userSlice/userSlice';


export default function Login():JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function onAuthorization(evt: FormEvent<HTMLFormElement>) {
    const formData = Object.fromEntries(new FormData(evt.currentTarget));
    evt.preventDefault();

    axios.post<IResLogin>('https://16.design.htmlacademy.pro/six-cities/login', formData).then(({ data })=>{
      Token.value = data.token;
      navigate('/');
      console.log('login=',data);
      dispatch(setUser(data));
    });
  }

  return (
    <div className="page page--gray page--login">
      {HeaderLogo}
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" method="post" onSubmit={onAuthorization}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input className="login__input form__input" type="email" name="email" placeholder="Email" required defaultValue='dmitri@mail.ru' />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input className="login__input form__input" type="password" name="password" placeholder="Password" required defaultValue='d1'/>
              </div>
              <button className="login__submit form__submit button">Sign in</button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link className="locations__item-link" to="/">
                <span>Amsterdam</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
