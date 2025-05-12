import { useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../styles/AuthForm.css"
import { FaEye, FaEyeSlash } from "react-icons/fa" // Importing eye icons

const AuthForm = () => {
  const loginRef = useRef(null)
  const signupRef = useRef(null)
  const navigate = useNavigate()
  const [screen, setscreen] = useState("signup")

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPasswordSignup, setShowPasswordSignup] = useState(false) // Password visibility toggle for signup
  const [showPasswordLogin, setShowPasswordLogin] = useState(false) // Password visibility toggle for login

  const handleLoginClick = () => {
    if (screen == "signup") {
      setscreen("login")
      const parent = loginRef.current.closest(".login")

      if (!parent.classList.contains("slide-up")) {
        parent.classList.add("slide-up")
      } else {
        signupRef.current.classList.add("slide-up")
        parent.classList.remove("slide-up")
      }
    }
  }

  const handleSignupClick = () => {
    if (screen == "login") {
      setscreen("signup")
      const parent = signupRef.current

      if (!parent.classList.contains("slide-up")) {
        parent.classList.add("slide-up")
      } else {
        loginRef.current.closest(".login").classList.add("slide-up")
        parent.classList.remove("slide-up")
      }
    }
  }

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
  })

  const handleSignup = async () => {
    try {
      setError("")
      setSuccess("")

      const { email, password } = signupData

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Invalid email format.")
        return
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
      if (!passwordRegex.test(password)) {
        setError(
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol."
        )
        return
      }

      const response = await axiosInstance.post("/auth/signup", {
        ...signupData,
        role: "customer",
      })

      setSuccess(response.data.message)
      handleLoginClick()
    } catch (err) {
      
      console.log(err)
      setError(err.response?.data?.message || "Signup failed")
    }
  }

  const handleLogin = async () => {
    try {
      setError("")
      setSuccess("")

      const { email } = loginData
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Invalid email format.")
        return
      }

      const response = await axiosInstance.post("/auth/login", loginData)

      setSuccess(response.data.message)
      navigate("/profile")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="form-wrapper">
      <div className="form-structor">
        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>{success}</p>
        )}

        <div className="signup" ref={signupRef}>
          <h2
            className="form-title"
            id="signup"
            onClick={handleSignupClick}
          >
            <span>or</span>Sign up
          </h2>

          <div className="form-holder">
            <input
              type="text"
              className="input"
              placeholder="Name"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
            />
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
            <div className="password-container">
              <input
                type={showPasswordSignup ? "text" : "password"}
                className="input"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    password: e.target.value,
                  })
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowPasswordSignup(!showPasswordSignup)}
              >
                {showPasswordSignup ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button className="submit-btn" onClick={handleSignup}>
            Sign up
          </button>
        </div>

        <div className="login slide-up">
          <div className="center" ref={loginRef}>
            <h2
              className="form-title"
              id="login"
              onClick={handleLoginClick}
            >
              <span>or</span>Log in
            </h2>

            <div className="form-holder">
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              <div className="password-container">
                <input
                  type={showPasswordLogin ? "text" : "password"}
                  className="input"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
                    })
                  }
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                >
                  {showPasswordLogin ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button className="submit-btn" onClick={handleLogin}>
              Log in
            </button>
          </div>
        </div>
      </div>

      <div className="side-image" />
    </div>
  )
}

export default AuthForm

//email validation
//enforce a strong password policy

// import { useRef, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/AuthForm.css";

// const AuthForm = () => {
//   const loginRef = useRef(null);
//   const signupRef = useRef(null);
//   const navigate = useNavigate();

//   const [signupData, setSignupData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleLoginClick = () => {
//     const parent = loginRef.current.closest(".login");

//     if (!parent.classList.contains("slide-up")) {
//       parent.classList.add("slide-up");
//     } else {
//       signupRef.current.classList.add("slide-up");
//       parent.classList.remove("slide-up");
//     }
//   };

//   const handleSignupClick = () => {
//     const parent = signupRef.current;

//     if (!parent.classList.contains("slide-up")) {
//       parent.classList.add("slide-up");
//     } else {
//       loginRef.current.closest(".login").classList.add("slide-up");
//       parent.classList.remove("slide-up");
//     }
//   };

//   const axiosInstance = axios.create({
//     baseURL: "http://localhost:5000/api",
//     withCredentials: true,
//   });

//   const handleSignup = async () => {
//     try {
//       setError("");
//       setSuccess("");

//       const { email, password } = signupData;

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         setError("Invalid email format.");
//         return;
//       }

//       const passwordRegex =
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
//       if (!passwordRegex.test(password)) {
//         setError(
//           "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol."
//         );
//         return;
//       }

//       const response = await axiosInstance.post("/auth/signup", {
//         ...signupData,
//         role: "customer",
//       });

//       setSuccess(response.data.message);
//       handleLoginClick();
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed");
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       setError("");
//       setSuccess("");

//       const { email } = loginData;
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         setError("Invalid email format.");
//         return;
//       }

//       const response = await axiosInstance.post("/auth/login", loginData);

//       setSuccess(response.data.message);
//       navigate("/profile");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="form-structor">
//       {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
//       {success && (
//         <p style={{ color: "green", textAlign: "center" }}>{success}</p>
//       )}

//       <div className="signup" ref={signupRef}>
//         <h2 className="form-title" id="signup" onClick={handleSignupClick}>
//           <span>or</span>Sign up
//         </h2>

//         <div className="form-holder">
//           <input
//             type="text"
//             className="input"
//             placeholder="Name"
//             value={signupData.name}
//             onChange={(e) =>
//               setSignupData({ ...signupData, name: e.target.value })
//             }
//           />
//           <input
//             type="email"
//             className="input"
//             placeholder="Email"
//             value={signupData.email}
//             onChange={(e) =>
//               setSignupData({ ...signupData, email: e.target.value })
//             }
//           />
//           <input
//             type="password"
//             className="input"
//             placeholder="Password"
//             value={signupData.password}
//             onChange={(e) =>
//               setSignupData({ ...signupData, password: e.target.value })
//             }
//           />
//         </div>

//         <button className="submit-btn" onClick={handleSignup}>
//           Sign up
//         </button>
//       </div>

//       <div className="login slide-up">
//         <div className="center" ref={loginRef}>
//           <h2 className="form-title" id="login" onClick={handleLoginClick}>
//             <span>or</span>Log in
//           </h2>

//           <div className="form-holder">
//             <input
//               type="email"
//               className="input"
//               placeholder="Email"
//               value={loginData.email}
//               onChange={(e) =>
//                 setLoginData({ ...loginData, email: e.target.value })
//               }
//             />
//             <input
//               type="password"
//               className="input"
//               placeholder="Password"
//               value={loginData.password}
//               onChange={(e) =>
//                 setLoginData({ ...loginData, password: e.target.value })
//               }
//             />
//           </div>

//           <button className="submit-btn" onClick={handleLogin}>
//             Log in
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;

//fully gd start
// import { useRef, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // used to redirect user after login
// import "../styles/AuthForm.css"; // keep your existing CSS file

// const AuthForm = () => {
//   // Refs to DOM elements used to animate the form transition between login and signup
//   const loginRef = useRef(null);
//   const signupRef = useRef(null);

//   // React Router navigation hook – used to redirect to another page (like /profile)
//   const navigate = useNavigate();

//   // -------------------- STATE --------------------

//   // Stores signup form input values: name, email, password
//   const [signupData, setSignupData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   // Stores login form input values: email, password
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   // Display error or success messages after API responses
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // -------------------- FORM SWITCHING ANIMATIONS --------------------

//   // Show login form (used when clicking "Log in" toggle or after signing up)
//   const handleLoginClick = () => {
//     const parent = loginRef.current.closest(".login");

//     if (!parent.classList.contains("slide-up")) {
//       parent.classList.add("slide-up");
//     } else {
//       // If already showing login, animate to signup instead
//       signupRef.current.classList.add("slide-up");
//       parent.classList.remove("slide-up");
//     }
//   };

//   // Show signup form (used when clicking "Sign up" toggle)
//   const handleSignupClick = () => {
//     const parent = signupRef.current;

//     if (!parent.classList.contains("slide-up")) {
//       parent.classList.add("slide-up");
//     } else {
//       // If already showing signup, animate to login instead
//       loginRef.current.closest(".login").classList.add("slide-up");
//       parent.classList.remove("slide-up");
//     }
//   };

//   // -------------------- AXIOS SETUP --------------------

//   // Custom Axios instance to reuse base URL and include cookies
//   const axiosInstance = axios.create({
//     baseURL: "http://localhost:5000/api", // backend URL
//     withCredentials: true, // required to send/receive cookies for auth
//   });

//   // -------------------- SIGNUP HANDLER --------------------

//   const handleSignup = async () => {
//     try {
//       setError("");
//       setSuccess("");

//       // Send POST request to /auth/signup with the input values
//       const response = await axiosInstance.post("/auth/signup", {
//         ...signupData,
//         role: "customer", // hardcoded role assignment for new users
//       });

//       // Show success message returned by backend
//       setSuccess(response.data.message);

//       // ✅ After successful signup, trigger transition to login form
//       handleLoginClick(); // this visually switches to login
//     } catch (err) {
//       // Show error if signup fails
//       setError(err.response?.data?.message || "Signup failed");
//     }
//   };

//   // -------------------- LOGIN HANDLER --------------------

//   const handleLogin = async () => {
//     try {
//       setError("");
//       setSuccess("");

//       // Send POST request to /auth/login with login form values
//       const response = await axiosInstance.post("/auth/login", loginData);

//       // Show success message returned by backend
//       setSuccess(response.data.message);

//       // ✅ Redirect user to /profile after successful login
//       navigate("/profile"); // handled via React Router
//     } catch (err) {
//       // Show error if login fails
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   // -------------------- JSX RETURN --------------------

//   return (
//     <div className="form-structor">
//       {/* Global message display */}
//       {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
//       {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

//       {/* -------------------- SIGNUP FORM -------------------- */}
//       <div className="signup" ref={signupRef}>
//         {/* Toggle title: when clicked, switches to signup view */}
//         <h2 className="form-title" id="signup" onClick={handleSignupClick}>
//           <span>or</span>Sign up
//         </h2>

//         {/* Signup form inputs */}
//         <div className="form-holder">
//           <input
//             type="text"
//             className="input"
//             placeholder="Name"
//             value={signupData.name}
//             onChange={(e) =>
//               setSignupData({ ...signupData, name: e.target.value })
//             }
//           />
//           <input
//             type="email"
//             className="input"
//             placeholder="Email"
//             value={signupData.email}
//             onChange={(e) =>
//               setSignupData({ ...signupData, email: e.target.value })
//             }
//           />
//           <input
//             type="password"
//             className="input"
//             placeholder="Password"
//             value={signupData.password}
//             onChange={(e) =>
//               setSignupData({ ...signupData, password: e.target.value })
//             }
//           />
//         </div>

//         {/* Submit signup button */}
//         <button className="submit-btn" onClick={handleSignup}>
//           Sign up
//         </button>
//       </div>

//       {/* -------------------- LOGIN FORM -------------------- */}
//       <div className="login slide-up">
//         <div className="center" ref={loginRef}>
//           {/* Toggle title: when clicked, switches to login view */}
//           <h2 className="form-title" id="login" onClick={handleLoginClick}>
//             <span>or</span>Log in
//           </h2>

//           {/* Login form inputs */}
//           <div className="form-holder">
//             <input
//               type="email"
//               className="input"
//               placeholder="Email"
//               value={loginData.email}
//               onChange={(e) =>
//                 setLoginData({ ...loginData, email: e.target.value })
//               }
//             />
//             <input
//               type="password"
//               className="input"
//               placeholder="Password"
//               value={loginData.password}
//               onChange={(e) =>
//                 setLoginData({ ...loginData, password: e.target.value })
//               }
//             />
//           </div>

//           {/* Submit login button */}
//           <button className="submit-btn" onClick={handleLogin}>
//             Log in
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;

//fully gd end

//WORKING BUT MINUS
// import { useRef, useState } from "react";
// import axios from "axios";
// import "../styles/AuthForm.css";

// const AuthForm = () => {
//   const loginRef = useRef(null);
//   const signupRef = useRef(null);

//   const [signupData, setSignupData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleLoginClick = () => {
//     const parent = loginRef.current.closest(".login");
//     if (!parent.classList.contains("slide-up")) {
//       parent.classList.add("slide-up");
//     } else {
//       signupRef.current.classList.add("slide-up");
//       parent.classList.remove("slide-up");
//     }
//   };

//   const handleSignupClick = () => {
//     const parent = signupRef.current;
//     if (!parent.classList.contains("slide-up")) {
//       parent.classList.add("slide-up");
//     } else {
//       loginRef.current.closest(".login").classList.add("slide-up");
//       parent.classList.remove("slide-up");
//     }
//   };

//   const axiosInstance = axios.create({
//     baseURL: "http://localhost:5000/api",
//     withCredentials: true,
//   });

//   const handleSignup = async () => {
//     try {
//       setError("");
//       setSuccess("");

//       const response = await axiosInstance.post("/auth/signup", {
//         ...signupData,
//         role: "customer", // signup always defaults to user
//       });

//       setSuccess(response.data.message);
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed");
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       setError("");
//       setSuccess("");

//       const response = await axiosInstance.post("/auth/login", loginData);

//       setSuccess(response.data.message);
//       // Optional: handle redirect or token storage
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="form-structor">
//       {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
//       {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

//       <div className="signup" ref={signupRef}>
//         <h2 className="form-title" id="signup" onClick={handleSignupClick}>
//           <span>or</span>Sign up
//         </h2>
//         <div className="form-holder">
//           <input
//             type="text"
//             className="input"
//             placeholder="Name"
//             value={signupData.name}
//             onChange={(e) =>
//               setSignupData({ ...signupData, name: e.target.value })
//             }
//           />
//           <input
//             type="email"
//             className="input"
//             placeholder="Email"
//             value={signupData.email}
//             onChange={(e) =>
//               setSignupData({ ...signupData, email: e.target.value })
//             }
//           />
//           <input
//             type="password"
//             className="input"
//             placeholder="Password"
//             value={signupData.password}
//             onChange={(e) =>
//               setSignupData({ ...signupData, password: e.target.value })
//             }
//           />
//         </div>
//         <button className="submit-btn" onClick={handleSignup}>
//           Sign up
//         </button>
//       </div>

//       <div className="login slide-up">
//         <div className="center" ref={loginRef}>
//           <h2 className="form-title" id="login" onClick={handleLoginClick}>
//             <span>or</span>Log in
//           </h2>
//           <div className="form-holder">
//             <input
//               type="email"
//               className="input"
//               placeholder="Email"
//               value={loginData.email}
//               onChange={(e) =>
//                 setLoginData({ ...loginData, email: e.target.value })
//               }
//             />
//             <input
//               type="password"
//               className="input"
//               placeholder="Password"
//               value={loginData.password}
//               onChange={(e) =>
//                 setLoginData({ ...loginData, password: e.target.value })
//               }
//             />
//           </div>
//           <button className="submit-btn" onClick={handleLogin}>
//             Log in
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;