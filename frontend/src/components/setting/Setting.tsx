import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { getAllUsers, userObject } from "./../../redux/slices/userSlice";
import { AppDispatch } from "../../redux/store/store";
import { editPassword } from "./../../redux/slices/userSlice";
import Swal from "sweetalert2";
import { useEffect } from "react";
import "./setting.scss";
import "animate.css";
function Setting() {
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const id: string = JSON.parse(localStorage.getItem("id") ?? "null") as string;
  const loginUser: userObject = users.find(
    (elem: userObject) => elem._id == id
  )!;
  const formik = useFormik({
    initialValues: {
      currentPass: "",
      newPass: "",
      repeatPass: "",
    },

    validationSchema: Yup.object({
      currentPass: Yup.string().required("No password provided."),
      newPass: Yup.string()
        .required("No password provided.")
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
      repeatPass: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (values.currentPass != loginUser.password) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Current password is wrong!",
        });
      }
      if (values.newPass != values.repeatPass) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The repeated password is not the same as the new password",
        });
      }
      const newLoginUser = {
        ...loginUser,
        password: values.newPass,
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
          dispatch(editPassword({ ...newLoginUser }));
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
      id="settingForm"
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="input-label-error">
          <div className="label">
            <label htmlFor="currentPass">Current Password</label>
          </div>
          <div className="input-errormsg">
            <input
              placeholder="***********"
              id="currentPass"
              name="currentPass"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentPass}
            />
            {formik.touched.currentPass && formik.errors.currentPass ? (
              <div className="error">{formik.errors.currentPass}</div>
            ) : null}
          </div>
        </div>
        <div className="input-label-error">
          <div className="label">
            <label htmlFor="newPass">New password</label>
          </div>
          <div className="input-errormsg">
            <input
              placeholder="***********"
              id="newPass"
              name="newPass"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPass}
            />
            {formik.touched.newPass && formik.errors.newPass ? (
              <div className="error">{formik.errors.newPass}</div>
            ) : null}
          </div>
        </div>
        <div className="input-label-error">
          <div className="label">
            <label htmlFor="repeatPass">Repeat password</label>
          </div>
          <div className="input-errormsg">
            <input
              placeholder="***********"
              id="repeatPass"
              name="repeatPass"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.repeatPass}
            />
            {formik.touched.repeatPass && formik.errors.repeatPass ? (
              <div className="error">{formik.errors.repeatPass}</div>
            ) : null}
          </div>
        </div>
        <button type="submit">Save</button>
      </form>
    </section>
  );
}

export default Setting;
