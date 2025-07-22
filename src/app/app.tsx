import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/login/login';
import Favorites from '../pages/favorites/favorites';
import Offer from '../pages/offer/offer';
import { PrivateStatus, Address } from '../data/constant';
import ErrorAddressing from '../pages/errorAddressing/errorAddressing';
import PrivateRoute from '../privateRoute';
import { useDispatch } from 'react-redux';
import { setOffers } from '../store/action';
import { useEffect } from 'react';
import { offers } from '../mocks/offers';
import { TData } from '../types/types';
import Main from '../pages/main/main';
import axios from 'axios';

const data: TData = {
  offers: offers,
  city:'Paris',
};

export default function App(): JSX.Element {
  const dispath = useDispatch();
  
  useEffect(() => {
    const controller = new AbortController();
    axios.get('https://16.design.htmlacademy.pro/six-cities/offers', { signal: controller.signal }).then(({ data }) => {
      console.log('data=',data);
      dispath(setOffers({ offers: data}));
    });
    return () => {
      controller.abort();
    };
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
