import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  // Example: Check if a user token exists in local storage
  const userToken = localStorage.getItem('token');

  if (userToken) {
    try {
      const decoded = jwtDecode(userToken);
      const currentTime = Date.now() / 1000; // get current time in seconds
      
      // Check if the token is still valid
      if(decoded && decoded.exp) {
        if (decoded.exp < currentTime) {
          // Token has expired
          
          localStorage.clear(); // Optionally clear token from storage
          window.location.href = '/login';
          return false;
        }
      }
      else 
        return false;
      
      return true; // Token is valid
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
  
  return !!userToken; // returns true if token exists, false otherwise
};