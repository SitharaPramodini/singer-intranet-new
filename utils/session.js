// utils/session.js
export const checkSession = async () => {
  const session = JSON.parse(localStorage.getItem('userSession'));
  if (!session || !session.sessionID) return false;

  try {
    const response = await fetch('http://localhost:3000/api/login/check-session', {
      method: 'GET',
      credentials: 'include', // important to send cookie
    });

    if (response.ok) {
      const data = await response.json();
      return data.valid; // true if session valid
    } else {
      return false;
    }
  } catch (err) {
    console.error('Session check error:', err);
    return false;
  }
};
