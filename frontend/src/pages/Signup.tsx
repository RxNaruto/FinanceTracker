import { useState } from "react";
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
      const response = await axios.post(
        "http://localhost:3000/t/signup",
        {
          name,
          email,
          password
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us to start tracking</p>
          </div>

          <div className="space-y-4">
            <InputBox label="Name" placeholder="John Doe" onChange={(e) => setName(e.target.value)} />
            <InputBox label="Email" placeholder="johndoe@mail.com" onChange={(e) => setEmail(e.target.value)} />
            <InputBox label="Password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />

            <Button label="Sign Up" onClick={handleSignup} />
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
