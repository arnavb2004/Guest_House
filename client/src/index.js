import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { injectStore } from "./utils/httpService";

injectStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));

const clientId =
  "472680424656-tmfr30qav9o1uot0nt1875pjai7ttt2s.apps.googleusercontent.com";

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1}
        />
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);
