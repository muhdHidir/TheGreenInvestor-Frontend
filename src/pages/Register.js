import React, { Component, useState, useRef, useCallback } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { motion } from "framer-motion";

import AuthService from "../services/auth.service";

import { withRouter } from "../common/with-router";

const variants = {
  hidden: {
    opacity: "0%,",
  },
  visible: {
    opacity: "100%",
    transition: {
      when: "afterChildren",
      staggerChildren: 0.5,
      type: "spring",
      duration: 1.5,
    },
  },
};

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};


const Register = props => {

  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();
  const [successful, setSuccessful] = useState();

  const form = useRef();
  const checkBtn = useRef();

  function onChangeUsername(e) {
    setUsername(e.target.value);
  }

  function onChangeEmail(e) {
    setEmail(e.target.value);
  }

  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password, "USER").then(response => {
        setMessage(response.data.message);
        setSuccessful(true);
      }, error => {
        const resMessage = error.response && error.response.data && error.response.data.message || error.message || error.toString();
        setSuccessful(false);
        setMessage(resMessage);
      });
    } //wait one second


    await new Promise(r => setTimeout(r, 1000));
    AuthService.login(username, password).then(async () => {
      /* not a good way of implementing here, reimplement smoother*/
      props.router.navigate("/home"); //refresh

      window.location.reload();
    }, error => {
      const resMessage = error.response && error.response.data && error.response.data.message || error.message || error.toString();
    });
  });
  return <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} className="col-md-12">
    <div className="card card-container">
      <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />

      <Form onSubmit={handleRegister} ref={c => {
        form.current = c;
      }}>
        {!successful && <div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Input type="text" className="form-control" name="username" value={username} onChange={onChangeUsername} validations={[required, vusername]} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input type="text" className="form-control" name="email" value={email} onChange={onChangeEmail} validations={[required, email]} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input type="password" className="form-control" name="password" value={password} onChange={onChangePassword} validations={[required, vpassword]} />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block">Sign Up</button>
          </div>
        </div>}

        {message && <div className="form-group">
          <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
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

export default withRouter(Register);