const fs = require('fs');
const path = require('path');
const { ApolloClient } = require('apollo-client');
const { SchemaLink } = require('apollo-link-schema');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { renderToStringWithData } = require('react-apollo');
const Helmet = require('react-helmet');

const _rootApp = require('../../static/js/index.js').default;
const template = fs.readFileSync(
  path.resolve(__dirname, '../../static/index.html'),
  'utf8'
).replace(/[\n\r\t]/gi, '');

module.exports = async (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Service-Worker-Allowed', '/')
  const user = req.user;

  const client = new ApolloClient({
    ssrMode: true,
    link: new SchemaLink({ schema: require('./graphql'), context: req }),
    cache: new InMemoryCache(),
  });

  let variables = '';
  variables += `window.user = ${JSON.stringify(user)};`;
  variables += `window.__APOLLO_STATE__=${JSON.stringify(client.extract())}`;
  
  const rootApp = _rootApp(client, req.url, req.user && JSON.parse(JSON.stringify(req.user)));
  
  const helmet = Helmet.Helmet.renderStatic();

  console.log('meta', helmet.meta.toString())
  console.log('title', helmet.title.toString())

  renderToStringWithData(rootApp).then((content) => {
    res.send(template
      .replace('__ROOT__', content)
      .replace('__DATA__', variables)
      .replace('__TITLE__', helmet.title.toString())
      .replace('__META__', helmet.meta.toString())
      .replace('__LINK__', helmet.link.toString())
    );
  }).catch(console.log);

  // const html = template
  //   .replace('__JSSOURCE__', 'index')
  //   .replace('__ROOT__', ReactDOMServer.renderToString(<App />))
  //   .replace('__STATIC__', process.env.STATIC)
  //   .replace('__data__', variables);

  // res.send(html);
}
