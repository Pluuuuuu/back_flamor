import { useRef, useState } from "react";
import axios from "axios";
import "../styles/AuthForm.css";

const AuthForm = () => {
  const loginRef = useRef(null);
  const signupRef = useRef(null);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLoginClick = () => {
    const parent = loginRef.current.closest(".login");
    if (!parent.classList.contains("slide-up")) {
      parent.classList.add("slide-up");
    } else {
      signupRef.current.classList.add("slide-up");
      parent.classList.remove("slide-up");
    }
  };

  const handleSignupClick = () => {
    const parent = signupRef.current;
    if (!parent.classList.contains("slide-up")) {
      parent.classList.add("slide-up");
    } else {
      loginRef.current.closest(".login").classList.add("slide-up");
      parent.classList.remove("slide-up");
    }
  };

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
  });

  const handleSignup = async () => {
    try {
      setError("");
      setSuccess("");

      const response = await axiosInstance.post("/auth/signup", {
        ...signupData,
        role: "customer", // signup always defaults to user
      });

      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      setError("");
      setSuccess("");

      const response = await axiosInstance.post("/auth/login", loginData);

      setSuccess(response.data.message);
      // Optional: handle redirect or token storage
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="form-structor">
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

      <div className="signup" ref={signupRef}>
        <h2 className="form-title" id="signup" onClick={handleSignupClick}>
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
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={signupData.password}
            onChange={(e) =>
              setSignupData({ ...signupData, password: e.target.value })
            }
          />
        </div>
        <button className="submit-btn" onClick={handleSignup}>
          Sign up
        </button>
      </div>

      <div className="login slide-up">
        <div className="center" ref={loginRef}>
          <h2 className="form-title" id="login" onClick={handleLoginClick}>
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
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
          </div>
          <button className="submit-btn" onClick={handleLogin}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;


//isusue
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

//   // Animate Slide Up / Down
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

//   // Axios Config (with credentials for cookies)
//   const axiosInstance = axios.create({
//     baseURL: "http://localhost:5000/api", // Change to your backend base URL
//     withCredentials: true,
//   });

//   const handleSignup = async () => {
//     try {
//       setError("");
//       setSuccess("");

//       const response = await axiosInstance.post("/auth/signup", {
//         ...signupData,
//         role: "user", // or any default role
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
//       // Optionally redirect or update auth state
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














// import { useRef } from "react";
// import "../styles/AuthForm.css";

// const AuthForm = () => {
//   const loginRef = useRef(null);
//   const signupRef = useRef(null);

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

//   return (
//     <div className="form-structor">
//       <div className="signup" ref={signupRef}>
//         <h2 className="form-title" id="signup" onClick={handleSignupClick}>
//           <span>or</span>Sign up
//         </h2>
//         <div className="form-holder">
//           <input type="text" className="input" placeholder="Name" />
//           <input type="email" className="input" placeholder="Email" />
//           <input type="password" className="input" placeholder="Password" />
//         </div>
//         <button className="submit-btn">Sign up</button>
//       </div>

//       <div className="login slide-up">
//         <div className="center" ref={loginRef}>
//           <h2 className="form-title" id="login" onClick={handleLoginClick}>
//             <span>or</span>Log in
//           </h2>
//           <div className="form-holder">
//             <input type="email" className="input" placeholder="Email" />
//             <input type="password" className="input" placeholder="Password" />
//           </div>
//           <button className="submit-btn">Log in</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;
