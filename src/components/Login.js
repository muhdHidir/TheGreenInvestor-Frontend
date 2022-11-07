import React, { Component, useState, useRef, useCallback } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { motion } from "framer-motion";

import { variants } from "../assets/Animations";
import AuthService from "../services/auth.service";

import { withRouter } from "../common/with-router";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = props => {

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState();

  const form = useRef();
  const checkBtn = useRef();

  const onChangeUsername = useCallback((e) => {
    setUsername(e.target.value);
  });

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  });

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(() => {
        props.router.navigate("/profile");
        window.location.reload();
      }, error => {
        const resMessage = error.response && error.response.data && error.response.data.message || error.message || error.toString();
        setLoading(false);
        setMessage(resMessage);
      });
    } else {
      setLoading(false);
    }
  });

  return <motion.div initial="hidden_ease" animate="visible_ease" exit="hidden_ease" variants={variants} className="col-md-12">
    <div className="components-common-assets-LoginPopup">
      <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />

      <Form onSubmit={handleLogin} ref={c => {
        form.current = c;
      }}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <Input type="text" className="form-control" name="username" value={username} onChange={onChangeUsername} validations={[required]} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <Input type="password" className="form-control" name="password" value={password} onChange={onChangePassword} validations={[required]} />
        </div>

        <div className="form-group">
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm"></span>}
            <span>Login</span>
          </button>
        </div>

        {message && <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>}
        <CheckButton style={{
          display: "none"
        }} ref={c => {
          checkBtn.current = c;
        }} />
      </Form>
    </div>
  </motion.div>;
};

export default withRouter(Login);
