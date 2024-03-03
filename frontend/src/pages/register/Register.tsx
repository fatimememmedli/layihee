import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Swal from "sweetalert2";
import "animate.css";
import "./register.scss";
import "swiper/css/effect-fade";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Register() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      profileImage:
        "https://haslam.utk.edu/wp-content/themes/hcb/assets/img/no-photo.jpeg",
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
              title: res.data.message,
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
                navigate("/login");
              }
            });
          }
        });
    },
  });

  return (
    <>
      <div className="register">
        <div className="left">
          <div className="left-container">
            <div className="logo animate__animated animate__fadeIn">
              <img
                src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo.png"
                alt=""
              />
            </div>
            <div className="form">
              <div className="form-head">
                <p className="head animate__animated animate__fadeIn">
                  Sign up to get started
                </p>
                <p className="text animate__animated animate__fadeIn">
                  If you already have an account,{" "}
                  <span
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login here!
                  </span>
                </p>
              </div>
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

                <button
                  className="animate__animated animate__fadeIn"
                  type="submit"
                >
                  Get Started
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="right">
          <Swiper
            // install Swiper modules
            style={{ height: "100%" }}
            centeredSlides={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
          >
            <SwiperSlide>
              <div className="image">
                <img
                  src="https://demo.foxthemes.net/socialite-v3.0/assets/images/post/img-3.jpg"
                  alt=""
                />
                <div className="text-logo">
                  <div className="logo">
                    <img
                      src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo-icon.png"
                      alt=""
                    />
                  </div>
                  <div className="text">
                    <p className="head">Connect With Friends</p>
                    <p className="desc">
                      This phrase is more casual and playful. It suggests that
                      you are keeping your friends updated on what’s happening
                      in your life.
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="image">
                <img
                  src="https://demo.foxthemes.net/socialite-v3.0/assets/images/post/img-2.jpg"
                  alt=""
                />
                <div className="text-logo">
                  <div className="logo">
                    <img
                      src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo-icon.png"
                      alt=""
                    />
                  </div>
                  <div className="text animate__animated animate__fadeIn">
                    <p className="head animate__animated animate__fadeIn">
                      Connect With Friends
                    </p>
                    <p className="desc animate__animated animate__fadeIn">
                      This phrase is more casual and playful. It suggests that
                      you are keeping your friends updated on what’s happening
                      in your life.
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default Register;
