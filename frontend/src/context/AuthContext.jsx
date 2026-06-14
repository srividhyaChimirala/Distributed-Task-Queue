// import { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Load user from localStorage on app start
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) setUser(JSON.parse(savedUser));
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Re-hydrate state from localStorage on page load
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};