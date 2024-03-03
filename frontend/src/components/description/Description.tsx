import { useFormik } from "formik";
import { getAllUsers, userObject } from "./../../redux/slices/userSlice";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { editProfile } from "./../../redux/slices/userSlice";
import { AppDispatch } from "../../redux/store/store";
import "./description.scss";
import "animate.css";
function Description() {
  const users = useSelector((state: RootState) => state.users.users);
  // const [newLogin, setNewLogin] = useState<object>({});

  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const id: string = JSON.parse(localStorage.getItem("id") ?? "null") as string;
  const loginUser: userObject = users.find(
    (elem: userObject) => elem._id == id
  )!;
  const [bio, setBio] = useState<string>(loginUser?.bio);

  const formik = useFormik({
    initialValues: {
      username: loginUser?.username,
      email: loginUser?.email,
      bio: loginUser?.bio,
      firstName: loginUser?.firstName,
      lastName: loginUser?.lastName,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      const findUsername = users.find(
        (elem) => elem.username == values.username
      );
      const findEmail = users.find((elem) => elem.email == values.email);
      if (findUsername && findUsername.username != loginUser.username) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "This username already used! ",
        });
      }
      if (findEmail && findEmail.email != loginUser.email) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "This email already used! ",
        });
      }
      const obj: userObject = {
        ...loginUser,
        username: values.username,
        email: values.email,
        bio: bio,
        firstName: values.firstName,
        lastName: values.lastName,
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
          dispatch(editProfile({ ...obj }));
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    },
  });

  return (
    <section
      className="animate__animated animate__slideInLeft"
      id="descriptionForm"
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="input-label-error">
          <div className="label">
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-errormsg">
            <input
              id="username"
              name="username"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="error">{formik.errors.username}</div>
            ) : null}
          </div>
        </div>
        <div className="input-label-error">
          <div className="label">
            <label htmlFor="firstName">First Name</label>
          </div>
          <div className="input-errormsg">
            <input
              id="firstName"
              name="firstName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="error">{formik.errors.firstName}</div>
            ) : null}
          </div>
        </div>
        <div className="input-label-error">
          <div className="label">
            <label htmlFor="lastName">Last Name</label>
          </div>
          <div className="input-errormsg">
            <input
              id="lastName"
              name="lastName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="error">{formik.errors.lastName}</div>
            ) : null}
          </div>
        </div>
        <div className="input-label-error">
          <div className="label">
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-errormsg">
            <input
              id="email"
              name="email"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>

        <div className="input-label-error">
          <div className="label">
            <label htmlFor="bio">Bio</label>
          </div>
          <div className="input-errormsg">
            <textarea
              value={bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setBio(e.target.value);
              }}
              name="bio"
              id="bio"
            ></textarea>
          </div>
        </div>

        <button type="submit">Save</button>
      </form>
    </section>
  );
}

export default Description;
