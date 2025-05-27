import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, ArrowRight } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Use the hooks
  const { signup, error: signupError, isLoading: isSignupLoading } = useSignup();
  const { login, error: loginError, isLoading: isLoginLoading } = useLogin();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginEmail, loginPassword);

    if (result.success) {
      navigate("/home");
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const result = await signup(name, signupEmail, signupPassword);

    if (result.success) {
      setIsSignupMode(false);
      // Clear signup form
      setName("");
      setSignupEmail("");
      setSignupPassword("");
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    // Clear any errors when switching modes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4a90e2] via-[#50E3C2] to-[#4a90e2] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Decorative Panel */}
            <div className="lg:w-1/2 bg-gradient-to-br from-[#4a90e2] to-[#50E3C2] p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 border-2 border-white rounded-lg rotate-45"></div>
                <div className="absolute top-1/2 left-5 w-12 h-12 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-10 left-1/3 w-8 h-8 bg-white rounded-full"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    {isSignupMode ? (
                      <UserPlus className="w-12 h-12" />
                    ) : (
                      <LogIn className="w-12 h-12" />
                    )}
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                    {isSignupMode ? "Join Us Today" : "Welcome Back"}
                  </h1>
                  <p className="text-xl lg:text-2xl text-white/90 mb-8">
                    {isSignupMode 
                      ? "Start your journey with us and discover amazing opportunities"
                      : "Sign in to continue your journey and connect with others"
                    }
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-white/80">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Secure & Encrypted</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-white/80">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Fast & Reliable</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-white/80">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Panel */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              {!isSignupMode ? (
                /* Login Form */
                <div className="w-full">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                    <p className="text-gray-600">Enter your credentials to access your account</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label htmlFor="loginEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          id="loginEmail"
                          placeholder="Enter your email"
                          onChange={(e) => setLoginEmail(e.target.value)}
                          value={loginEmail}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-[#50E3C2]/10 to-[#4a90e2]/10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="loginPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          id="loginPassword"
                          placeholder="Enter your password"
                          onChange={(e) => setLoginPassword(e.target.value)}
                          value={loginPassword}
                          required
                          className="w-full pl-12 pr-12 py-4 bg-gradient-to-r from-[#50E3C2]/10 to-[#4a90e2]/10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium text-gray-700 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                      <a href="#" className="text-sm text-[#4a90e2] hover:text-[#50E3C2] font-medium transition-colors">
                        Forgot your password?
                      </a>
                    </div>

                    {/* Error Display */}
                    {loginError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-red-800 font-medium text-sm">{loginError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className="w-full bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] hover:from-[#50E3C2] hover:to-[#4a90e2] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoginLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                          Sign In
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Switch to Signup */}
                    <div className="text-center pt-4">
                      <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={toggleMode}
                          className="text-[#4a90e2] hover:text-[#50E3C2] font-semibold transition-colors"
                        >
                          Sign up now
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              ) : (
                /* Signup Form */
                <div className="w-full">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                    <p className="text-gray-600">Join us and start your amazing journey</p>
                  </div>

                  <form onSubmit={handleSignin} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          id="name"
                          placeholder="Enter your full name"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-[#50E3C2]/10 to-[#4a90e2]/10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="signupEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          id="signupEmail"
                          placeholder="Enter your email"
                          onChange={(e) => setSignupEmail(e.target.value)}
                          value={signupEmail}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-[#50E3C2]/10 to-[#4a90e2]/10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="signupPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          id="signupPassword"
                          placeholder="Create a strong password"
                          onChange={(e) => setSignupPassword(e.target.value)}
                          value={signupPassword}
                          required
                          className="w-full pl-12 pr-12 py-4 bg-gradient-to-r from-[#50E3C2]/10 to-[#4a90e2]/10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium text-gray-700 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Error Display */}
                    {signupError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-red-800 font-medium text-sm">{signupError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSignupLoading}
                      className="w-full bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] hover:from-[#50E3C2] hover:to-[#4a90e2] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSignupLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                          Create Account
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Switch to Login */}
                    <div className="text-center pt-4">
                      <p className="text-gray-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={toggleMode}
                          className="text-[#4a90e2] hover:text-[#50E3C2] font-semibold transition-colors"
                        >
                          Sign in now
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;