import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import "react-bulma-components/dist/react-bulma-components.min.css";
import "./css/site.css";
import { Layout } from "./components/UI/Layout";
import * as RoutesModule from "./routes";
let routes = RoutesModule.routes;

// Create browser history.
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href")!;
const history = createBrowserHistory({ basename: baseUrl });

function renderApp() {
  const renderMethod = module.hot
    ? // https://reactjs.org/docs/react-dom.html#render
      ReactDOM.render
    : // https://reactjs.org/docs/react-dom.html#hydrate
      ReactDOM.hydrate;
  console.log(
    `renderApp hot: [${module.hot ? module.hot.status() : false}] ${
      renderMethod.name
    }`
  );
  renderMethod(
    <AppContainer>
      <Layout>
        <Router children={routes} history={history} />
      </Layout>
    </AppContainer>,
    document.getElementById("app")
  );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
  module.hot.accept("./routes", () => {
    routes = require<typeof RoutesModule>("./routes").routes;
    renderApp();
  });
}
