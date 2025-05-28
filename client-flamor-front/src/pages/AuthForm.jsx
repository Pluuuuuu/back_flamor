import { useRef, useState, useEffect } from "react"
import axiosInstance from "../api/axiosInstance"
import { useNavigate } from "react-router-dom"
import "../styles/AuthForm.css"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const AuthForm = () => {
  const loginRef = useRef(null)
  const signupRef = useRef(null)
  const navigate = useNavigate()

  // Check if the user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/profile")
        if (res.data?.user) {
          const user = res.data.user
          if (user.role === "admin") {
            navigate("/AdminDashboard")
          } else {
            navigate("/profile")
          }
        }
      } catch (err) {
        // user not logged in, do nothing
      }
    }
    checkAuth()
  }, [navigate])

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

  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const [showPasswordSignup, setShowPasswordSignup] = useState(false)
  const [showPasswordLogin, setShowPasswordLogin] = useState(false)

  const handleLoginClick = () => {
    if (screen === "signup") {
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
    if (screen === "login") {
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

  const handleSignup = async () => {
    try {
      setError("")
      setSuccess("")
      setLoading(true)

      const { email, password } = signupData
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

      if (!emailRegex.test(email)) {
        setError("Invalid email format.")
        return
      }

      if (!passwordRegex.test(password)) {
        setError("Password must be 8+ characters with uppercase, lowercase, number, and symbol.")
        return
      }

      const res = await axiosInstance.post("/api/auth/signup", {
        ...signupData,
        role: "customer",
      })

      setSuccess(res.data.message)
      setSignupData({ name: "", email: "", password: "" })
      handleLoginClick()
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      setError("")
      setSuccess("")
      setLoading(true)

      const { email } = loginData
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(email)) {
        setError("Invalid email format.")
        return
      }

      const res = await axiosInstance.post("/api/auth/login", loginData)

      if (rememberMe) {
        localStorage.setItem("token", res.data.token)
      }

      setSuccess(res.data.message)

      const { user } = res.data
      if (user.role === "admin") {
        navigate("/AdminDashboard")
      } else {
        navigate("/profile")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-wrapper">
      <div className="form-structor">
        {error && <div className="toast error">{error}</div>}
        {success && <div className="toast success">{success}</div>}

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
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            />
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />
            <div className="password-container">
              <input
                type={showPasswordSignup ? "text" : "password"}
                className="input"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPasswordSignup(!showPasswordSignup)}
              >
                {showPasswordSignup ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button className="submit-btn" onClick={handleSignup} disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
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
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              <div className="password-container">
                <input
                  type={showPasswordLogin ? "text" : "password"}
                  className="input"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                >
                  {showPasswordLogin ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            <button className="submit-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
