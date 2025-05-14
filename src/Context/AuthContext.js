import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  let initialUser = null;

  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const parsed = JSON.parse(storedUser);
      initialUser = {
        token: parsed.token || '',
        userName: parsed.userName || '',
        email: parsed.email || '',
        role: parsed.role || 'user',
        profilePic: parsed.profilePic || '',
        createdAt: parsed.createdAt || '',
        lastLogin: parsed.lastLogin || '',
      };
    }
  } catch (error) {
    console.warn('Invalid user in localStorage:', error);
    localStorage.removeItem('user');
  }

  const [state, dispatch] = useReducer(authReducer, {
    user: initialUser,
  });

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        dispatch,
        setUser: (user) => dispatch({ type: 'LOGIN', payload: user })
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
