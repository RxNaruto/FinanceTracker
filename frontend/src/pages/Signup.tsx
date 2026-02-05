import React, { useState } from 'react';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Contact,User } from 'lucide-react';

export const Signup = () => {
  const[email,setEmail] = useState("");
  const[password,setPassword] = useState("");
  const[name,setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempted with:');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-left">
          <Link to="/Home" className="inline-flex items-center mb-8">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">MealMate</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign up</h1>
          <p className="text-lg text-gray-600">
            or{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
              login to your account
            </Link>
          </p>
          
          {/* Decorative line */}
          <div className="w-16 h-1 bg-black mt-6 mb-8"></div>
        </div>

        {/* Signup form */}
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="relative">
            <InputBox
              label="email"
              placeholder="Jondoe@mail.com"
              onChange={(e)=>{
                setEmail(e.target.value);
              }}
            />
             <Contact className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            
          </div>

          <div className="relative">
            <InputBox
              label="Password"
              placeholder="adcd123"
              onChange={(e)=>{
                setPassword(e.target.value)
              }}
            />
          </div>

          <div className="relative">
            <InputBox
              label="Name"
              placeholder="Jhon Doe"
              onChange={(e)=>{
                setName(e.target.value)
              }}
            />
           <User className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <Button label={"Sign up"} onClick={async()=>{
            try {
                const response = await axios.post("http://localhost:3000/t/signup",{
                    name: name,
                    email: email,
                    password: password
                })
                localStorage.setItem("token",response.data.token);
                navigate("/home");
            } catch (e) {
                console.log(e);
            }
          }}>
          
          </Button>

          <p className="text-sm text-gray-600 text-left leading-relaxed">
            By clicking on Continue, I accept the{' '}
            <Link to="/terms" className="text-gray-900 underline hover:text-orange-500">
              Terms & Conditions
            </Link>
            {' '}&{' '}
            <Link to="/privacy" className="text-gray-900 underline hover:text-orange-500">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;