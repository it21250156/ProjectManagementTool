import React, { useRef, useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

import "../assets/css/signup.css";

import frontImg from "../assets/images/frontImg.png";
import backImg from "../assets/images/backImg.jpg";

const Signup = () => {
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isFlipped, setIsFlipped] = useState(false); // Add state for flip

  // Use the hooks
  const { signup, error: signupError, isLoading: isSignupLoading } = useSignup();
  const { login, error: loginError, isLoading: isLoginLoading } = useLogin();

  const navigate = useNavigate();

  const flipCheckboxRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginEmail, loginPassword);

    if (result.success) {
      navigate("/home");
    } else {
      alert(loginError || 'Login failed');
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const result = await signup(name, signupEmail, signupPassword);

    if (result.success) {
      // Switch back to the login form
      if (flipCheckboxRef.current) {
        flipCheckboxRef.current.checked = false;
        setIsFlipped(false);
      }
      alert("Signup successful! Please log in.");
    } else {
      alert(signupError || "Signup failed");
    }
  };

  return (
    <div>
      <div className="main-container">
        <div className="container">
          <input
            type="checkbox"
            id="flip"
            ref={flipCheckboxRef}
          />
          <div className="cover">
            <div className="front">
              <img src={frontImg} alt="" />
              <div className="text">
                <span className="text-1">
                  Every new friend is a <br /> new adventure
                </span>
                <span className="text-2">Let's get connected</span>
              </div>
            </div>
            <div className="back">
              <img className="backImg" src={backImg} alt="" />
              <div className="text">
                <span className="text-1">
                  Complete miles of journey <br /> with one step
                </span>
                <span className="text-2">Let's get started</span>
              </div>
            </div>
          </div>
          <div className="forms">
            <div className="form-content">
              {/* Login form */}
              <div className="login-form">
                <div className="title">Login</div>
                <form action="#" onSubmit={handleLogin}>
                  <div className="input-boxes">
                    <div className="input-box">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="text"
                        placeholder="Enter your email"
                        onChange={(e) => setLoginEmail(e.target.value)}
                        value={loginEmail}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setLoginPassword(e.target.value)}
                        value={loginPassword}
                        required
                      />
                    </div>
                    {/* Login form fields */}
                    {loginError && (
                      <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                        {loginError}
                      </div>
                    )}
                    <div className="text">
                      <a href="#">Forgot password?</a>
                    </div>
                    <div className="button input-box">
                      <input type="submit" value="Login" />
                    </div>
                    <div className="text sign-up-text">
                      Don't have an account?{" "}
                      <label htmlFor="flip">Signup now</label>
                    </div>
                  </div>
                </form>
              </div>

              {/* Signup Form */}
              <div className="signup-form">
                <div className="title">Signup</div>
                <form action="#" onSubmit={handleSignin}>
                  <div className="input-boxes">
                    <div className="input-box">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        onChange={(e) => setSignupEmail(e.target.value)}
                        value={signupEmail}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setSignupPassword(e.target.value)}
                        value={signupPassword}
                        required
                      />
                    </div>
                    {/* Signup form fields */}
                    {signupError && (
                      <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                        {signupError}
                      </div>
                    )}
                    <div className="button input-box">
                      <input
                        type="submit"
                        value="Signup"
                        disabled={isSignupLoading}
                      />
                    </div>

                    <div className="text sign-up-text">
                      Already have an account?{" "}
                      <label htmlFor="flip">Login now</label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
