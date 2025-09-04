import { Link, useNavigate } from 'react-router-dom';
import HeaderLogo from '../../components/headerLogo/headerLogo';
import { useRef, FormEvent, MutableRefObject, RefObject } from 'react';
import axios from 'axios';
import { token } from '../../data/constant';
import { setEmail } from '../../store/action';
import { useDispatch } from 'react-redux';


export default function Login():JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passworInputdRef = useRef<HTMLInputElement>(null);
  
  function onAuthorization (evt:FormEvent) {
   // evt.preventDefault();
    interface TResLogin {
      avatarUrl :string;
      email:string;
      isPro:boolean;
      name:string;
      token:string;
    } 
    const email: string = emailInputRef.current?.value || '';
    const password: string = passworInputdRef.current?.value || '';
    console.log('submit');
    axios.post<TResLogin>('https://16.design.htmlacademy.pro/six-cities/login', { email, password }).then(({ data })=>{
      console.log('login=',data);
      token.add(data.token);
      navigate('/');
      dispatch(setEmail(data.email));
    }).catch(()=>{console.log('errpr=',error)});
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
                <input className="login__input form__input" type="email" name="email" placeholder="Email" required ref={emailInputRef} defaultValue='dmitri@mail.ru' />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input className="login__input form__input" type="password" name="password" placeholder="Password" required ref={passworInputdRef} defaultValue='d1'/>
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
