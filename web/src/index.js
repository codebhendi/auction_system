import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './index.css';
import App from './App';
import ScrollToTop from './components/elements/ScrollToTop';
import * as serviceWorker from './serviceWorker';

// Using browserRouter to keep the URLs simple and not with #
// This component will keep track of our URLs.
// Whenever URL changes the changes will reflect in the app
// component
/* eslint-disable  */
const router = (
  <Router>
    <ScrollToTop>
      <Route component={App} />
    </ScrollToTop>
  </Router>
)

/* eslint-enable */
ReactDOM.render(
  router,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
