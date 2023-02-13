import "./navbar.css";
import Notification from "../../img/notification.svg";

import { useEffect, useState } from "react";

const Navbar = ({ socket, username }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  const displayNotification = ({ senderName, type }) => {
    // eslint-disable-next-line default-case
    switch (type) {
      case "Liked":
        return <span className="notification">you have been liked</span>;

      case "SuperLiked":
        return (
          <span className="notification">
            `you have been superliked by {senderName}`
          </span>
        );
      case "unSuperLiked":
        return (
          <span className="notification">
            `you have been unsuperliked by {senderName}`
          </span>
        );

      case "unLiked":
        return <span className="notification">you have been unliked</span>;
    }
  };

  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    document.location.reload();
  };
  return (
    <div className="navbar">
      <span className="logo">RightSwipe.com</span>

      <div className="navbar-right"></div>
      <div className="icon" onClick={() => setOpen(!open)}>
        <img src={Notification} className="iconImg" alt="" />
        {notifications.length > 0 && (
          <div className="counter">{notifications.length}</div>
        )}
      </div>

      {open && (
        <div className="notifications">
          {notifications.map((n, index) => {
            return <div key={index}>{displayNotification(n)}</div>;
          })}
          <button className="nButton" onClick={handleRead}>
            Mark as read
          </button>
        </div>
      )}
      <span className="logout" onClick={handleLogout}>
        logout
      </span>
      <span className="username">{username}</span>
    </div>
  );
};

export default Navbar;
