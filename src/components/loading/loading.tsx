import { memoize } from '../../data/constant';

interface PropsLoadingFun {
    text?:string;
}

const LoadingFun = ({ text }: PropsLoadingFun)=> <h1 data-testid="loading">{text || 'Loading'}</h1>;
const Loading = memoize(LoadingFun);
export default Loading;
