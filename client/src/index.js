import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { BrowserRouter } from "react-router-dom";
import ReduxToastr from "react-redux-toastr";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import reducer from "./store/reducer";
import thunk from "redux-thunk";

export const HOST_URL = "http://localhost:8000";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
const app = (
  <Provider store={store}>
    <>
      <BrowserRouter>
        <App />
      </BrowserRouter>
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
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
