import React, { useContext, useState } from 'react';

import { useHistory } from 'react-router-dom';

import axios from 'axios';

import UserContext from './userContext';

import ErrorNotice from './error-notice';

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const history = useHistory();
  const { setUserData } = useContext(UserContext);

  const submit = async (e) => {
    e.prevent.default();
    try {
      const loginUser = { email, password };
      const loginResponse = await axios.post(
        'http://localhost:5000/users/login',
        loginUser
      );
      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
      });
      localStorage.setItem('auth-token', loginResponse.data.token);
      history.push('/');
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className='login'>
      <h2>Login</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form onSubmit={submit}>
        <label>Email: </label>
        <input
          type='email'
          id='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password: </label>
        <input
          type='password'
          id='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type='submit' value='Login' className='btn btn-primary' />
      </form>
    </div>
  );
}
