import React, { Component } from "react";
import SpinningMusic from "../assets/compact-disc.svg";
import "../css/spinner.css";

class MuteButton extends Component {
  render() {
    if (this.props.playing === false) {
      return (
        <div onClick={this.props._toggleMuteButton}>
          <img
            className="music"
            src={SpinningMusic}
            alt="Music Logo"
            width="36"
            height="36"
          />
        </div>
      );
    }
    return (
      <div onClick={this.props._toggleMuteButton}>
        <img
          className="music music-spinner"
          src={SpinningMusic}
          alt="Music Logo"
          width="36"
          height="36"
        />
      </div>
    );
  }
}

export default MuteButton;
