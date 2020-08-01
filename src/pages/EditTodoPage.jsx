import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getTodo } from "../graphql/queries";
import { updateTodo } from "../graphql/mutations";
import { PageHeader } from "antd";
import { Layout, Card, Button, Spin, Input } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;

const EditTodoPage = ({ location, history }) => {
  // form state
  const initialFormState = { name: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);

  // todo state
  const initialTodoState = { name: "", description: "" };
  const [todo, setTodo] = useState(initialTodoState);

  // loading state
  const initialLoadingState = false;
  const [loadingState, setloadingState] = useState(initialLoadingState);

  const id = location.pathname.split("/")[2];

  async function fetchTodo() {
    try {
      const todo = await API.graphql(graphqlOperation(getTodo, { id }));
      const name = todo.data.getTodo.name;
      const description = todo.data.getTodo.description;
      setTodo({ name, description });
      setloadingState({ loadingState: true });
    } catch (err) {
      console.log("error fetching todo");
    }
  }

  async function editTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const updates = { ...formState, id };
      await API.graphql(graphqlOperation(updateTodo, { input: updates }));
      history.push("/");
    } catch (err) {
      console.log("error updating todo:", err);
    }
  }

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  // When component mounts, fetchTodo by ID
  useEffect(() => {
    fetchTodo();
  }, []);

  // When todo updates, set form state
  useEffect(() => {
    if (todo.name) {
      const name = todo.name;
      const description = todo.description;
      setFormState({ name, description });
    }
  }, [todo]);

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
          <div>
            <Input
              onChange={event => setInput("name", event.target.value)}
              value={formState.name}
              placeholder="Name"
              style={styles.input}
            />
            <Input
              onChange={event => setInput("description", event.target.value)}
              value={formState.description}
              placeholder="Description"
              style={styles.input}
            />
            <Button onClick={editTodo} type="primary" style={styles.submit}>
              Save
            </Button>
            <Card title={todo.name} style={{ width: 300 }}>
              <p>{todo.description}</p>
              <Button>
                <Link className="button" to="/">
                  Back
                </Link>
              </Button>
            </Card>
          </div>
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
