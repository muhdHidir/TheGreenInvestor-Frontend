import React, { Component } from "react";
import { motion } from "framer-motion";

import { variants } from "../assets/Animations";
import thegreeninvestor from "../assets/thegreeninvestor.png";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   content: ""
      // data: []
    };
  }

  componentDidMount() {
    // GameService.getGameContent().then(
    //   response => {
    //     this.setState({
    //       data: response.data
    //     });
    //   },
    //   error => {
    //     this.setState({
    //       content:
    //         (error.response && error.response.data) ||
    //         error.message ||
    //         error.toString()
    //     });
    //   }
    // );
  }

  render() {
    return (
      <motion.div
        initial="hidden_ease"
        animate="visible_ease"
        exit="hidden_ease"
        variants={variants}
      >
        <img src={thegreeninvestor} alt="thegreeninvestorlogo" />
        <div className="RectangleQuestions center">
          <div className="q-container">
            <div className="quodrant1">
              <h1 className="text-center">Game Win</h1>
              <p className="text-center">Placeholder</p>
            </div>
            <div className="quodrant2">
              <h2 className="text-center">Placeholder for more text here</h2>
            </div>
            <div className="quodrant3">
              <p className="text-center">Placeholder for more text here</p>
            </div>
            <div className="quodrant4">
              <div className="barcontainer">
                <div
                  className="bar"
                  style={{ height: "75%", background: "#EA6042" }}
                >
                  75%
                </div>
                <div
                  className="bar"
                  style={{ height: "25%", background: "#86E577" }}
                >
                  25%
                </div>
                <div
                  className="bar"
                  style={{ height: "50%", background: "#ECF029" }}
                >
                  50%
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
}
