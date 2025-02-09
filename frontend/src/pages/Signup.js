import React, { useState } from "react";
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
  const { signup, error, isLoading } = useSignup();
  const { login, isLoggedIn, logout } = useLogin();
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    await signup(name, signupEmail, signupPassword);

    if (!error) {
      navigate("/home");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(loginEmail, loginPassword);

    if (!error) {
      navigate("/home");
    }
  };

  return (
    <div>
      <div className="main-container">
        <div class="container">
          <input type="checkbox" id="flip" />
          <div class="cover">
            <div class="front">
              <img src={frontImg} alt="" />
              <div class="text">
                <span class="text-1">
                  Every new friend is a <br /> new adventure
                </span>
                <span class="text-2">Let's get connected</span>
              </div>
            </div>
            <div class="back">
              <img class="backImg" src={backImg} alt="" />
              <div class="text">
                <span class="text-1">
                  Complete miles of journey <br /> with one step
                </span>
                <span class="text-2">Let's get started</span>
              </div>
            </div>
          </div>
          <div class="forms">
            <div class="form-content">
              {/* Login form */}
              <div class="login-form">
                <div class="title">Login</div>
                <form action="#" onSubmit={handleLogin}>
                  <div class="input-boxes">
                    <div class="input-box">
                      <i class="fas fa-envelope"></i>
                      <input
                        type="text"
                        placeholder="Enter your email"
                        onChange={(e) => setLoginEmail(e.target.value)}
                        value={loginEmail}
                        required
                      />
                    </div>
                    <div class="input-box">
                      <i class="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setLoginPassword(e.target.value)}
                        value={loginPassword}
                        required
                      />
                    </div>
                    <div class="text">
                      <a href="#">Forgot password?</a>
                    </div>
                    <div class="button input-box">
                      <input type="submit" value="Login" />
                    </div>
                    <div class="text sign-up-text">
                      Don't have an account?{" "}
                      <label for="flip">Signup now</label>
                    </div>
                  </div>
                </form>
              </div>

              {/* Signup Form */}
              <div class="signup-form">
                <div class="title">Signup</div>
                <form action="#" onSubmit={handleSignin}>
                  <div class="input-boxes">
                    <div class="input-box">
                      <i class="fas fa-user"></i>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                      />
                    </div>
                    <div class="input-box">
                      <i class="fas fa-envelope"></i>
                      <input
                        type="text"
                        placeholder="Enter your email"
                        onChange={(e) => setSignupEmail(e.target.value)}
                        value={signupEmail}
                        required
                      />
                    </div>
                    <div class="input-box">
                      <i class="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setSignupPassword(e.target.value)}
                        value={signupPassword}
                        required
                      />
                    </div>
                    <div class="button input-box">
                      <input
                        type="submit"
                        value="Signup"
                        disabled={isLoading}
                      />
                    </div>
                    {error && error.message}
                    <div class="text sign-up-text">
                      Already have an account?{" "}
                      <label for="flip">Login now</label>
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
