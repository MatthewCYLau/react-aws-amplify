import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getTodo } from "../graphql/queries";
import { PageHeader } from "antd";
import { Layout, Card, Button, Spin } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;

const EditTodoPage = ({ location }) => {
  const initialLoadingState = false;
  const initialTodoState = { name: "", description: "" };
  const [todo, setTodo] = useState(initialTodoState);
  const [loadingState, setloadingState] = useState(initialLoadingState);

  async function fetchTodo() {
    try {
      const id = location.pathname.split("/")[2];
      const todo = await API.graphql(graphqlOperation(getTodo, { id }));
      const name = todo.data.getTodo.name;
      const description = todo.data.getTodo.description;
      setTodo({ name, description });
      setloadingState({ loadingState: true });
    } catch (err) {
      console.log("error fetching todo");
    }
  }

  useEffect(() => {
    fetchTodo();
  }, []);

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
        {loadingState ? (
          <Card title={todo.name} style={{ width: 300 }}>
            <p>{todo.description}</p>
            <Button type="primary">Save</Button>
            <Button>
              <Link className="button">Back</Link>
            </Button>
          </Card>
        ) : (
          <Spin />
        )}
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
