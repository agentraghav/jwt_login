import React, { useContext } from 'react';

import { useHistory } from 'react-router-dom';

import UserContext from './userContext';

export default function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory();

  const login = () => history.push('/login');
  const register = () => history.push('/register');

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem('auth-token', '');
  };

  return (
    <nav className='auth-options'>
      {userData.user ? (
        <button className='btn btn-primary mr-2' onClick={logout}>
          Logout
        </button>
      ) : (
        <>
          <button className='btn btn-primary mr-2' onClick={register}>
            Sign Up
          </button>
          <button className='btn btn-primary mr-2' onClick={login}>
            Login
          </button>
        </>
      )}
    </nav>
  );
}
