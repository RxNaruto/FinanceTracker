import React, { useState } from "react";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/t/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md space-y-6">

        <h1 className="text-3xl font-bold">Sign In</h1>
        <p>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange-500">
            Sign up
          </Link>
        </p>

        <InputBox
          label="Email"
          placeholder="johndoe@mail.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputBox
          label="Password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button label="Sign In" onClick={handleSignin} />

      </div>
    </div>
  );
};

export default Signin;
