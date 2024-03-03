import Navbar from "../../components/navbar/Navbar";
import NavbarLeft from "../../components/navbarLeft/NavbarLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../redux/store/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import axios from "axios";
import { io } from "socket.io-client";
import {
  getAllUsers,
  userObject,
  getLoginUser,
  messageNavChange,
} from "../../redux/slices/userSlice";
import "./messages.scss";
import "animate.css";
import { useState } from "react";
function Messages() {
  const socket = useRef(io("http://localhost:7070"));
  const scrollRef = useRef();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<userObject | undefined>(
    undefined
  );
  const idLogin: string = JSON.parse(
    localStorage.getItem("id") ?? "null"
  ) as string;
  const users = useSelector((state: RootState) => state.users.users);
  const ActiveChatState = useSelector(
    (state: RootState) => state.users.messages
  );
  const LoginUser = useSelector((state: RootState) => state.users.login);
  const userLogin: userObject = useSelector(
    (state: RootState) => state.users.login
  );
  interface Message {
    fromSelf: boolean;
    message: string;
  }
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    console.log("messages render");
    dispatch(getAllUsers());
    dispatch(getLoginUser(idLogin));
    dispatch(getLoginUser(idLogin));
  }, [dispatch, idLogin]);
  console.log("object");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageValue, setMessageValue] = useState<string>("");
  const [arrivalMessage, setArrivalMessage] = useState<Message | null>(null);
  useEffect(() => {
    if (currentChat) {
      const fetchData = async () => {
        const res = await axios.post("http://localhost:7070/api/messages", {
          from: LoginUser._id,
          to: currentChat?._id,
        });
        setMessages(res.data);
      };
      fetchData();
    }
  }, [currentChat]);
  useEffect(() => {
    if (LoginUser) {
      socket.current = io("http://localhost:7070/");
      socket.current.emit("add-user", LoginUser._id);
    }
  }, [LoginUser]);
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg: string) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket.current]);
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (LoginUser) {
      socket.current = io("http://localhost:7070/");
      socket.current.emit("add-user", LoginUser._id);
    }

    socket.current.on("update-online-users", (updatedOnlineUsers: string[]) => {
      setOnlineUsers(updatedOnlineUsers);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [LoginUser]);
  return (
    <>
      <Navbar />
      <NavbarLeft />

      <section id="chat">
        <div
          id="chats-name"
          className={
            ActiveChatState
              ? "animate__animated animate__fadeInLeft chatsActive"
              : "animate__animated animate__fadeInLeft"
          }
        >
          <div className="head">
            <div className="top">
              <p>Chats</p>
            </div>
            <div className="bottom">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <input placeholder="Search" type="text" />
            </div>
          </div>
          <div className="chats">
            {userLogin &&
              userLogin?.following?.map((followingUserId) => {
                const followingUser = users.find(
                  (elem) => elem._id == followingUserId.id
                );
                return (
                  <div
                    key={uuidv4()}
                    onClick={() => {
                      setCurrentChat(followingUser);
                    }}
                    className={
                      currentChat?._id == followingUser?._id
                        ? "chat  selected"
                        : "chat "
                    }
                  >
                    <div className="profile">
                      <img src={followingUser?.profileImage} alt="" />
                    </div>
                    <div className="name-message">
                      <div className="name-date">
                        <p className="name">
                          {followingUser?.firstName} {followingUser?.lastName}
                        </p>
                        <p className="time">09:40AM</p>
                      </div>
                      {/* <p className="message">{messages.}</p> */}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {currentChat ? (
          <div className="messages">
            <div className="head animate__animated animate__fadeInDown">
              <div className="left">
                <div className="image">
                  <img src={currentChat?.profileImage} alt="" />
                  <FontAwesomeIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ActiveChatState) {
                        dispatch(messageNavChange(false));
                      } else {
                        dispatch(messageNavChange(true));
                      }
                    }}
                    icon={faBars}
                  />
                </div>
                <div
                  onClick={() => dispatch(messageNavChange(false))}
                  className="name-online"
                >
                  <p className="name">
                    {currentChat.firstName} {currentChat.lastName}
                  </p>
                  {onlineUsers.find((elem) => elem == currentChat._id) ? (
                    <p className="online">Online</p>
                  ) : null}
                </div>
              </div>
              <div className="right">
                <FontAwesomeIcon icon={faCircleInfo} />
              </div>
            </div>
            <div
              onClick={() => dispatch(messageNavChange(false))}
              className="msg-hero"
            >
              {messages &&
                messages.map((message) => {
                  return (
                    <div
                      ref={scrollRef}
                      key={uuidv4()}
                      className={message.fromSelf ? "right" : "left"}
                    >
                      {message.fromSelf ? (
                        <>
                          <p className="message">{message.message}</p>
                          <div className="img">
                            <img
                              src={
                                message.fromSelf
                                  ? `${LoginUser.profileImage}`
                                  : `${currentChat.profileImage}`
                              }
                              alt=""
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="img">
                            <img
                              src={
                                message.fromSelf
                                  ? `${LoginUser.profileImage}`
                                  : `${currentChat.profileImage}`
                              }
                              alt=""
                            />
                          </div>
                          <p className="message">{message.message}</p>
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
            <div className="sendMessages">
              <input
                value={messageValue}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                }}
                placeholder="Write your message"
                type="text"
              />
              <div
                onClick={async () => {
                  await axios.post("http://localhost:7070/messages/", {
                    from: LoginUser._id,
                    to: currentChat._id,
                    message: messageValue,
                  });
                  setMessageValue("");
                  socket.current.emit("send-msg", {
                    to: currentChat._id,
                    from: LoginUser._id,
                    message: messageValue,
                  });
                  const msgs = [...messages];
                  msgs.push({ fromSelf: true, message: messageValue });
                  setMessages(msgs);
                }}
                className="send"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </div>
            </div>
          </div>
        ) : (
          <div className="welcome">
            <div className="username">
              <p>
                <FontAwesomeIcon
                  onClick={() => {
                    if (ActiveChatState) {
                      dispatch(messageNavChange(false));
                    } else {
                      dispatch(messageNavChange(true));
                    }
                  }}
                  icon={faChevronLeft}
                />
                <span>Wellcome,</span>
                {userLogin?.firstName}
              </p>
            </div>
            <div className="gif">
              <img
                src="https://cdn.pixabay.com/animation/2022/07/29/14/45/14-45-52-572_512.gif"
                alt=""
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Messages;
