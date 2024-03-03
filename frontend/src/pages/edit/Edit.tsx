import Navbar from "../../components/navbar/Navbar";
import NavbarLeft from "../../components/navbarLeft/NavbarLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Description from "../../components/description/Description";
import "./edit.scss";
import { AppDispatch } from "../../redux/store/store";
import {
  getAllUsers,
  userObject,
  deleteUser,
} from "../../redux/slices/userSlice";
import { RootState } from "../../redux/store/store";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import Invites from "../../components/invites/Invites";
import Setting from "../../components/setting/Setting";
import { useState, useRef, ChangeEvent } from "react";
import { changeProfilePhoto } from "../../redux/slices/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Edit() {
  const navigate = useNavigate();
  const [head, setHead] = useState<string>("description");
  const inputRef = useRef<HTMLInputElement | null>(null)!;
  const [image, setImage] = useState<Blob | File | null | string | MediaSource>(
    ""
  );
  const [imageChange, setImageChange] = useState<File | undefined>(undefined);
  const [object, setObject] = useState<string>("");
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllUsers());
    if (image) {
      axios
        .post(
          "http://localhost:7070/photos",
          { file: image },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          setObject(res.data)
          console.log(object);
        });
    }
  }, [image]);
  const id: string = JSON.parse(localStorage.getItem("id") ?? "null") as string;
  const loginUser: userObject = users.find(
    (elem: userObject) => elem._id == id
  )!;

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      setImageChange(selectedFile);
    }
  };
  const ChangePhotoClick = () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          changeProfilePhoto({ ...loginUser, profileImage:object })
        );
        Swal.fire("Saved!", "", "success");
        setImage("");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  const deleteUserClick = () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(loginUser._id));
        navigate("/register");
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  return (
    <>
      <Navbar />
      <NavbarLeft />
      <section id="editProfile">
        <div className="edit">
          <div className="head-links">
            <div className="head">
              <div className="left">
                <div className="image">
                  <img
                    src={
                      imageChange
                        ? URL.createObjectURL(imageChange)
                        : loginUser?.profileImage
                    }
                    alt=""
                  />
                </div>
                <div onClick={handleImageClick} className="icon">
                  <FontAwesomeIcon icon={faCamera} />
                  <input
                    onChange={handleImageChange}
                    ref={inputRef}
                    type="file"
                  />
                </div>

                <div className="fullname-username">
                  <p className="fullname">
                    {loginUser?.firstName} {loginUser?.lastName}
                  </p>
                  <p className="username">@{loginUser?.username}</p>
                </div>
              </div>
              <div className="right">
                <button onClick={deleteUserClick} className="delete">
                  Delete Profile
                </button>
                {image ? (
                  <button onClick={ChangePhotoClick} className="save">
                    Save
                  </button>
                ) : null}
              </div>
            </div>
            <div className="links">
              <p
                onClick={() => {
                  setHead("description");
                }}
                className={head == "description" ? "text borderBottom" : "text"}
              >
                Description
              </p>
              <p
                onClick={() => {
                  setHead("setting");
                }}
                className={head == "setting" ? "text borderBottom" : "text"}
              >
                Setting
              </p>
              <p
                onClick={() => {
                  setHead("invites");
                }}
                className={head == "invites" ? "text borderBottom" : "text"}
              >
                Invites
              </p>
            </div>
          </div>
          {head == "setting" ? (
            <Setting />
          ) : head == "invites" ? (
            <Invites />
          ) : (
            <Description />
          )}
        </div>
      </section>
    </>
  );
}

export default Edit;
