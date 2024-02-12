import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { GoogleLogin } from "@react-oauth/google";
import { BASE_URL } from "../constants";

import { jwtDecode } from "jwt-decode";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(true);
  const [isLogin, setIsLogin] = useState(true);


  const [seconds,setSeconds] = useState(0);
  
  const [credentials, setCredentials] = useState({
    email: "",
    otp: "",
    name: "",
    password: "",
  });

  const [canResend,setCanResend] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleOtp = (e) => {
    console.log(e.target.value);
    let val = e.target.value;
    val = val.replace(/\D/g, "");
    if (val.length > 6) val = val.substring(0, 6);
    setCredentials((prev) => ({ ...prev, otp: val }));
  };

  const handleChange = (e) => {
    setCredentials((user) => ({ ...user, [e.target.name]: e.target.value }));
  };

  const sendOtp = async () => {
    const res = await axios.post(BASE_URL + "/auth/otp", {
      email: credentials.email,
    });
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(BASE_URL + "/auth/verifyOTP", {
        email: credentials.email,
        otp: credentials.otp,
      });
      console.log(res);
      if (res.data.success) {
        toast("OTP verified successfully");
        if (res.data.user) {
          navigate("/home");
        } else {
          setIsLogin(false);
        }
      } else {
        toast(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast(err.response.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      credentials.email.match("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$") === null
    ) {
      toast("invalid email");
      return;
    }

    if (!showOtp) {
      setShowOtp(true);
      const res = await axios.post(BASE_URL + "/auth/otp", {
        email: credentials.email,
      });
      // const data = await res.data();
      console.log(res);
    } else {
      console.log(credentials);
      const res = await axios.post(
        BASE_URL + `/auth/${isLogin ? "login" : "register"}}`,
        {
          credentials,
        }
      );
      console.log(res);

      if (res.data.success) {
        if (res.data.user) {
          navigate("/home");
        } else {
          setIsLogin(false);
        }
      } else {
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <ToastContainer />
      <div className="flex flex-col items-center justify-center bg-[#365899] text-white p-5">
        <img
          className="h-24 "
          src="https://www.iitrpr.ac.in/sites/default/files/logo_0_2.png"
        />
        <div className="text-3xl font-semibold p-2">
          Welcome to Guest House Portal
        </div>
        <div className="font-medium">
          Indian Institute of Technology, Ropar(Punjab)
        </div>
      </div>

      <div className="flex justify-center items-center h-full border bg-[#f4f4f4]">
        <div className="flex flex-col border justify-center items-center w-[29%] bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="p-2 text-3xl font-semibold bg-[#3498db] text-white w-full text-center">
            Welcome
          </div>

          <div className="m-5 flex flex-col items-center w-full ">
            {isLogin ? (
              <>
                <div className=" font-semibold text-2xl">LOG IN</div>

                <div className="w-full p-5 flex flex-col gap-5 items-center">
                  <input
                    placeholder="Email"
                    className="p-2 border rounded-md text-sm h-12 w-full "
                    onChange={(e) => {
                      setCredentials({ ...credentials, email: e.target.value });
                    }}
                    name="email"
                    value={credentials.email}
                  />
                  {showOtp && (
                    <div className="flex w-full justify-between gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        name="otp"
                        value={credentials.otp}
                        onChange={handleOtp}
                        placeholder="OTP"
                        className="p-2 border rounded-md text-sm h-12 w-full "
                      />
                      <button
                      className="border bg-black bg-[rgba(0,0,0,0.9)] text-white w-full p-2 lg"
                      onClick={() => sendOtp()}
                    >
                      Resend OTP
                    </button>
                    </div>
                  )}
                  <button
                    className="border bg-black bg-[rgba(0,0,0,0.9)] text-white w-full p-2 lg"
                    onClick={handleSubmit}
                  >
                    {showOtp ? "Log In" : "Send OTP"}
                  </button>
                  
                  <div className="text-center">OR</div>

                  <GoogleLogin
                    className="w-full"
                    onSuccess={(res) => {
                      navigate("/", { replace: true });
                      if (res.credential != null) {
                        const cred = jwtDecode(res.credential);
                        console.log(cred);
                      }

                      console.log("Success");
                      console.log("Logged In");
                    }}
                    onError={() => {
                      console.log("Failed");
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className=" font-semibold text-2xl">REGISTER</div>

                <div className="w-full p-5 flex flex-col gap-5 items-center">
                  <form className="flex flex-col gap-5 items-center w-full">
                    <input
                      placeholder="Email"
                      disabled
                      className="p-2 border rounded-md text-sm h-12 w-full"
                      onChange={handleChange}
                      name="email"
                      value={credentials.email}
                    />
                    <input
                      placeholder="Name"
                      className="p-2 border rounded-md text-sm h-12 w-full"
                      onChange={handleChange}
                      name="name"
                      value={credentials.name}
                    />
                    <div className="w-full flex relative">
                      <input
                        placeholder="Password"
                        className="p-2 border rounded-md text-sm h-12 w-full"
                        onChange={handleChange}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                      />
                      <div
                        className="cursor-pointer absolute w-fit right-6 top-3"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </div>
                    </div>
                    <button
                      className="border bg-black text-white w-full p-2 lg"
                      onClick={handleSubmit}
                    >
                      Register
                    </button>
                  </form>
                  <div className="text-center">OR</div>

                  <GoogleLogin
                    className="w-full"
                    onSuccess={(res) => {
                      navigate("/", { replace: true });
                      if (res.credential != null) {
                        const cred = jwtDecode(res.credential);
                        console.log(cred);
                      }

                      console.log("Success");
                      console.log("Logged In");
                    }}
                    onError={() => {
                      console.log("Failed");
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
