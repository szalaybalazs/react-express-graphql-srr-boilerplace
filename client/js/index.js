// Generate CSS
require('../scss/main.scss');
require('es6-promise').polyfill();
require('@/core/prototypes');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StaticRouter } from 'react-router-dom';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';



require("@babel/register");
require("babel-polyfill");

if (typeof document !== 'undefined') {
  const client = new ApolloClient({
    fetch,
    link: new HttpLink({ credentials: 'include' }),
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    ssrForceFetchDelay: 100,
  });

  ReactDOM.hydrate(
    <App client={client} user={window.user} />,
    document.getElementById('root')
  );
}

export default (client, url, user) => (
  <StaticRouter location={url} context={{}}>
    <App client={client} user={user} />
  </StaticRouter>
);