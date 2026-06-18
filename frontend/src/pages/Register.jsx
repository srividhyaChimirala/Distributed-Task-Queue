// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function Register() {
//   // Use a single object for state to manage all inputs cleanly
//   const [formData, setFormData] = useState({ 
//     name: "", 
//     email: "", 
//     password: "" 
//   });
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       // Sends the { name, email, password } object to your backend
//       await API.post("/auth/register", formData);
      
//       alert("Registration successful! You can now login.");
//       navigate("/login"); 
//     } catch (err) {
//       console.error("Registration Error:", err);
//       alert(err.response?.data?.message || "Registration failed. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
//       <form onSubmit={handleRegister} className="bg-[#0F1422] p-8 rounded-2xl border border-[#1E2640] w-96">
//         <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        
//         <input 
//           type="text" 
//           placeholder="Full Name" 
//           required
//           className="w-full bg-[#131926] p-3 rounded-xl mb-4 border border-[#222C44]" 
//           onChange={(e) => setFormData({...formData, name: e.target.value})} 
//         />
//         <input 
//           type="email" 
//           placeholder="Email" 
//           required
//           className="w-full bg-[#131926] p-3 rounded-xl mb-4 border border-[#222C44]" 
//           onChange={(e) => setFormData({...formData, email: e.target.value})} 
//         />
//         <input 
//           type="password" 
//           placeholder="Password" 
//           required
//           className="w-full bg-[#131926] p-3 rounded-xl mb-6 border border-[#222C44]" 
//           onChange={(e) => setFormData({...formData, password: e.target.value})} 
//         />
        
//         <button type="submit" className="w-full bg-[#10B981] p-3 rounded-xl font-bold">Register</button>
//       </form>
//     </div>
//   );
// }




import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { UserPlus } from "lucide-react";

export default function Register() {
const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
});

const navigate = useNavigate();

const handleRegister = async (e) => {
e.preventDefault();


try {
  await API.post("/auth/register", formData);

  alert("Account created successfully!");
  navigate("/login");
}
// catch (err) {
//   console.error(err);
//   alert(
//     err.response?.data?.message ||
//     "Registration failed"
//   );
// }

catch (err) {
  console.error(err);
  console.log("Backend Error:", err.response?.data);

  alert(
    err.response?.data?.error ||
    "Registration failed"
  );
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4"> <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl">


  <div className="flex justify-center mb-6">
  <div className="w-16 h-16 rounded-2xl bg-[#020617] flex items-center justify-center shadow-xl">
    <UserPlus size={28} className="text-white" />
  </div>
</div>

    <h1 className="text-4xl font-bold text-center text-white mb-2">
      Create Account
    </h1>

    <p className="text-slate-400 text-center mb-8">
      Enter your credentials to access your account
    </p>

    <form onSubmit={handleRegister}>
      <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
        Name
      </label>

      <input
        type="text"
        placeholder="Enter your name"
        required
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
        className="w-full bg-[#111827] border border-slate-700 rounded-xl px-4 py-4 text-white mb-5 focus:outline-none focus:border-cyan-500"
      />

      <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
        Email
      </label>

      <input
        type="email"
        placeholder="name@mail.com"
        required
        value={formData.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value,
          })
        }
        className="w-full bg-[#111827] border border-slate-700 rounded-xl px-4 py-4 text-white mb-5 focus:outline-none focus:border-cyan-500"
      />

      <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
        Password
      </label>

      <input
        type="password"
        placeholder="********"
        required
        value={formData.password}
        onChange={(e) =>
          setFormData({
            ...formData,
            password: e.target.value,
          })
        }
        className="w-full bg-[#111827] border border-slate-700 rounded-xl px-4 py-4 text-white mb-6 focus:outline-none focus:border-cyan-500"
      />

      <button
        type="submit"
        className="w-full bg-[#10B981] hover:bg-[#10B981] text-black font-bold py-4 rounded-xl transition"
      >
        Sign Up
      </button>
    </form>

    <div className="text-center mt-6">
      <span className="text-slate-400">
        Already a user?
      </span>

      <Link
        to="/login"
        className="ml-2 text-cyan-400 hover:text-cyan-300 font-semibold"
      >
        Login
      </Link>
    </div>
  </div>
</div>


);
}
