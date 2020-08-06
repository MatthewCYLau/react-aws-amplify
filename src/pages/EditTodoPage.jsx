import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getTodo } from "../graphql/queries";
import { updateTodo } from "../graphql/mutations";
import { Layout, Card, Button, Spin, Input, PageHeader } from "antd";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import CommentList from "../components/CommentList";

const { Content } = Layout;

const EditTodoPage = ({ location, history }) => {
  // form state
  const initialFormState = { name: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);

  // todo state
  const initialTodoState = { name: "", description: "", owner: "" };
  const [todo, setTodo] = useState(initialTodoState);

  // loading state
  const initialLoadingState = false;
  const [loadingState, setloadingState] = useState(initialLoadingState);

  // current username state
  const [currentUsername, setCurrentUsername] = useState("");

  const id = location.pathname.split("/")[2];

  async function fetchTodo() {
    try {
      const todo = await API.graphql(graphqlOperation(getTodo, { id }));
      const name = todo.data.getTodo.name;
      const description = todo.data.getTodo.description;
      const owner = todo.data.getTodo.owner;
      setTodo({ name, description, owner });
      setloadingState({ loadingState: true });
    } catch (err) {
      console.log("error fetching todo");
    }
  }

  Auth.currentSession()
    .then(data => setCurrentUsername(data.accessToken.payload.username))
    .catch(err => console.log(err));

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
            {currentUsername === todo.owner && (
              <div>
                <Input
                  onChange={event => setInput("name", event.target.value)}
                  value={formState.name}
                  placeholder="Name"
                  style={styles.input}
                />
                <Input
                  onChange={event =>
                    setInput("description", event.target.value)
                  }
                  value={formState.description}
                  placeholder="Description"
                  style={styles.input}
                />
                <Button onClick={editTodo} type="primary" style={styles.submit}>
                  Save
                </Button>
              </div>
            )}
            <Card title={todo.name} style={{ width: 300 }}>
              <p>{todo.description}</p>
              <Button>
                <Link className="button" to="/">
                  Back
                </Link>
              </Button>
            </Card>
            <CommentList todoID={id} currentUsername={currentUsername} />
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
