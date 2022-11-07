import React from "react";
import Popup from "reactjs-popup";
import "../index.css";
import { Button } from "@mantine/core";
import { motion } from "framer-motion";

import { variants } from "../assets/Animations";

import Login from "./Login";
import Login2 from "./Login2";

const LoginPopUp = () => (
  <Popup
    trigger={
      <Button
        compact
        color="teal"
        className="cursor-pointer font-normal font-serif text-xl hover:scale-110 mx-auto z-20 text-white"
      >
        Login
      </Button>
    }
    modal
    nested
  >
    {(close) => (
      <div className="login-modal">
        {/* <button className="close" onClick={close}>
          &times;
        </button> */}
        <motion.div
          initial="hidden_ease"
          animate="visible_ease"
          exit="hidden_ease"
          variants={variants}
          className="col-md-12"
        >
          <Login2 onClick={close} />
        </motion.div>
      </div>
    )}
  </Popup>
);

export default LoginPopUp;
