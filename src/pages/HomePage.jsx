import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createTodo, deleteTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";
import { PageHeader } from "antd";
import { Card } from "antd";
import { Button } from "antd";
import { Input } from "antd";
import "antd/dist/antd.css";
import { Layout, Menu, Breadcrumb, Spin } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const HomePage = () => {
  const initialFormState = { name: "", description: "" };
  const loadingState = false;
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
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
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
            <Breadcrumb.Item>To-Do</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">
            <PageHeader
              className="site-page-header"
              title="Matt's To-Do List"
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
                onChange={event => setInput("description", event.target.value)}
                value={formState.description}
                placeholder="Description"
                style={styles.input}
              />
              <Button onClick={addTodo} type="primary" style={styles.submit}>
                Create Todo
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
                    <Button type="primary" onClick={() => removeTodo(todo.id)}>
                      Done
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
