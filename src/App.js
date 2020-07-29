import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Amplify from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsExports from "./aws-exports";
import HomePage from "../src/pages/HomePage";
import Routes from "./routers/Routes";

// Redux
import { Provider } from "react-redux";
import store from "./store";

Amplify.configure(awsExports);

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route component={Routes} />
        </Switch>
      </Fragment>
    </Router>
  </Provider>
);

export default withAuthenticator(App);
