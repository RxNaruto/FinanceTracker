import React, { useState } from "react";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/signup", {
        name,
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md space-y-6">

        <h1 className="text-3xl font-bold">Create Account</h1>
        <p>
          Already have an account?{" "}
          <Link to="/signin" className="text-orange-500">
            Sign in
          </Link>
        </p>

        <InputBox
          label="Name"
          placeholder="John Doe"
          onChange={(e) => setName(e.target.value)}
        />

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

        <Button label="Sign Up" onClick={handleSignup} />

      </div>
    </div>
  );
};

export default Signup;
