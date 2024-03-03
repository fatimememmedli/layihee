import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
interface LikeObj {
  id: string;
  likeId: string | undefined;
}
interface NotifObj1 {
  id: string | undefined;
  likeOrCommentId: string | undefined;
  type: string;
  postId: string | undefined;
  wasRead: boolean;
  comment: string | null;
}
interface SavedObj {
  postId: string | undefined;
  whosePostId: string | undefined;
  id: string | undefined;
}
export interface StoryObj {
  id: string | undefined;
  imgSRC: string;
  title: string;
}
interface CommentObj {
  id: string;
  text: string;
  commentId: string | boolean;
  postId: string | boolean;
}
export interface Follow {
  id: string | undefined;
}
export interface UserPost {
  id: string;
  imgSRC: string;
  title: string;
  comments: CommentObj[];
  likes: LikeObj[];
  saved: object[];
}
interface Request {
  id: string | undefined;
  wasRead: boolean;
}
export interface userObject {
  _id: string | undefined;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  following: Follow[];
  follower: Follow[];
  blockList: Follow[];
  stories: StoryObj[];
  requests: Request[];
  notifications: NotifObj1[];
  profileImage: string;
  posts: UserPost[];
  saved: SavedObj[];
  adminNotif: string[];
  isPublic: boolean;
  isAdmin: boolean;
  report: boolean;
  bio: string;
  email: string;
  __v: number;
}
export interface UserProfile {
  users: userObject[];
  navbarLeft: boolean;
  messages: boolean;
  user: userObject;
  login: userObject;
}
export const getAllUsers = createAsyncThunk("getAllUsers", async () => {
  const response = await axios.get("http://localhost:7070/users", {
    timeout: 5000,
  });
  return response.data;
});

export const getLoginUser = createAsyncThunk(
  "getLogin",
  async (_id: string) => {
    const response = await axios.get("http://localhost:7070/users/" + _id);
    return response.data;
  }
);
const initialState: UserProfile = {
  users: [],
  navbarLeft: false,
  messages: false,
  user: {},
  login: {},
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    editProfile: (state, action: PayloadAction<userObject>) => {
      const updatedProfile = { ...action.payload };
      console.log("action", updatedProfile);

      axios.patch(`http://localhost:7070/users/${updatedProfile._id}`, {
        lastName: updatedProfile.lastName,
        firstName: updatedProfile.firstName,
        username: updatedProfile.username,
        email: updatedProfile.email,
        bio: updatedProfile.bio,
      });
      const array = state.users.map((elem) => {
        if (elem._id == updatedProfile._id) {
          return updatedProfile;
        } else {
          return elem;
        }
      });
      state.users = array;
    },
    editPassword: (state, action: PayloadAction<userObject>) => {
      const updatedProfile = { ...action.payload };
      axios.patch(`http://localhost:7070/users/${updatedProfile._id}`, {
        password: updatedProfile.password,
      });
      const array = state.users.map((elem) => {
        if (elem._id == updatedProfile._id) {
          return updatedProfile;
        } else {
          return elem;
        }
      });
      state.users = array;
    },
    deleteUser: (state, action: PayloadAction<string | undefined>) => {
      console.log(action.payload);
      axios.delete(`http://localhost:7070/users/${action.payload}`);
      const array = state.users.filter((elem) => elem._id != action.payload);
      state.users = array;
      localStorage.removeItem("id");
    },
    navbarLeftChange: (state, action: PayloadAction<boolean>) => {
      state.navbarLeft = action.payload;
    },
    messageNavChange: (state, action: PayloadAction<boolean>) => {
      state.messages = action.payload;
    },
    editAccount: (state, action: PayloadAction<userObject>) => {
      const updatedProfile = { ...action.payload };
      console.log(updatedProfile);
      axios.patch(`http://localhost:7070/users/${updatedProfile._id}`, {
        isPublic: action.payload.isPublic,
      });
      const array = state.users.map((elem) => {
        if (elem._id == updatedProfile._id) {
          return updatedProfile;
        } else {
          return elem;
        }
      });
      state.users = array;
    },
    changeProfilePhoto: (state, action: PayloadAction<userObject>) => {
      const obj = { ...action.payload };
      console.log(obj.profileImage);
      axios.patch(`http://localhost:7070/users/${obj._id}`, {
        profileImage: obj.profileImage,
      });
      const array = state.users.map((elem) => {
        if (elem._id == obj._id) {
          return action.payload;
        } else {
          return elem;
        }
      });
      state.users = array;
    },
    addPost: (
      state,
      action: PayloadAction<{
        title: string;
        img: string;
        id: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex((elem) => elem._id === obj.id);
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.posts = newUser.posts || [];
        const newPost = {
          id: uuidv4(),
          imgSRC: obj.img,
          title: obj.title,
          comments: [],
          likes: [],
          saved: [],
        };
        newUser.posts.push(newPost);
        console.log(current(newUser.posts));
        axios.patch(`http://localhost:7070/users/${obj.id}`, {
          posts: current(newUser.posts),
        });
        state.users[userIndex] = newUser;
      }
    },
    addStory: (
      state,
      action: PayloadAction<{
        title: string;
        img: string;
        id: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex((elem) => elem._id === obj.id);
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.stories = newUser.stories || [];
        const newStory = {
          id: uuidv4(),
          imgSRC: obj.img,
          title: obj.title,
        };
        newUser.stories.push(newStory);
        console.log("addStory", current(newUser.stories));
        axios.patch(`http://localhost:7070/users/${obj.id}`, {
          stories: current(newUser.stories),
        });
        state.users[userIndex] = newUser;
      }
    },
    addComment: (
      state,
      action: PayloadAction<{
        text: string;
        postId: string | undefined;
        kiminPostudur: string | undefined;
        loginId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.kiminPostudur
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        // newUser.posts = newUser.posts || [];
        const newComment = {
          id: uuidv4(),
          text: obj.text,
          commentId: obj.loginId,
          postId: obj.postId,
        };
        const updatedPosts = current(newUser.posts).map((post) => {
          if (post.id === obj.postId) {
            return { ...post, comments: [...post.comments, newComment] };
          } else {
            return post;
          }
        });
        console.log("slice newuser", newUser.posts);

        const newNotif = {
          id: newComment.id,
          type: "comment",
          likeOrCommentId: obj.loginId,
          comment: obj.text,
          wasRead: false,
          postId: obj.postId,
        };
        const LoginUser = state.users.find((elem) => elem._id == obj.loginId);
        console.log(current(LoginUser)?.posts);
        if (
          !current(LoginUser)?.posts.find((element) => element.id == obj.postId)
        ) {
          newUser.notifications.push(newNotif);
          newUser.posts = updatedPosts;
          axios.patch(`http://localhost:7070/users/${obj.kiminPostudur}`, {
            posts: updatedPosts,
            notifications: newUser.notifications,
          });

          state.users[userIndex] = newUser;
        } else {
          newUser.posts = updatedPosts;
          console.log(newUser);
          axios.patch(`http://localhost:7070/users/${obj.kiminPostudur}`, {
            posts: updatedPosts,
          });

          state.users[userIndex] = newUser;
        }
      }
    },
    addLike: (
      state,
      action: PayloadAction<{
        postId: string | undefined;
        kiminPostudur: string | undefined;
        loginId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.kiminPostudur
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.posts = newUser.posts || [];
        const newLike = {
          id: uuidv4(),
          likeId: obj.loginId,
        };
        const updatedPosts = current(newUser.posts).map((post) => {
          if (post.id === obj.postId) {
            return { ...post, likes: [...post.likes, newLike] };
          }
          return post;
        });
        const newNotif = {
          id: uuidv4(),
          type: "like",
          likeOrCommentId: obj.loginId,
          postId: obj.postId,
          wasRead: false,
          comment: "",
        };
        const LoginUser = state.users.find((elem) => elem._id == obj.loginId);
        console.log(current(LoginUser)?.posts);
        if (
          !current(LoginUser)?.posts.find((element) => element.id == obj.postId)
        ) {
          newUser.notifications.push(newNotif);
          newUser.posts = updatedPosts;
          console.log(current(newUser.notifications));
          console.log(newUser);
          axios.patch(`http://localhost:7070/users/${obj.kiminPostudur}`, {
            posts: updatedPosts,
            notifications: current(newUser.notifications),
          });

          state.users[userIndex] = newUser;
        } else {
          newUser.posts = updatedPosts;
          console.log(current(newUser.notifications));
          console.log(newUser);
          axios.patch(`http://localhost:7070/users/${obj.kiminPostudur}`, {
            posts: updatedPosts,
          });

          state.users[userIndex] = newUser;
        }
      }
    },
    deleteLike: (
      state,
      action: PayloadAction<{
        postId: string | undefined;
        kiminPostudur: string | undefined;
        loginId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.kiminPostudur
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.posts = newUser.posts || [];
        // console.log(current(newUser.posts).find((elem)=> elem.id==obj.postId)?.likes)
        const kiminPostu = state.users.find(
          (elem) => elem._id == obj.kiminPostudur
        );
        const updatedPosts = current(newUser.posts).map((post) => {
          if (post.id === obj.postId) {
            return {
              ...post,
              likes: post.likes.filter((elem) => elem.likeId != obj.loginId),
            };
          }
          return post;
        });
        const DeleteNotif =
          current(kiminPostu)?.notifications.find(
            (elem) =>
              elem.type == "like" &&
              elem.likeOrCommentId == obj.loginId &&
              elem.postId == obj.postId
          ) ?? [];
        const newNotifArray =
          current(kiminPostu)?.notifications.filter(
            (Elem) => Elem.id != DeleteNotif.id
          ) || [];
        console.log(newNotifArray);
        newUser.notifications = newNotifArray;
        newUser.posts = updatedPosts;
        // newUser.notifications = newNotifArray;
        // console.log(newUser);
        axios.patch(`http://localhost:7070/users/${obj.kiminPostudur}`, {
          posts: updatedPosts,
          notifications: newNotifArray,
        });

        state.users[userIndex] = newUser;
      }
    },
    deleteComment: (
      state,
      action: PayloadAction<{
        postId: string | undefined;
        kiminPostudur: string | undefined;
        loginId: string | undefined;
        commentId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.kiminPostudur
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.posts = newUser.posts || [];
        // console.log(current(newUser.posts).find((elem)=> elem.id==obj.postId)?.likes)
        const kiminPostu = state.users.find(
          (elem) => elem._id == obj.kiminPostudur
        );
        const updatedPosts = current(newUser.posts).map((post) => {
          if (post.id === obj.postId) {
            return {
              ...post,
              comments: post.comments.filter(
                (elem) => elem.id != obj.commentId
              ),
            };
          }
          return post;
        });
        console.log(updatedPosts);
        const find = current(kiminPostu)?.notifications.find(
          (elem) => elem.id == obj.commentId
        );
        console.log("find", find);
        const newNotifArray =
          current(kiminPostu)?.notifications.filter(
            (elem) => elem.id != obj.commentId
          ) ?? [];
        console.log("not", newNotifArray);
        newUser.posts = updatedPosts;
        newUser.notifications = newNotifArray;
        console.log(newUser);
        axios.patch(`http://localhost:7070/users/${obj.kiminPostudur}`, {
          posts: updatedPosts,
          notifications: newNotifArray,
        });
        state.users[userIndex] = newUser;
      }
    },
    addFollowing: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        userId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.following = newUser.following || [];
        const newFollow: {
          id: string | undefined;
        } = {
          id: obj.userId,
        };
        newUser.following.push(newFollow);
        console.log("following", current(newUser.following));
        axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
          following: current(newUser.following),
        });
        state.users[userIndex] = newUser;
      }
      const userIndex2 = state.users.findIndex(
        (elem) => elem._id === obj.userId
      );
      if (userIndex2 !== -1) {
        const newUser2 = { ...state.users[userIndex2] };
        newUser2.follower = newUser2.follower || [];
        const newFollower: {
          id: string | undefined;
        } = {
          id: obj.loginId,
        };
        const newNotif = {
          id: uuidv4(),
          type: "follow",
          likeOrCommentId: obj.loginId,
          comment: "",
          wasRead: false,
          postId: obj.userId,
        };
        console.log("current", current(newUser2.follower));
        newUser2.follower.push(newFollower);
        console.log("currentNotif", current(newUser2.notifications));

        newUser2.notifications.push(newNotif);
        console.log("follower", current(newUser2.follower));
        console.log("notif", current(newUser2.notifications));

        axios.patch(`http://localhost:7070/users/${obj.userId}`, {
          follower: current(newUser2.follower),
          notifications: current(newUser2.notifications),
        });
        state.users[userIndex2] = newUser2;
      }
    },
    UnFollowing: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        userId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.following = newUser.following || [];
        const newFollowing = newUser.following.filter(
          (elem) => elem.id !== obj.userId
        );
        newUser.following = newFollowing;
        state.users[userIndex] = newUser;
        axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
          following: newFollowing,
        });

        // Redux store güncellemesi        }
      }

      ///if2
      const userIndex2 = state.users.findIndex(
        (elem) => elem._id === obj.userId
      );

      if (userIndex2 !== -1) {
        const newUser2 = { ...state.users[userIndex2] };
        newUser2.follower = newUser2.follower || [];

        // Güncellenmiş follower listesi
        const newFollower = newUser2.follower.filter(
          (elem) => elem.id !== obj.loginId
        );

        newUser2.follower = newFollower;
        console.log("currentNotif", current(newUser2.notifications));
        const find = current(newUser2.notifications).find(
          (elem) => elem.type == "follow" && elem.likeOrCommentId == obj.loginId
        );
        const newNotifArr = current(newUser2.notifications).filter(
          (elem) => elem.id != find?.id
        );
        console.log("newNotif", newNotifArr);
        axios.patch(`http://localhost:7070/users/${obj.userId}`, {
          follower: newFollower,
          notifications: newNotifArr,
        });
        state.users[userIndex2] = newUser2;
      }
    },
    sendRequest: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        userId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.userId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.requests = newUser.requests || [];
        const newReq: {
          id: string | undefined;
          wasRead: boolean;
        } = {
          id: obj.loginId,
          wasRead: false,
        };
        newUser.requests.push(newReq);
        console.log("req", current(newUser.requests));
        axios.patch(`http://localhost:7070/users/${obj.userId}`, {
          requests: current(newUser.requests),
        });
        state.users[userIndex] = newUser;
      }
    },
    unRequest: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        userId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.userId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.requests = newUser.requests || [];

        // Güncellenmiş following listesi
        const newReq = newUser.requests.filter(
          (elem) => elem.id !== obj.loginId
        );

        newUser.requests = newReq;
        state.users[userIndex] = newUser;
        axios.patch(`http://localhost:7070/users/${obj.userId}`, {
          requests: newReq,
        });
      }
    },
    deleteLikeNotification: (
      state,
      action: PayloadAction<{
        likeId: string | undefined;
        postId: string | undefined;
        loginId: string | undefined;
        type: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.notifications = newUser.notifications || [];
        console.log("current", current(newUser.notifications));
        const find = current(newUser.notifications).find(
          (elem) =>
            elem.type == obj.type &&
            elem.likeOrCommentId == obj.likeId &&
            elem.postId == obj.postId
        )!;
        console.log("find", find);
        const newNotifArr = current(newUser.notifications).filter(
          (elem) => elem.id !== find.id
        );
        console.log(newNotifArr);
        newUser.notifications = newNotifArr;
        state.users[userIndex] = newUser;
        axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
          notifications: newNotifArr,
        });
      }
    },
    Read: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        type: string;
        id: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.notifications = newUser.notifications || [];
        console.log(current(newUser.notifications));
        const find = current(newUser.notifications).find(
          (elem) => elem.type == obj.type && elem.id == obj.id
        )!;
        // find.wasRead=true
        console.log(find);
        if (find) {
          console.log(find);
          const newNotifArr = current(newUser.notifications).map((elem) => {
            if (elem.id === find.id) {
              return { ...elem, wasRead: true };
            } else {
              return elem;
            }
          });

          console.log(newNotifArr);
          newUser.notifications = newNotifArr;
          state.users[userIndex] = newUser;
          axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
            notifications: newNotifArr,
          });
        }
      }
    },
    deleteRequest: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        requestId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.requests = newUser.requests || [];
        // Güncellenmiş following listesi
        const newReq = current(newUser.requests).filter(
          (elem) => elem.id !== obj.requestId
        );
        newUser.requests = newReq;
        state.users[userIndex] = newUser;
        axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
          requests: newReq,
        });
      }
    },
    ReadRequest: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        id: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.requests = newUser.requests || [];
        console.log(current(newUser.requests));
        const find = current(newUser.requests).find(
          (elem) => elem.id == obj.id
        )!;
        // find.wasRead=true
        console.log(find);
        console.log(find);
        if (find !== undefined) {
          console.log(find);
          const newReqArr = current(newUser.requests).map((elem) => {
            if (elem.id === find.id) {
              return { ...elem, wasRead: true }; // Create a new object with the updated property
            }
            return elem;
          });

          console.log(newReqArr);
          newUser.requests = newReqArr;
          axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
            requests: newReqArr,
          });
          state.users[userIndex] = newUser;
        }
      }
    },
    ConfirmRequest: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        userId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.userId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.following = newUser.following || [];
        const newFollow: {
          id: string | undefined;
        } = {
          id: obj.loginId,
        };
        newUser.following.push(newFollow);
        console.log("following", current(newUser.following));
        axios.patch(`http://localhost:7070/users/${obj.userId}`, {
          following: current(newUser.following),
        });
        state.users[userIndex] = newUser;
      }
      const userIndex2 = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex2 !== -1) {
        const newUser2 = { ...state.users[userIndex2] };
        newUser2.follower = newUser2.follower || [];
        const newFollower: {
          id: string | undefined;
        } = {
          id: obj.userId,
        };
        const newNotif = {
          id: uuidv4(),
          type: "follow",
          likeOrCommentId: obj.userId,
          comment: "",
          wasRead: false,
          postId: obj.userId,
        };
        const newReq = current(newUser2.requests).filter(
          (elem) => elem.id !== obj.userId
        );
        newUser2.requests = newReq;
        newUser2.follower.push(newFollower);
        newUser2.notifications.push(newNotif);
        console.log("yeniyeni", newUser2);
        console.log("follower", current(newUser2.follower));
        console.log("yeniFollowun idsi", obj.userId);
        console.log("yeniyeninotif", current(newUser2.notifications));

        axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
          follower: current(newUser2.follower),
          notifications: current(newUser2.notifications),
          requests: newReq,
        });
        state.users[userIndex2] = newUser2;
      }
    },
    deletePost: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        postId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.posts = newUser.posts || [];
        // Güncellenmiş following listesi
        const newPostArr = current(newUser.posts).filter(
          (elem) => elem.id !== obj.postId
        );
        newUser.posts = newPostArr;
        console.log(newUser);
        axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
          posts: newPostArr,
        });
        state.users[userIndex] = newUser;
      }
    },
    addBlockList: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        userId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.blockList = newUser.blockList || [];
        if (newUser.following.find((elem) => elem.id == obj.userId)) {
          newUser.following = newUser.following || [];
          const newFollowing = newUser.following.filter(
            (elem) => elem.id !== obj.userId
          );
          newUser.following = newFollowing;
          state.users[userIndex] = newUser;
          axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
            following: newFollowing,
          });
          const userIndex2 = state.users.findIndex(
            (elem) => elem._id === obj.userId
          );
          if (userIndex2 !== -1) {
            const newUser2 = { ...state.users[userIndex2] };
            newUser2.follower = newUser2.follower || [];
            const newFollower = newUser2.follower.filter(
              (elem) => elem.id !== obj.loginId
            );
            newUser2.follower = newFollower;
            const find = current(newUser2.notifications).find(
              (elem) =>
                elem.type == "follow" && elem.likeOrCommentId == obj.loginId
            );
            const newNotifArr = current(newUser2.notifications).filter(
              (elem) => elem.id != find?.id
            );
            axios.patch(`http://localhost:7070/users/${obj.userId}`, {
              follower: newFollower,
              notifications: newNotifArr,
            });
            state.users[userIndex2] = newUser2;
          }

          const newBlock: {
            id: string | undefined;
          } = {
            id: obj.userId,
          };
          newUser.blockList.push(newBlock);
          axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
            blockList: current(newUser.blockList),
          });
          state.users[userIndex] = newUser;
        } else {
          const newBlock: {
            id: string | undefined;
          } = {
            id: obj.userId,
          };
          newUser.blockList.push(newBlock);
          axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
            blockList: current(newUser.blockList),
          });
          state.users[userIndex] = newUser;
        }
      }
    },
    UnBlock: (
      state,
      action: PayloadAction<{
        loginId: string | undefined;
        userId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.blockList = newUser.blockList || [];
        const newBlocklist = current(newUser.blockList).filter(
          (elem) => elem.id !== obj.userId
        );

        newUser.blockList = newBlocklist;
        axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
          blockList: newBlocklist,
        });
        state.users[userIndex] = newUser;
      }
    },
    addSave: (
      state,
      action: PayloadAction<{
        postId: string;
        whosePostId: string | undefined;
        loginId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.saved = newUser.saved || [];
        const newSave = {
          postId: obj.postId,
          whosePostId: obj.whosePostId,
          id: uuidv4(),
        };
        newUser.saved.push(newSave);
        state.users[userIndex] = newUser;
        axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
          saved: newUser.saved,
        });
      }
    },

    deleteSave: (
      state,
      action: PayloadAction<{
        postId: string;
        whosePostId: string | undefined;
        loginId: string | undefined;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex(
        (elem) => elem._id === obj.loginId
      );
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.saved = newUser.saved || [];
        const find = current(newUser.saved).find(
          (elem) =>
            elem.postId == obj.postId && elem.whosePostId == obj.whosePostId
        );
        console.log(find);

        const newSavedArr = newUser.saved.filter(
          (elem) => elem.id !== find?.id
        );
        newUser.saved = newSavedArr;
        console.log(newSavedArr);
        axios.patch(`http://localhost:7070/users/${obj.loginId}`, {
          saved: newSavedArr,
        });
        state.users[userIndex] = newUser;
      }
    },
    DeleteUser: (state, action: PayloadAction<{ id: string }>) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const newUsers = state.users.filter((elem) => elem._id != obj.id);
      axios.delete("http://localhost:7070/users/" + obj.id);
      state.users = newUsers;
    },
    sendNotification: (
      state,
      action: PayloadAction<{
        id: string | undefined;
        msg: string;
      }>
    ) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      console.log("salam");

      const userIndex = state.users.findIndex((elem) => elem._id === obj.id);
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.adminNotif.push(obj.msg);
        console.log("salam");
        console.log(current(newUser.adminNotif));
        axios.patch(`http://localhost:7070/users/${obj.id}`, {
          adminNotif: current(newUser.adminNotif),
        });
        state.users[userIndex] = newUser;
      }
    },
    Report: (state, action: PayloadAction<{ id: string | undefined }>) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex((elem) => elem._id === obj.id);
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.report = true;
        axios.patch("http://localhost:7070/users/" + obj.id, {
          report: true,
        });
        state.users[userIndex] = newUser;
      }
    },
    UnReport: (state, action: PayloadAction<{ id: string | undefined }>) => {
      const obj = { ...action.payload };
      console.log("actionobj", obj);
      const userIndex = state.users.findIndex((elem) => elem._id === obj.id);
      if (userIndex !== -1) {
        const newUser = { ...state.users[userIndex] };
        newUser.report = false;
        axios.patch("http://localhost:7070/users/" + obj.id, {
          report: false,
        });
        state.users[userIndex] = newUser;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });

    builder.addCase(getLoginUser.fulfilled, (state, action) => {
      state.login = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  editProfile,
  changeProfilePhoto,
  editPassword,
  navbarLeftChange,
  editAccount,
  deleteUser,
  addPost,
  addComment,
  sendNotification,
  addStory,
  addLike,
  DeleteUser,
  deleteLike,
  deleteComment,
  addFollowing,
  UnFollowing,
  ReadRequest,
  sendRequest,
  unRequest,
  deleteLikeNotification,
  Read,
  deleteRequest,
  ConfirmRequest,
  deletePost,
  addBlockList,
  UnBlock,
  deleteSave,
  addSave,
  messageNavChange,
  Report,
  UnReport,
} = userSlice.actions;

export default userSlice.reducer;
