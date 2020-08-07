import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { API, graphqlOperation } from "aws-amplify";
import { LikeOutlined } from "@ant-design/icons";
import { createLike, deleteLike } from "../graphql/mutations";
import { listLikes } from "../graphql/queries";

const Likes = ({ commentID, currentUsername }) => {
  const [likes, setLikes] = useState([]);

  const handleOnClickLike = commentID => {
    const userHasLikedComment =
      likes.filter(like => like.owner === currentUsername).length > 0;
    if (!userHasLikedComment) {
      addLike(commentID);
    } else {
      removeLike();
    }
  };

  const addLike = async commentID => {
    try {
      const likeDetails = { commentID };
      await API.graphql(graphqlOperation(createLike, { input: likeDetails }));
      fetchLikesCountByComment(commentID);
    } catch (err) {
      console.log("error creating like:", err);
    }
  };

  async function removeLike() {
    const likeID = likes.filter(like => like.owner === currentUsername)[0].id;
    try {
      const likeDetails = {
        id: likeID
      };
      setLikes(likes.filter(like => like.id !== likeID));
      await API.graphql(graphqlOperation(deleteLike, { input: likeDetails }));
      fetchLikesCountByComment(commentID);
    } catch (err) {
      console.log("error removing like:", err);
    }
  }

  const fetchLikesCountByComment = async commentID => {
    try {
      const filter = {
        commentID: {
          eq: commentID
        }
      };
      const likesDetails = await API.graphql(
        graphqlOperation(listLikes, { filter })
      );
      setLikes(likesDetails.data.listLikes.items);
    } catch (err) {
      console.log("error fetching likes");
    }
  };

  useEffect(() => {
    fetchLikesCountByComment(commentID);
  }, []);

  return (
    <Button
      icon={<LikeOutlined />}
      onClick={() => handleOnClickLike(commentID)}
    >
      {likes.length > 0 ? likes.length : <div style={styles.placeholder}></div>}
    </Button>
  );
};

const styles = {
  placeholder: {
    width: "23px"
  }
};
export default Likes;
