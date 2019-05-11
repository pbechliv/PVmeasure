import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { BrowserRouter } from "react-router-dom";
import ReduxToastr from "react-redux-toastr";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import reducer from "./store/reducer";
import thunk from "redux-thunk";
import { readAuthToken } from "./auth/authActions";
import "semantic-ui-css/semantic.min.css";
import "./style.css";

export const HOST_URL = "http://localhost:8001";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
const app = (
  <BrowserRouter>
    <Provider store={store}>
      <>
        <App />
        <ReduxToastr
          timeOut={5000}
          newestOnTop={false}
          position="top-right"
          transitionIn="bounceIn"
          transitionOut="bounceOut"
          progressBar
          closeOnToastrClick
        />
      </>
    </Provider>
  </BrowserRouter>
);

store
  .dispatch(readAuthToken())
  .then(() => ReactDOM.render(app, document.getElementById("root")));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
