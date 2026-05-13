import { PrivateStatus, Address } from './data/constant';
import { Navigate } from 'react-router-dom';
type TPrivateRoute = {
    status:PrivateStatus;
    children:JSX.Element;
};
export default function PrivateRoute({ children, status }: TPrivateRoute):JSX.Element {
  return (status === PrivateStatus.Auth ? children : <Navigate to={Address.login} />);
}
