import React from "react";
import { PageHeader } from "antd";
import { Layout } from "antd";

const { Content, Footer } = Layout;

const AboutPage = () => {
  return (
    <div>
      <Layout className="layout">
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
