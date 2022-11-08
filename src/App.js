import React, { useEffect, useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import "./App.css";
import BoardAdmin from "./components/BoardAdmin";
import NavBar from "./components/NavBar";
import Game from "./pages/Game";
import GameOver from "./pages/GameOver";
import GameWin from "./pages/GameWin";
import Leaderboard from "./pages/Leaderboard";
import myMusic from "./assets/music.mp3";

import Login from "./components/Login";

// import backgroundVideo from "./assets/forestbg.mp4";

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import GameService from "./services/GameService";

function App() {
  const [currentState, setCurrentState] = useState("");
  const [playing, setPlaying] = useState(false);
  const player = new Audio(myMusic);

  function playAudio(id) {
    document.getElementById(id).play();
  }
  function pauseAudio(id) {
    document.getElementById(id).pause();
  }

  useEffect(() => {
    playing ? playAudio("audio_player") : pauseAudio("audio_player");
    console.log("lalala");
    return () => player.pause();

    // This is cleanup of the effect
  }, [playing]);
  console.log(playing);
  useEffect(() => {
    async function getCurrentState() {
      const gameStateResponse = GameService.getGameState();
      if (gameStateResponse !== undefined) {
        gameStateResponse
          .then(async (response) => {
            await setCurrentState(response.data.state);
          })
          .catch((error) => console.log(error.response));
      }
    }
    getCurrentState();
  }, []);

  return (
    <div className="main scrollbar-hide overflow-auto">
      <audio id="audio_player" loop>
        <source src={myMusic} type="audio/mp3" />
      </audio>
      <video
        src="https://tgi-bucket.s3.ap-southeast-1.amazonaws.com/bg_vid.mp4"
        type="video/mp4"
        autoPlay
        loop
        muted
        className="fixed bg-video"
      />
      <NavBar playing={playing} setPlaying={setPlaying} />
      <div>
        <div className=" content pl-4 pr-4 h-full">
          <div className="scrollbar-hide overflow-auto">
            <ParallaxProvider>
              <Routes>
                {currentState === "answering" ? (
                  <Route path="/" element={<Game />} />
                ) : (
                  <Route path="/" element={<Home />} />
                )}
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/user" element={<BoardUser />} />
                <Route path="/mod" element={<BoardModerator />} />
                <Route path="/admin" element={<BoardAdmin />} />
                <Route path="/game" element={<Game />} />
                <Route path="/gameover" element={<GameOver />} />
                <Route path="/gamewin" element={<GameWin />} />
              </Routes>
            </ParallaxProvider>
          </div>
        </div>
        <div className=" flex justify-center items-center">
          <Routes>
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        {/* <AuthVerify logOut={this.logOut}/> */}
      </div>
    </div>
  );
}

export default App;
