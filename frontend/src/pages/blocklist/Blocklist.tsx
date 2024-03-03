import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import NavbarLeft from "../../components/navbarLeft/NavbarLeft";
import SuggestedCard from "../../components/suggestedCard/SuggestedCard";
import UserList from "../../components/userList/UserList";
import { RootState } from "../../redux/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import {
  getAllUsers,
  getLoginUser
} from "../../redux/slices/userSlice";
function Blocklist() {
  const idLogin: string = JSON.parse(localStorage.getItem("id") ?? "null") as string;
  const user = useSelector((state: RootState) => state.users.login);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getLoginUser(idLogin))
  }, []);
  const { id } = useParams();
  console.log(id)
  console.log(user)
  return (
    <>
      <Navbar />
      <NavbarLeft />
      <UserList type="Blocklist" list={user?.blockList} user={user} />
      <SuggestedCard />
    </>
  );
}

export default Blocklist;
