import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createTodo, deleteTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";
import { Link } from "react-router-dom";
import { PageHeader } from "antd";
import { Card, Button, Input } from "antd";
import "antd/dist/antd.css";
import { Layout, Spin } from "antd";
import { Auth } from "aws-amplify";

const { Content } = Layout;

const HomePage = () => {
  const initialFormState = { name: "", description: "" };
  const loadingState = false;
  const [currentUsername, setCurrentUsername] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [todos, setTodos] = useState([]);
  const [loadingComplete, setloadingComplete] = useState(loadingState);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoDetails = await API.graphql(graphqlOperation(listTodos));
      const todos = todoDetails.data.listTodos.items;
      setTodos(todos);
      setloadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialFormState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      fetchTodos();
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  async function removeTodo(id) {
    try {
      const todoDetails = {
        id
      };
      setTodos(todos.filter(todo => todo.id !== id));
      await API.graphql(graphqlOperation(deleteTodo, { input: todoDetails }));
    } catch (err) {
      console.log("error removing todo:", err);
    }
  }

  Auth.currentSession()
    .then(data => setCurrentUsername(data.accessToken.payload.username))
    .catch(err => console.log(err));

  return (
    <div>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">
          <PageHeader
            className="site-page-header"
            title={"Welcome " + currentUsername}
            subTitle="To-do list powered by AWS Amplify"
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
              onChange={event => setInput("description", event.target.value)}
              value={formState.description}
              placeholder="Description"
              style={styles.input}
            />
            <Button onClick={addTodo} type="primary" style={styles.submit}>
              Add
            </Button>
          </div>
          {loadingComplete ? (
            <div>
              {todos.map((todo, index) => (
                <Card
                  key={todo.id ? todo.id : index}
                  title={todo.name}
                  style={{ width: 300 }}
                >
                  <p>{todo.description}</p>
                  {currentUsername === todo.owner && (
                    <Button type="primary" onClick={() => removeTodo(todo.id)}>
                      Done
                    </Button>
                  )}
                  <Button>
                    <Link className="button" to={`/edit/${todo.id}`}>
                      More
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Spin />
          )}
        </div>
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

export default HomePage;
