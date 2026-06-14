import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  // Use a single object for state to manage all inputs cleanly
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Sends the { name, email, password } object to your backend
      await API.post("/auth/register", formData);
      
      alert("Registration successful! You can now login.");
      navigate("/login"); 
    } catch (err) {
      console.error("Registration Error:", err);
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
      <form onSubmit={handleRegister} className="bg-[#0F1422] p-8 rounded-2xl border border-[#1E2640] w-96">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        
        <input 
          type="text" 
          placeholder="Full Name" 
          required
          className="w-full bg-[#131926] p-3 rounded-xl mb-4 border border-[#222C44]" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          required
          className="w-full bg-[#131926] p-3 rounded-xl mb-4 border border-[#222C44]" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          required
          className="w-full bg-[#131926] p-3 rounded-xl mb-6 border border-[#222C44]" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        
        <button type="submit" className="w-full bg-[#10B981] p-3 rounded-xl font-bold">Register</button>
      </form>
    </div>
  );
}