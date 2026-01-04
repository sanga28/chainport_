import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage("✅ Registration successful! Please login.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage("❌ User already exists");
    }
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>

      <input name="name" placeholder="Full Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button onClick={registerUser}>Register</button>

      {message && <p>{message}</p>}
    </div>
  );
}
