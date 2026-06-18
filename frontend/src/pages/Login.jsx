// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/auth/login", { email, password });
//       localStorage.setItem("token", res.data.token); // Store token
//       navigate("/");
//     } catch (err) {
//       alert("Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
//       <form onSubmit={handleLogin} className="bg-[#0F1422] p-8 rounded-2xl border border-[#1E2640] w-96">
//         <h2 className="text-2xl font-bold mb-6">Login to Relay</h2>
//         <input type="email" placeholder="Email" className="w-full bg-[#131926] p-3 rounded-xl mb-4 border border-[#222C44]" onChange={(e) => setEmail(e.target.value)} />
//         <input type="password" placeholder="Password" className="w-full bg-[#131926] p-3 rounded-xl mb-6 border border-[#222C44]" onChange={(e) => setPassword(e.target.value)} />
//         <button className="w-full bg-[#10B981] p-3 rounded-xl font-bold">Sign In</button>
//       </form>
//     </div>
//   );
// }



import { useState, useContext } from "react"; // 1. Add useContext here
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext"; // 2. Import your AuthContext

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  // 3. Destructure setUser from the context
  const { setUser } = useContext(AuthContext); 

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/auth/login", { email, password });
      
//       // Assuming your backend returns { token: "...", user: { name: "MK", ... } }
//       localStorage.setItem("token", res.data.token); 
      
//       // 4. Update the global state
//       const userData = res.data.user;
//       localStorage.setItem("user", JSON.stringify(userData)); // Persist locally
//       setUser(userData); // This triggers the UI refresh across the app
      
//       navigate("/");
//     } catch (err) {
//       console.error("Login failed:", err);
//       alert("Login failed");
//     }
//   };











// const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await API.post("/auth/login", { email, password });
    
//     // Store token for API requests
//     localStorage.setItem("token", res.data.token);
    
//     // Store user object (ensure backend returns { name: "..." })
//     const userData = res.data.user; 
//     localStorage.setItem("user", JSON.stringify(userData));
    
//     setUser(userData); // Update context
//     navigate("/");
//   } catch (err) {
//     alert("Login failed");
//   }
// };








const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", { email, password });
    
    // DEBUG: Print exactly what comes from the backend
    console.log("Full Backend Response:", res.data);

    // If your response looks like { token: "...", user: { name: "..." } }
    // use res.data.user. If it's just { name: "..." }, use res.data
    const userData = res.data.user || res.data; 




    // localStorage.clear();
    // localStorage.setItem("token", res.data.token);
    // localStorage.setItem("user", JSON.stringify(userData));
    
    // setUser(userData); 
    // navigate("/");


    localStorage.setItem("token", res.data.token);

localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

setUser(res.data.user);

navigate("/");






  } catch (err) {
    alert("Login failed");
  }
};



  return (
    // ... your existing JSX remains the same
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
      <form onSubmit={handleLogin} className="bg-[#0F1422] p-8 rounded-2xl border border-[#1E2640] w-96">
        <h2 className="text-2xl font-bold mb-6">Login to Relay</h2>
        <input type="email" placeholder="Email" className="w-full bg-[#131926] p-3 rounded-xl mb-4 border border-[#222C44]" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full bg-[#131926] p-3 rounded-xl mb-6 border border-[#222C44]" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-[#10B981] p-3 rounded-xl font-bold">Sign In</button>
        <div className="text-center mt-5">
  <span className="text-slate-400">
    New user?
  </span>

  <button
    type="button"
    onClick={() => navigate("/register")}
    className="ml-2 text-cyan-400 hover:text-cyan-300 font-semibold"
  >
    Sign Up
  </button>
</div>
      </form>
    </div>
  );
}