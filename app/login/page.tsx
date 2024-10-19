"use client";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter()

  const {onLogin} = useContext(AuthContext)
  const onSubmitHandler = async (username: string, password: string) => {
    try {
      setIsloading(true);
      const { data } = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });
      onLogin(username)
      setIsloading(false);
      router.push('/')
    } catch (error) {
      setIsloading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center border-white border-2 ">
      <div className="flex w-full md:w-2/3 border-white border-2 flex-col items-center justify-center p-6">
        <div className="w-full">
          <h1 className="mb-3 text-5xl font-extrabold text-white">Login</h1>
          <p className="text-xs text-slate-400">Login to access your account</p>
        </div>
        <div className="my-14 flex w-full flex-col items-start justify-start gap-4">
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <label className="text-xs text-slate-200">Username or email</label>
            <input
              placeholder="Enter a username or email..."
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <label className="text-xs text-slate-200">Password</label>
            <input
              placeholder="Enter a password..."
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
            />
          </div>

          <button
            disabled={!username || !password}
            onClick={()=>{ onSubmitHandler(username,password)}}
            className="w-full bg-[#ae7aff] p-3 text-center font-bold text-black cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
           {isLoading ?"Loading..." :"Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
