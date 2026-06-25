import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/login/login';
import Favorites from '../pages/favorites/favorites';
import Offer from '../pages/offer/offer';
import { PrivateStatus, Address} from '../data/constant';
import ErrorAddressing from '../pages/errorAddressing/errorAddressing';
import PrivateRoute from '../privateRoute';
import { useEffect } from 'react';
import Main from '../pages/main/main';
import { getLogin } from '../store/action';
import { useAppDispatch } from '../store';
import { useEmail } from '../store/useSelectors';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();

  const email = useEmail();

  useEffect(() => {
    const controller = new AbortController();
    dispatch(getLogin());
    return () => controller.abort();
  },[]);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main/>} />
        <Route path={Address.login} element={<Login />} />
        <Route path={Address.favorites} element={
          <PrivateRoute status={email ? PrivateStatus.Auth : PrivateStatus.Guest}>
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
