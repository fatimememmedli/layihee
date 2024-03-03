import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import Register from "../pages/register/Register";
import Messages from "../pages/messages/Messages";
import Suggested from "../pages/suggested/Suggested";
import UserProfile from "../pages/userProfile/UserProfile";
import MyProfile from "../pages/myProfile/MyProfile";
import Edit from "../pages/edit/Edit";
import Blocklist from "../pages/blocklist/Blocklist";
import FollowerList from "../pages/followerList/FollowerList";
// import FollowingList from "../pages/followingList/FollowingList";
import AdminHome from "../pages/admin/adminHome/AdminHome";
import UsersTablePage from "../pages/admin/usersTablePage/UsersTablePage";
import CreateNewUser from "../pages/admin/createNewUser/CreateNewUser";
import AdminUserDetail from "../pages/admin/adminUserDetail/AdminUserDetail";
import SavePosts from "../pages/savePosts/SavePosts";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/chat",
    element: <Messages />,
  },
  {
    path: "/suggestions",
    element: <Suggested />,
  },
  {
    path: "/userProfile/:id",
    element: <UserProfile />,
  },
  {
    path: "/myProfile",
    element: <MyProfile />,
  },
  {
    path: "/editProfile",
    element: <Edit />,
  },
  {
    path: "/blockList/:id",
    element: <Blocklist />,
  },
  {
    path: "/followers/:id",
    element: <FollowerList />,
  },
  {
    path: "/adminUserDetail/:id",
    element: <AdminUserDetail />,
  },
  // {
  //   path: "/following/:id",
  //   element: <FollowingList />,
  // },
  {
    path: "/admin",
    element: <AdminHome />,
  },
  {
    path: "/adminUsers",
    element: <UsersTablePage />,
  },
  {
    path: "/createUser",
    element: <CreateNewUser />,
  },
  {
    path: "/saved",
    element: <SavePosts />,
  },
];
export default routes;
