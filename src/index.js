import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter } from "react-router-dom";
import history from './utils/history'

// core styles
import "./scss/style.scss";

// icon fontawesome styles
import './assets/fontawesome_5_1_14/css/all.min.css'

// vendor styles
import "react-datetime/css/react-datetime.css";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import { StoreProvider } from './store/provider'
import "./pages/client/style/flexboxgrid.min.css";
import './pages/client/style/index.css';
ReactDOM.render(
  <StoreProvider>
    <BrowserRouter history={history}>
      <ScrollToTop />
      <HomePage />
    </BrowserRouter>
  </StoreProvider>,
  document.getElementById("root")
);
