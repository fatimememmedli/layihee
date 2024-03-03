import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import Swal from "sweetalert2";
import {
  getAllUsers,
  userObject,
  editAccount,
} from "./../../redux/slices/userSlice";
import { AppDispatch } from "../../redux/store/store";
import { useEffect } from "react";

import "animate.css";
import "./invites.scss";
function Invites() {
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const id: string = JSON.parse(localStorage.getItem("id") ?? "null") as string;
  const loginUser: userObject = users.find(
    (elem: userObject) => elem._id == id
  )!;
  const [publicState, setPublicState] = useState<boolean>(loginUser.isPublic);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    console.log("Seçilen değer:", selectedValue);
    if (selectedValue == "public") {
      setPublicState(true);
    } else {
      setPublicState(false);
    }
  };
  const handleSubmit = () => {
    const obj: userObject = {
      ...loginUser,
      isPublic: publicState,
    };
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        dispatch(editAccount({ ...obj }));

        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  return (
    <section className="animate__animated animate__slideInLeft" id="invites">
      <p className="head">
        Your account is a {loginUser.isPublic ? "public" : "private"} account,
        do you want to make a {loginUser.isPublic ? "private" : "public"}{" "}
        account?
      </p>

      <div className="select">
        <label htmlFor="account">My Account</label>
        <select
          onChange={handleSelectChange}
          id="ddlProducts"
          name="ddProducts"
        >
          <option value="">--Please choose an option--</option>
          <option className="option" value="private">
            Private
          </option>
          <option className="option" value="public">
            Public
          </option>
        </select>
      </div>
      {loginUser.isPublic != publicState ? (
        <button onClick={handleSubmit}>Save</button>
      ) : null}
    </section>
  );
}

export default Invites;
