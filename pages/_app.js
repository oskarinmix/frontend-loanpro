import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import DataProvider from "../components/DataProvider";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </DataProvider>
  );
}

export default MyApp;
