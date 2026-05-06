import { PrivateStatus, Address } from './data/constant';
import { Navigate } from 'react-router-dom';
type TPrivateRoute = {
    status:PrivateStatus;
    children:JSX.Element;
  onActive: (status: PrivateStatus)=>void;
};
export default function PrivateRoute({ children, status, onActive=()=>{} }: TPrivateRoute):JSX.Element {
  onActive(status);
  return (status === PrivateStatus.Auth ? children : <Navigate to={Address.login} />);
}
