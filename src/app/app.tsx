import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../pages/main/main';
import Login from '../pages/login/login';
import Favorites from '../pages/favorites/favorites';
import Offer from '../pages/offer/offer';
import { PrivateStatus, Address } from '../data/constant';
import ErrorAddressing from '../pages/errorAddressing/errorAddressing';
import PrivateRoute from '../privateRoute';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route index element={<Favorites />} /> */}
        <Route index element={<Main/>} />
        {/* <Route index element={<Offer offers={offers} />} /> */}
        <Route path={Address.login} element={<Login />} />
        <Route path={Address.favorites} element={
          <PrivateRoute status={PrivateStatus.Guest}>
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
