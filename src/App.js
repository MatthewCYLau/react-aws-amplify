import React from "react";
import Amplify from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsExports from "./aws-exports";
import AppRouter from "./routers/AppRouter";

Amplify.configure(awsExports);

const App = () => {
  return <AppRouter />;
};

export default withAuthenticator(App);
