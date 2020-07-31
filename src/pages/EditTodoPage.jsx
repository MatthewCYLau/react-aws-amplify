import React from "react";
import { PageHeader } from "antd";
import { Layout, Card, Button } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;

const EditTodoPage = () => {
  return (
    <div>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">
          <PageHeader
            className="site-page-header"
            title="Edit To-Do"
            style={styles.header}
          />
        </div>
        <Card title={"To-do"} style={{ width: 300 }}>
          <p>"Description"</p>
          <Button type="primary">Save</Button>
          <Button>
            <Link className="button">Back</Link>
          </Button>
        </Card>
      </Content>
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

export default EditTodoPage;
