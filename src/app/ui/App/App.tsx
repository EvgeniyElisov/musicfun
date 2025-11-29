import { Header } from "@/common/components";
import { Routing } from "@/common/routing";
import { ToastContainer } from "react-toastify";
import s from "./App.module.css";
import { useGlobalLoading } from "@/common/hooks";
import { LinearProgress } from "@/common/components/LinearProgress";

export const App = () => {
  const isGlobalLoading = useGlobalLoading();
  
  return (
    <>
      <Header />
      {isGlobalLoading && <LinearProgress />}
      <div className={s.layout}>
        <Routing />
      </div>
      <ToastContainer />
    </>
  );
};
