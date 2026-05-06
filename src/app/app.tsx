import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/login/login';
import Favorites from '../pages/favorites/favorites';
import Offer from '../pages/offer/offer';
import { PrivateStatus, Address} from '../data/constant';
import ErrorAddressing from '../pages/errorAddressing/errorAddressing';
import PrivateRoute from '../privateRoute';
import { useEffect, useRef } from 'react';
import Main from '../pages/main/main';
import { getOffers, getLogin } from '../store/action';
import { useAppDispatch } from '../store';
import { useEmail } from '../store/selectors';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();
  
  const authorizationRef = useRef(false);

  const email = useEmail();
  console.log('email=', email);
  useEffect(() => {
    const controller = new AbortController();
    dispatch(getLogin());
    return () => controller.abort();
  },[]);
  
  const onRouteActive = (status) => {
    if (status === PrivateStatus.Auth) {
      authorizationRef.current = false;
    } else {
      dispatch(getLogin()).then(()=>{
        authorizationRef.current = true;
      });
    }
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main/>} />
        <Route path={Address.login} element={<Login />} />
        <Route path={Address.favorites} element={
          <PrivateRoute status={authorizationRef.current ? PrivateStatus.Auth : PrivateStatus.Guest} onActive={onRouteActive}>
            <Favorites />
          </PrivateRoute>
        }
        />
        <Route path={Address.offer} element={<Offer />} />
        <Route path="*" element={<ErrorAddressing />} />
      </Routes>
    </BrowserRouter>
  );
}
