import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/login/login';
import Favorites from '../pages/favorites/favorites';
import Offer from '../pages/offer/offer';
import { PrivateStatus, Address, Email, Password,tokenGet } from '../data/constant';
import ErrorAddressing from '../pages/errorAddressing/errorAddressing';
import PrivateRoute from '../privateRoute';
import { useEffect } from 'react';
import Main from '../pages/main/main';
import { getOffers, getLoginPost } from '../store/action';
import { useAppDispatch } from '../store';
import axios from 'axios';

export default function App(): JSX.Element {
  //axios.defaults.headers['x-token'] = tokenGet();
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log('App');
    const controller = new AbortController();
    dispatch(getOffers(controller.signal));
    dispatch(getLoginPost({ email: Email.read(), password: Password.read(), signal: controller.signal }));
    return () => controller.abort();
  },[]);
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