// ✅ FILE: Client/src/Components/Auth/Auth.js

import React, { useState, useEffect } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { useSignup } from '../../hooks/useSignup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import "./Auth.css";


const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [signinBtn, setSigninBtn] = useState('Sign in');
  const [signupBtn, setSignupBtn] = useState('Sign up');
  const [forgotBtn, setforgotBtn] = useState('Submit');
  const { login, loginError, isLoading } = useLogin();
  const { signup, signupError, signupIsLoading } = useSignup();
  const [success, setSuccess] = useState(null);
  const [isForgot, setIsForgot] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const showLoader = isLoading || signupIsLoading || isForgotLoading;


  const calculatePasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    if (loginError) {
      setErrors(prevErrors => [...prevErrors.slice(-3), loginError]);
      toast.error(loginError);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  }, [loginError]);

  useEffect(() => {
    if (signupError) {
      setErrors(prevErrors => [...prevErrors.slice(-3), signupError]);
      toast.error(signupError);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  }, [signupError]);


  const handleSwap = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setTimeout(() => {
      setIsForgot(false);
      setErrors([]);
    }, 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSigninBtn('Signing in');
  
    setTimeout(async () => {
      const res = await login(email.toLowerCase(), password);
  
      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userName", res.userName);
        localStorage.setItem("email", res.email);
        localStorage.setItem("role", res.role);
  
        if (res.role === "admin") {
          navigate("/");
        } else {
          navigate("/");
        }
      } else {
        // ✅ Show toast if login failed
        toast.error("Invalid email or password");
      }
  
      setSigninBtn('Sign In');
    }, 300);
  };
  

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupBtn('Signing up');

    setTimeout(async () => {
      const result = await signup(name, email.toLowerCase(), password, otp);

      if (result?.token) {
        // ✅ Toast message
        toast.success("Signup successful! Redirecting...");

        // ✅ Save to localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("userName", result.userName);
        localStorage.setItem("email", result.email);
        localStorage.setItem("role", result.role);

        // ✅ Redirect
        setTimeout(() => {
          if (result.role === "admin") {
            navigate("/");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        toast.error("Signup failed. Try again.");
      }

      setSignupBtn('Sign Up');
    }, 300);
  };




  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hanleGenOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/otp/genotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors.slice(-3), errorData.error || 'An error occurred']);
        setTimeout(() => {
          setErrors(prevErrors => prevErrors.slice(1));
        }, 3000);
      } else {
        setSuccess('OTP sent successfully');
        setTimeout(() => { setSuccess(null); }, 3000);
      }
    } catch (error) {
      setErrors(prevErrors => [...prevErrors.slice(-3), 'Network error']);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  };

  const handleForget = async (e) => {
    e.preventDefault();
    setforgotBtn('Submitting');
    setIsForgotLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/otp/verifyotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors.slice(-3), errorData.error || 'An error occurred']);
      } else {
        setSuccess('OTP verified. Change your password.');
        setShowNewPassword(true);
      }
    } catch (error) {
      setErrors(prevErrors => [...prevErrors.slice(-3), 'Network error']);
    } finally {
      setTimeout(() => { setErrors([]); }, 3000);
      setforgotBtn('Submit');
      setIsForgotLoading(false);
    }
  };

  const hanleForgotOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/otp/forgototp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors.slice(-3), errorData.error || 'An error occurred']);
      } else {
        setSuccess('OTP sent successfully');
      }
    } catch (error) {
      setErrors(prevErrors => [...prevErrors.slice(-3), 'Network error']);
    } finally {
      setTimeout(() => { setErrors([]); }, 3000);
    }
  };

  const updatePassword = async (e) => {
    setforgotBtn('Submitting');
    setIsForgotLoading(true);
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, newConfirmPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors.slice(-3), errorData.error || 'An error occurred']);
      } else {
        setSuccess('Password Updated Successfully.');
        setNewPassword('');
        setNewConfirmPassword('');
        setEmail('');
        setPassword('');
        setOtp('');
        setShowNewPassword(false);
        setIsForgot(false);
      }
    } catch (error) {
      setErrors(prevErrors => [...prevErrors.slice(-3), 'Network error']);
    } finally {
      setforgotBtn('Submit');
      setIsForgotLoading(false);
      setTimeout(() => { setErrors([]); }, 3000);
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 1: return 'red';
      case 2: return 'orange';
      case 3: return 'gold';
      case 4: return 'yellowgreen';
      case 5: return 'green';
      default: return 'lightgray';
    }
  };
  return (

    <div className="loginSignup-background-container">
      <div className={`loginSignup-container ${isSignUp ? 'loginSignup-right-panel-active' : ''}`}>
        <span className="loginSignup-exit-top" onClick={() => navigate('/')}>×</span>
        <div className="loginSignup-form-container loginSignup-sign-up-container">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="loginSignup-input-field"
            />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="loginSignup-input-field"
            />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="loginSignup-input-field password-field"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password-btn"
              >
                {showPassword ? <i className="fa fa-eye-slash icon-white"></i> : <i className="fa fa-eye icon-white"></i>}
              </button>
            </div>
            {isSignUp && password && (
              <>
                <div className="password-checklist">
                  <div className={`rule ${password.length >= 8 ? 'valid' : ''}`}>
                    <i className="fa fa-check-circle" /> Min. 8 characters
                  </div>
                  <div className={`rule ${/[A-Z]/.test(password) ? 'valid' : ''}`}>
                    <i className="fa fa-check-circle" /> Uppercase letter
                  </div>
                  <div className={`rule ${/[a-z]/.test(password) ? 'valid' : ''}`}>
                    <i className="fa fa-check-circle" /> Lowercase letter
                  </div>
                  <div className={`rule ${/[0-9]/.test(password) ? 'valid' : ''}`}>
                    <i className="fa fa-check-circle" /> Number
                  </div>
                  <div className={`rule ${/[!@#$%^&*]/.test(password) ? 'valid' : ''}`}>
                    <i className="fa fa-check-circle" /> Symbol (@, #, $...)
                  </div>
                </div>

                <div className="password-strength">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${(calculatePasswordStrength() / 5) * 100}%`,
                      backgroundColor: getStrengthColor(calculatePasswordStrength()),
                    }}
                  />
                </div>
              </>
            )}

            <div className="password-container">
              <input
                type={'text'}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                className="loginSignup-input-field password-field"
              />
              <button
                type="button"
                onClick={hanleGenOtp}
                className="toggle-otp-btn"
              >
                Send
              </button>
            </div>
            {showLoader && <div className="auth-loader"></div>}
            <button type="submit" className="loginSignup-btn" disabled={signupIsLoading}>
              {signupBtn}
            </button>
          </form> {/* ✅ Proper closing */}
        </div> {/* ✅ Proper closing */}

        <div className="loginSignup-form-container loginSignup-sign-in-container">
          {!isForgot && <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="loginSignup-input-field"
            />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="loginSignup-input-field password-field"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password-btn"
              >
                {showPassword ? <i className="fa fa-eye-slash icon-white"></i> : <i className="fa fa-eye icon-white"></i>}
              </button>
            </div>
            {loginError && (
              <div className="auth-error-msg">
                {loginError}
              </div>
            )}

            <p onClick={() => setIsForgot(true)} className='loginSignup-forgot-password'>Forgot Password</p>
            {showLoader && <div className="auth-loader"></div>}
            <button type="submit" className="loginSignup-btn" disabled={isLoading}>
              {signinBtn}
            </button>
          </form>}

          {isForgot &&
            <>
              <form onSubmit={!showNewPassword ? handleForget : updatePassword}>
                <h1>Forgot Password</h1>
                {!showNewPassword && <><input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="loginSignup-input-field"
                />
                  <div className="password-container">
                    <input
                      type={'text'}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="OTP"
                      className="loginSignup-input-field password-field"
                    />
                    <button
                      type="button"
                      onClick={hanleForgotOtp}
                      className="toggle-otp-btn"
                    >
                      Send
                    </button>
                  </div></>}

                {showNewPassword && <><input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="loginSignup-input-field"
                />
                  <input
                    type="text"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="loginSignup-input-field"
                  />
                </>}

                <p onClick={() => setIsForgot(false)} className='loginSignup-forgot-password'>Back to Sign In</p>
                {showLoader && <div className="auth-loader"></div>}
                <button type="submit" className="loginSignup-btn" disabled={isForgotLoading}>
                  {forgotBtn}
                </button>
              </form> </>}
        </div>

        <div className="loginSignup-overlay-container">
          <div className="loginSignup-overlay">
            <div className="loginSignup-overlay-panel loginSignup-overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="loginSignup-ghost" onClick={handleSwap}>
                Sign In
              </button>
            </div>
            <div className="loginSignup-overlay-panel loginSignup-overlay-right">
              {!isForgot && (
                <>
                  <h1>Hello, Friend!</h1>
                  <p>Enter your personal details and start your journey with us.</p>
                </>
              )}
              {isForgot && (
                <>
                  <h1>Forgot Password?</h1>
                  <p>Enter your email and OTP to reset your password.</p>
                </>
              )}

              <button className="loginSignup-ghost" onClick={handleSwap}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-errors-container">
        {errors.map((error, index) => (
          <div key={index} className="auth-error">
            {error}
          </div>
        ))}
        {success && <div className='auth-error profile-Succ-msg'>
          {success}
        </div>}
      </div>
    </div>
  );
};

export default Auth;
