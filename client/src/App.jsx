import { useEffect, useState } from "react";
import "./app.css";
import Card from "./components/card/Card";
import Navbar from "./components/navbar/Navbar";
import { io } from "socket.io-client";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.user || null
  );
  // console.log(user, "updated");

  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("user"))?.token || null
  );
  const [socket, setSocket] = useState(null);
  const [feed, setFeed] = useState([]);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify({ user, token }));
  }, [token, user]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setFeed(
          (
            await axios.get(`http://localhost:8000/api/users`, {
              headers: { authorization: `Bearer ${token}` },
            })
          ).data.users
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeed();
  }, [user, token]);

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
    // window.onbeforeunload = () => {
    //   localStorage.clear();
    // };
  }, []);

  useEffect(() => {
    socket?.emit("newUser", user?.username);
    // console.log("emitted", user);
  }, [user, token, socket]);

  const loginUser = async () => {
    try {
      const { token, user } = (
        await axios.post(`http://localhost:8000/api/auth/login`, {
          email,
          password,
        })
      )?.data;

      setUser(user);
      setToken(token);
    } catch (err) {
      console.log(err);
    }
  };
  const registerUser = async () => {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    try {
      await axios.post(`http://localhost:8000/api/auth/register`, formData);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container">
      {user ? (
        <>
          <Navbar socket={socket} username={user?.username} />
          {feed.map((f) => (
            <Card
              key={f._id}
              post={f}
              socket={socket}
              user={user}
              token={token}
            />
          ))}
        </>
      ) : (
        <div className="login">
          <h2>SwipeRight.com</h2>
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="file"
            name="photo"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <button onClick={loginUser}>Login</button>
          <button onClick={registerUser}>Register</button>
        </div>
      )}
    </div>
  );
};

export default App;
