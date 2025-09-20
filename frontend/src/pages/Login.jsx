import React, { useState } from "react";
import api from "../utils/api";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // var res
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      
      // alert(res.data);
      navigate(`/${res.data.user.role}/dashboard`)
    } catch (err) {
      console.error(err);
      // alert(err);
    // alert(data );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" onChange={handleChange} placeholder="Email" />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
