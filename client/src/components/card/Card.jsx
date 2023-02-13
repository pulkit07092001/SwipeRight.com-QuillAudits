import "./card.css";

import { useEffect, useState } from "react";
import axios from "axios";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const Card = ({ post, socket, user, token }) => {
  const [liked, setLiked] = useState(post.likedBy.includes(user._id));
  const [hearted, setHearted] = useState(post.superLikedBy.includes(user._id));
  const [blocked, setBlocked] = useState(user.blocked.includes(post._id));
  const handleBlock = async () => {
    setBlocked(!blocked);
    console.log(blocked);
    await axios.put(
      `http://localhost:8000/api/users/${post._id}/block`,
      {},
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
  };

  const handleLike = async () => {
    setLiked(!liked);
    await axios.put(
      `http://localhost:8000/api/users/${post._id}/like`,
      {},
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    socket.emit("sendNotification", {
      senderName: user.username,
      receiverName: post.username,
      type: (liked ? "un" : "") + "Liked",
    });
  };

  const handleHeart = async () => {
    setHearted(!hearted);
    await axios.put(
      `http://localhost:8000/api/users/${post._id}/superlike`,
      {},
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    socket.emit("sendNotification", {
      senderName: user.username,
      receiverName: post.username,
      type: (hearted ? "un" : "") + "SuperLiked",
    });
  };

  return (
    <div className="card">
      <div className="info">
        <span>{post.username}</span>
      </div>
      <img src={`${PF}/${post.photo}`} alt="" className="postImg" />
      <div className="interaction">
        {liked ? (
          <span className="option" onClick={() => handleLike()}>
            <i class="fa-solid fa-thumbs-up"></i>
          </span>
        ) : (
          <span className="option" onClick={() => handleLike()}>
            <i className="fa-regular fa-thumbs-up"></i>
          </span>
        )}

        {hearted ? (
          <span className="option" onClick={() => handleHeart()}>
            <i className="fa-solid fa-heart"></i>
          </span>
        ) : (
          <span className="option" onClick={() => handleHeart()}>
            <i className="fa-regular fa-heart"></i>
          </span>
        )}

        {blocked ? (
          <span className="option" onClick={() => handleBlock()}>
            <i class="fa-sharp fa-solid fa-circle-xmark"></i>
          </span>
        ) : (
          <span className="option" onClick={() => handleBlock()}>
            <i class="fa-sharp fa-regular fa-circle-xmark"></i>
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
