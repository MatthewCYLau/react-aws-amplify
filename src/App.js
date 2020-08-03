import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsExports from "./aws-exports";
import HomePage from "../src/pages/HomePage";
import Routes from "./routers/Routes";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";

// AntUI
import { Layout } from "antd";

// Redux
import { Provider } from "react-redux";
import store from "./store";

Amplify.configure(awsExports);

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Layout className="layout" style={styles.layout}>
          <Navbar />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route component={Routes} />
          </Switch>
          <Footer />
        </Layout>
      </Fragment>
    </Router>
  </Provider>
);

const styles = {
  layout: {
    minHeight: "100vh"
  }
};
export default withAuthenticator(App);
