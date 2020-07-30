import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createRegistration, deleteRegistration } from "../graphql/mutations";
import { listRegistrations } from "../graphql/queries";
import { PageHeader } from "antd";
import { Card } from "antd";
import { Button } from "antd";
import { Input } from "antd";
import "antd/dist/antd.css";
import { Layout, Menu, Breadcrumb, Spin } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const HomePage = () => {
  const initialFormState = { name: "", email: "" };
  const loadingState = false;
  const [formState, setFormState] = useState(initialFormState);
  const [registrations, setRegistrations] = useState([]);
  const [loadingComplete, setloadingComplete] = useState(loadingState);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchRegistrations() {
    try {
      const registrationDetails = await API.graphql(
        graphqlOperation(listRegistrations)
      );
      const registrations = registrationDetails.data.listRegistrations.items;
      setRegistrations(registrations);
      setloadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log("error fetching registrations");
    }
  }

  async function addRegistration() {
    try {
      if (!formState.name || !formState.email) return;
      const registration = { ...formState };
      setRegistrations([...registrations, registration]);
      setFormState(initialFormState);
      await API.graphql(
        graphqlOperation(createRegistration, { input: registration })
      );
      fetchRegistrations();
    } catch (err) {
      console.log("error creating registration:", err);
    }
  }

  async function removeRegistration(id) {
    try {
      const registrationDetails = {
        id
      };
      setRegistrations(
        registrations.filter(registration => registration.id !== id)
      );
      await API.graphql(
        graphqlOperation(deleteRegistration, { input: registrationDetails })
      );
    } catch (err) {
      console.log("error removing registration:", err);
    }
  }

  return (
    <div>
      <Footer className="layout" style={styles.layout}>
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/about">About</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Sign Up</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">
            <PageHeader
              className="site-page-header"
              title="Steve's PoC Portal"
              subTitle="powered By AWS Amplify"
              style={styles.header}
            />
            <div>
              <Input
                onChange={event => setInput("name", event.target.value)}
                value={formState.name}
                placeholder="Name"
                style={styles.input}
              />
              <Input
                onChange={event => setInput("email", event.target.value)}
                value={formState.email}
                placeholder="Email"
                style={styles.input}
              />
              <Button
                onClick={addRegistration}
                type="primary"
                style={styles.submit}
              >
                Sign Up
              </Button>
            </div>
            {loadingComplete ? (
              <div>
                {registrations.map((registration, index) => (
                  <Card
                    key={registration.id ? registration.id : index}
                    title={registration.name}
                    style={{ width: 300 }}
                  >
                    <p>{registration.email}</p>
                    <Button
                      type="primary"
                      onClick={() => removeRegistration(registration.id)}
                    >
                      Remove
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <Spin />
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Matthew Lau ©2020</Footer>
      </Footer>
    </div>
  );
};

const styles = {
  layout: {
    minHeight: "100vh"
  },
  input: {
    margin: "10px 0"
  },
  submit: {
    margin: "10px 0",
    marginBottom: "20px"
  },
  header: {
    paddingLeft: "0px"
  }
};

export default HomePage;
