// import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./createNewUser.scss"
import SideBar from "../components/sideBar/SideBar";
import AdminNavbar from "../adminNavbar/AdminNavbar";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
function CreateNewUser() {
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      profileImage:
        "https://acdla.com/wp-content/uploads/2020/09/blank-profile-picture-973460_1280.png",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(15, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("No password provided.")
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
      username: Yup.string()
        .min(6, "Username is too short - should be 6 chars minimum.")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:7070/users", {
          ...values,
          profileImage:
            "https://haslam.utk.edu/wp-content/themes/hcb/assets/img/no-photo.jpeg",
        })
        .then((res) => {
          if (res.status == 201) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.data,
            });
          } else {
            Swal.fire({
              title:"Successfully!",
              width: 600,
              padding: "3em",
              color: "gray",
              background: "#fff url(/images/trees.png)",
              backdrop: `
              rgba(0,0,123,0.4)
              url("/images/nyan-cat.gif")
              left top
              no-repeat
            `,
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/admin");
              }
            });
          }
        });
    },
  });
  return (
    <>
    <SideBar/>
    <AdminNavbar/>
    <div className="newUserCreate">
      <form onSubmit={formik.handleSubmit}>
        <div className="firstName-lastName">
          <div className="label-input-first-last">
            <label htmlFor="firstName">First Name</label>
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
          <div className="label-input-first-last">
            <label htmlFor="lastName">Last Name</label>
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
        <div className="email-input">
          <div className="label-input">
            <label
              className="animate__animated animate__fadeIn"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="animate__animated animate__fadeIn"
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>

        <div className="passwords">
          <div className="label-input">
            <label
              className="animate__animated animate__fadeIn"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="animate__animated animate__fadeIn"
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
          <div className="label-input">
            <label
              className="animate__animated animate__fadeIn"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="animate__animated animate__fadeIn"
              id="password"
              name="password"
              placeholder="***"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>
        </div>

        <button className="animate__animated animate__fadeIn" type="submit">
          Create
        </button>
      </form>
    </div>
    </>
    
  );
}

export default CreateNewUser;
