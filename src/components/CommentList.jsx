import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listComments, listLikes } from "../graphql/queries";
import { PageHeader, Spin, Card, Input, Button } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import {
  createComment,
  deleteComment,
  createLike,
  deleteLike
} from "../graphql/mutations";

const CommentList = ({ todoID, currentUsername }) => {
  const initialFormState = { content: "" };
  const [formState, setFormState] = useState(initialFormState);
  const [comments, setComments] = useState([]);
  const [loadingComplete, setloadingComplete] = useState(false);
  useEffect(() => {
    fetchComments();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchComments() {
    try {
      const filter = {
        todoID: {
          eq: todoID
        }
      };
      const commentsDetails = await API.graphql(
        graphqlOperation(listComments, { filter })
      );
      const comments = commentsDetails.data.listComments.items;

      setComments(comments);
      setloadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log("error fetching comments");
    }
  }

  async function addComment() {
    try {
      if (!formState.content) return;
      const comment = { ...formState, todoID };
      setFormState(initialFormState);
      await API.graphql(graphqlOperation(createComment, { input: comment }));
      fetchComments();
    } catch (err) {
      console.log("error creating comment:", err);
    }
  }

  async function removeComment(id) {
    try {
      const commentDetails = {
        id
      };
      setComments(comments.filter(comment => comment.id !== id));
      await API.graphql(
        graphqlOperation(deleteComment, { input: commentDetails })
      );
    } catch (err) {
      console.log("error removing todo:", err);
    }
  }

  const handleOnClickLike = async commentID => {
    try {
      const likeDetails = { commentID };
      await API.graphql(graphqlOperation(createLike, { input: likeDetails }));
    } catch (err) {
      console.log("error creating like:", err);
    }
  };

  const fetchLikesCountByComment = commentID => {
    return commentID;
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Comments"
        style={styles.header}
      />
      <div>
        <Input
          onChange={event => setInput("content", event.target.value)}
          value={formState.content}
          placeholder="Comment"
          style={styles.input}
        />
        <Button onClick={addComment} type="primary" style={styles.submit}>
          Add
        </Button>
      </div>
      {loadingComplete ? (
        <div>
          {comments.map((comment, index) => (
            <Card
              key={comment.id ? comment.id : index}
              title={comment.content}
              style={{ width: 300 }}
            >
              <p>{comment.owner}</p>
              {currentUsername === comment.owner && (
                <Button
                  type="primary"
                  onClick={() => removeComment(comment.id)}
                >
                  Delete
                </Button>
              )}
              <Button
                icon={<LikeOutlined />}
                onClick={() => handleOnClickLike(comment.id)}
              >
                {fetchLikesCountByComment(comment.id)}
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Spin />
      )}
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

export default CommentList;
