import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/login/login';
import Favorites from '../pages/favorites/favorites';
import Offer from '../pages/offer/offer';
import { PrivateStatus, Address, tokenGet } from '../data/constant';
import ErrorAddressing from '../pages/errorAddressing/errorAddressing';
import PrivateRoute from '../privateRoute';
import { useEffect } from 'react';
import Main from '../pages/main/main';
import { getOffers } from '../store/action';
import { useAppDispatch } from '../store';
import axios from 'axios';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();
  console.log('tokenGet=', tokenGet());
  useEffect(() => {
    const controller = new AbortController();
    dispatch(getOffers(controller.signal));
    window.addEventListener(' ', (evt) => {
      console.log('storage evt=', evt);
      axios.defaults.headers['x-token'] = 'erf';
    }, false);
    return () => controller.abort();
  });
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route index element={<Favorites />} /> */}
        <Route index element={<Main/>} />
        {/* <Route index element={<Offer offers={offers} />} /> */}
        <Route path={Address.login} element={<Login />} />
        <Route path={Address.favorites} element={
          <PrivateRoute status={PrivateStatus.Auth}>
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
