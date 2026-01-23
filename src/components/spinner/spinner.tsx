import { memo } from "react";

const SpinnerFun = ():JSX.Element => <img src="../../../public/img/spinner.png" width='100' className="spinner" />;
export const Spinner = memo(SpinnerFun);
