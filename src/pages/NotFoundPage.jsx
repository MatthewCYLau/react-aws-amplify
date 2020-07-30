import React from "react";
import { PageHeader } from "antd";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const AboutPage = () => {
  return (
    <div>
      <Layout className="layout" style={styles.layout}>
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
          <div className="site-layout-content">
            <PageHeader
              className="site-page-header"
              title="404 Not Found"
              style={styles.header}
            />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Matthew Lau ©2020</Footer>
      </Layout>
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

export default AboutPage;
