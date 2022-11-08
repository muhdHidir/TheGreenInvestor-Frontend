import React, { useState, useEffect } from "react";
import CIcon from "@coreui/icons-react";
import { cilTranslate } from "@coreui/icons";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import "../css/barchart.css";
import "../css/navbar.css";
import LoginPopUp from "./LoginPopUp";
import myMusic from "../assets/music.mp3";
import MuteButton from "./MuteButton";

import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";
import { Box, Button, Grid, Group, Menu, Select, Text } from "@mantine/core";
import TranslatePopup from "./TranslatePopup/TranslatePopup";
import { registerables } from "chart.js";

export default function NavBar({ playing, setPlaying }) {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [translateOpen, setTranslateOpen] = useState(false);

  const [lang, setLang] = useState("");

  // This function put query that helps to
  // change the language
  const handleChange = (e) => {
    setLang(e.target.value);
    let loc = "https://api.thegreeninvestor.net:8080/";
    window.location.replace(loc + "?lng=" + e.target.value);
  };

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  // For music player, runs everytime 'playing' is changed

  function logOut() {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  }

  function _toggleMuteButton() {
    // var myAudio = document.getElementById("audio_player");
    // myAudio.muted = !myAudio.muted;
    setPlaying((s) => !s);
    // setPause(!playing);
  }
  const googleTranslateElementInit = () => {
    var duplicate_google_translate_counter = 0;
    if (duplicate_google_translate_counter === 0) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "ar,en,zh-TW,ms,es",
          autoDisplay: false,
        },

        "google_translate_element"
      );
    }
    duplicate_google_translate_counter++;
  };
  useEffect(() => {
    if (typeof Node === "function" && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function (child) {
        if (child.parentNode !== this) {
          if (console) {
            console.error(
              "Cannot remove a child from a different parent",
              child,
              this
            );
          }
          return child;
        }
        return originalRemoveChild.apply(this, arguments);
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function (newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (console) {
            console.error(
              "Cannot insert before a reference node from a different parent",
              referenceNode,
              this
            );
          }
          return newNode;
        }
        return originalInsertBefore.apply(this, arguments);
      };
    }
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  function handleClose() {
    setTranslateOpen(false);
  }

  console.log(playing);

  return (
    // Fixed size that NavBar will take up
    <>
      <TranslatePopup opened={translateOpen} handleClose={handleClose} />
      
      <Grid
        className="w-full z-20 pt-2 pr-4 pl-4 mx-0 mb-4 align-baseline notranslate "
        grow
        columns={24}
      >
        <Grid.Col className="pt-3" span={7}>
          <Group className="space-x-4" position="left">
            <Link
              to={"/home"}
              className="text-white font-serif text-xl z-20 hover:scale-110 "
            >
              Home
            </Link>
            <Link
              to={"/leaderboard"}
              className="text-white font-serif text-xl z-20 hover:scale-110  "
            >
              Leaderboard
            </Link>
            <div className="music-button hover:scale-110 cursor-pointer  w-[36px] z-20">
              <MuteButton
                playing={playing}
                _toggleMuteButton={_toggleMuteButton}
              />
            </div>
          </Group>
        </Grid.Col>
        {/* <Grid.Col span={1} /> */}
        <Grid.Col span={8} className="pt-3">
          <Group className="w-full" position="center">
            {/* <Text className="text-white text-lg z-24 navbar-title">
            The Green Investor
          </Text> */}

            <Text className="z-20 notranslate text-white  text-4xl font-['Playfair_Display_SC']">
              The Green Investor
            </Text>
          </Group>
        </Grid.Col>
        {/* <Grid.Col span={1} /> */}
        <Grid.Col span={7} className="pt-3">
          <Group className="w-full" spacing={2} position="right">
            <Button
              style={{ backgroundColor: "transparent" }}
              className="z-20"
              onClick={() => setTranslateOpen(true)}
            >
              <CIcon
                icon={cilTranslate}
                className="text-xs text-white w-6 h-6 hover:scale-110 hover:border-b-2 hover:border-white "
                size="custom"
                color="white"
              />
            </Button>
            {/* <div className="" id="google_translate_element" /> */}
            {/* when user is logged in */}
            {currentUser ? (
              <>
                <Link
                  to={"/profile"}
                  className="cursor-pointer text-white font-serif text-xl hover:scale-110  pl-4 pr-4 z-20 "
                >
                  {currentUser.username}
                </Link>

                <div className="cursor-pointer font-serif text-xl hover:scale-110 z-20 text-white">
                  <a href="/home" onClick={logOut}>
                    Log Out
                  </a>
                </div>
              </>
            ) : (
              // when user is not logged in
              <LoginPopUp
                class="notranslate"
                className="z-20 text-white font-serif text-xl hover:scale-110"
              />
            )}
          </Group>
        </Grid.Col>
      </Grid>
    </>
    // <div className="nav-container lg:h-20 fixed w-full text-white text-m grid grid-cols-12 z-20 my-auto py-auto">
    //   {/* <audio
    //     id="audio_player"
    //     autoPlay
    //     loop
    //     // controls
    //   >
    //     <source src={myMusic} type="audio/mp3" />
    //   </audio> */}

    //   {/* Home and Leaderboard, keep at leftmost except for mobile, which will be below title */}
    //   <div
    //     className="order-3 col-span-12 grid grid-cols-2
    //               lg:-order-1 lg:col-span-4
    //               text-md my-auto pt-2 lg:pt-0 pb-2 text-center"
    //   >
    //     <Group className="pl-4">
    //       <Link
    //         to={"/home"}
    //         className="notranslate col-span-2 no-translate lg:col-span-1 py-2 md:py-0 cursor-pointer hover:scale-110"
    //       >
    //         Home
    //       </Link>

    //       <Link
    //         to={"/leaderboard"}
    //         className="col-span-2  notranslate lg:col-span-1 py-2 md:py-0 cursor-pointer hover:scale-110"
    //       >
    //         Leaderboard
    //       </Link>
    //     </Group>

    //     {showModeratorBoard && (
    //       <Link to={"/mod"} className="cursor-pointer hover:scale-110">
    //         Moderator Board
    //       </Link>
    //     )}

    //     {showAdminBoard && (
    //       <Link to={"/admin"} className="cursor-pointer hover:scale-110">
    //         Admin Board
    //       </Link>
    //     )}
    //   </div>

    //   {/* Title, keep at Center, except mobile, which will be below lang/music */}
    //   <span
    //     className="navbar-title -order-1 col-span-12
    //               lg:py-4 lg:col-span-4 lg:order-4
    //               my-auto text-center  notranslate"
    //   >
    //     The Green Investor
    //   </span>

    //   {/* Lang & Music, keep at right, before login but at top for mobile */}
    //   {/* music button, ADD MUSIC LATER */}
    //   <div
    //     className="grid grid-cols-2
    //               -order-3 col-span-12
    //               lg:order-6 lg:col-span-2 xl:col-span-2
    //               my-auto pt-2 lg:pt-0 pb-2 text-center  notranslate
    //   "
    //   >
    //     {/* <div className="music-button hover:scale-110 m-auto cursor-pointer w-[36px]">
    //       <MuteButton playing={playing} _toggleMuteButton={_toggleMuteButton} />
    //     </div> */}
    //     <div className="" id="google_translate_element" />
    //   </div>

    //   {/* Login, keep at rightmost at all times */}
    //   {/* Log in, log out */}

    //   <div
    //     className="order-last col-span-12
    //               lg:col-span-2 w-auto
    //               my-auto text-center  notranslate"
    //   >
    //     {/* when user is logged in */}
    //     {currentUser ? (
    //       <div className="grid grid-cols-2">
    //         <Link
    //           to={"/profile"}
    //           className="cursor-pointer hover:scale-110 m-auto  notranslate"
    //         >
    //           {currentUser.username}
    //         </Link>
    //         <div className="cursor-pointer hover:scale-110 m-auto  notranslate ">
    //           <a href="/home" onClick={logOut}>
    //             Log Out
    //           </a>
    //         </div>
    //       </div>
    //     ) : (
    //       // when user is not logged in
    //       <LoginPopUp class="notranslate " />
    //     )}
    //   </div>
    // </div>
  );
}
