import { memoize } from "../../data/constant";

interface PropsLoadingFun {
    text?:string;
}

const LoadingFun = ({ text }: PropsLoadingFun)=> <h1>{text || 'Loading'}</h1>;
const Loading = memoize(LoadingFun);
export default Loading;
