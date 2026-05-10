import { useState } from "react";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) { alert("Please fill all fields"); return; }
    try {
      const response = await axios.post(
        "https://financetracker.rithkchaudharytechnologies.xyz/t/signup",
        { name, email, password }
      );
      toast.success("Signup successful");
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400">Join us to start tracking</p>
          </div>
          <div className="space-y-4">
            <InputBox label="Name" placeholder="John Doe" onChange={(e) => setName(e.target.value)} />
            <InputBox label="Email" placeholder="johndoe@mail.com" onChange={(e) => setEmail(e.target.value)} />
            <InputBox label="Password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
            <Button label="Sign Up" onClick={handleSignup} />
          </div>
          <div className="mt-6 text-center">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link to="/signin" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;