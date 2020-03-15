import React from 'react';
import { Helmet } from "react-helmet";

export default () => {
  return (
    <div className="App">
      <h1>APP</h1>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Title</title>
        <meta name="description" content="ALMA"/>
        <meta name="og:description" content="ALMA"/>
      </Helmet>
    </div>
  )
}