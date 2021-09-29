import React from 'react';
import {UserContext} from '../../contexts/UserContext';
import {user_config} from '../../configs/permission.config';
import './Auth.css';

const {roles} = user_config;

export const Auth = () => {
  const {setRole} = React.useContext(UserContext);
  const [token, setToken] = React.useState('');

  const onChangeAuth = (e) => {
    e.preventDefault();
    const token = e.target.value;
    setToken(token);
    if (!token) return;
    const role = roles[token];
    if (!role) return;
    window.location.hash = '/main';
    setToken('');
    setRole(role);
  };

  return (
    <div className="auth">
      <p className="text">Input secret token</p>
      <input className="token-input border" onChange={onChangeAuth} value={token}></input>
    </div>
  );
};
