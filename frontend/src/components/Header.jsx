





// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// export default function Header() {
//   const { user } = useContext(AuthContext);
// console.log("Header User State:", user);
//   // Improved logic to get initials
//   const getInitials = (name) => {
//     if (!name) return "U"; // Default to 'U' for User if no name exists
    
//     // Split by space for multi-word names, OR take first letter if single word
//     const names = name.trim().split(' ');
    
//     if (names.length > 1) {
//       // Get first letter of first two words
//       return (names[0][0] + names[1][0]).toUpperCase();
//     } else {
//       // Single word name (e.g., Srividhyachimirala) -> Get first letter
//       return names[0].charAt(0).toUpperCase();
//     }
//   };

//   return (
//     <div className="flex items-center gap-4">
//       {user ? (
//         <div className="avatar bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
//           {/* Use the new logic */}
//           {getInitials(user.name)}
//         </div>
//       ) : (
//         <button onClick={() => window.location.href = '/login'}>Login</button>
//       )}
//     </div>
//   );
// }



import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user } = useContext(AuthContext);

  // DEBUG: Check what the Header actually receives
  console.log("Header user data:", user);

  // Define the robust initials logic here
  const getInitials = (name) => {
    if (!name || name === "Unknown") return "U";
    
    // Splits the name by spaces, takes the first letter of each part,
    // joins them, and converts to uppercase
    return name
      .trim()
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2); // Ensures we get a maximum of 2 letters (e.g., "SC")
  };

  // Determine the name to pass to the function
  const userName = user?.name || user?.username || "";

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="avatar bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
          {/* This will now display initials like "SC" for Srividhya Chimirala */}
          {getInitials(userName)}
        </div>
      ) : (
        <button onClick={() => window.location.href = '/login'}>Login</button>
      )}
    </div>
  );
}