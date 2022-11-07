import React, { useEffect, useState } from "react";
import { Link, Route, Router, useNavigate } from "react-router-dom";
import { Box, Button, Stack } from "@mantine/core";
import { Tabs } from "@mantine/core";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Parallax } from "react-scroll-parallax";

import UserService from "../services/user.service";
import { displayContent } from "../assets/LandingPageDisplayContent";

import authService from "../services/auth.service";

import "../css/home.css";
import { ScrollTip } from "../assets/images";

import { variants } from "../assets/Animations";
import { PrevIcon } from "../icons";

import ImportanceSustain from "../components/SustainabilityImportance/ImportanceSustain";
import GameService from "../services/GameService";

export default function Home() {
  const [content, setContent] = useState("");

  const [activeTab, setActiveTab] = useState("first");

  const [currentUser, setCurrentUser] = useState(undefined);

  const { t } = useTranslation();

  let navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    const getPublicContent = async () => {
      try {
        const res = await UserService.getPublicContent();
        setContent(res.data);
      } catch (error) {
        setContent(
          (error.response && error.response.data) ||
            error.message ||
            error.toString()
        );
      }
    };
    getPublicContent();
  }, []);

  const tabValues = ["first", "second", "third", "forth"];
  const subheaders = [
    "Introduction",
    "What is Sustainability?",
    "Importance of Sustainability",
    "How to Play?",
  ];

  function handleNextClick() {
    let oldIndex = tabValues.indexOf(activeTab);
    setActiveTab(tabValues[++oldIndex]);
  }
  function handlePrvClick() {
    let oldIndex = tabValues.indexOf(activeTab);
    setActiveTab(tabValues[--oldIndex]);
  }

  function makeid(length) {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async function signUpAsGuest() {
    var username = "Guest" + makeid(5);
    var email = username + "@thegreeninvestor.com";
    var password = "123456";
    authService.register(username, email, password, "GUEST").then();
    await new Promise((r) => setTimeout(r, 1000));
    authService.login(username, password).then(() => {
      navigate("/game");
      window.location.reload();
    });
  }

  return (
    <div className="pl-4 pr-4 text-center">
      <div className="container-content">
        <Parallax className="screen1 flex flex-col justify-between items-center">
          <span />
          <h1 className="center text-white bounce title mt-10 self-center shadow-xl border-t-4 border-b-4 ">
            Welcome to the Sustainability Game
          </h1>

          <div className="scrollTip flex-end mb-10 ">
            <img
              src={ScrollTip}
              className="scrollTip w-10 px-1 border-x-2"
              alt="Scroll"
            />
          </div>
        </Parallax>

        <div className="screen2 h-screen grid grid-rows-3">
          {/* <div className="text-container grid grid-rows-3 h-full"> */}
          <Stack className="row-start-2">
            <Box className=" text-white bg-black bg-opacity-50 font-serif text-3xl p-4 rounded-3xl w-1/2 self-center">
              {subheaders[0]}
            </Box>
            <Box className="text-white text-white bg-black bg-opacity-70 p-4 rounded-3xl text-xl font-serif w-full">
              {displayContent[0].src}
            </Box>
          </Stack>
        </div>
        <div className="screen3 h-screen grid grid-rows-3">
          <Stack className="row-start-2">
            <Box className="text-white bg-black bg-opacity-50 font-serif text-3xl p-4 rounded-3xl w-1/2 self-center">
              {subheaders[1]}
            </Box>
            <Box className="text-white bg-black bg-opacity-70 p-4 rounded-3xl text-xl font-serif w-full">
              {displayContent[1].src}
            </Box>
          </Stack>
        </div>
        <div className="screen4 h-screen items-center grid grid-rows-3">
          <Stack className="row-start-2">
            <Box className="text-white bg-black bg-opacity-50 font-serif text-3xl p-4 rounded-3xl w-1/2 self-center">
              {subheaders[2]}
            </Box>
            <Box className="text-white bg-black bg-opacity-70 p-2 rounded-3xl w-full">
              <ImportanceSustain />
            </Box>
          </Stack>
        </div>
        <div className="screen5 h-screen items-center grid grid-rows-3">
          <Stack className="row-start-2">
            <Box className="text-white bg-black bg-opacity-50 font-serif text-3xl p-4 rounded-3xl w-1/2 self-center">
              {subheaders[3]}
            </Box>
            <Box className="text-white bg-black bg-opacity-70 p-4 rounded-3xl text-xl font-serif w-full">
              {displayContent[3].src}
            </Box>

            {currentUser ? (
              <Link to="/game" className="">
                <Button
                  size="lg"
                  className=" text-white border-white self-center font-serif w-1/3 rounded-full font-extrabold text-xl mt-auto bg-darkGreen-50 "
                >
                  {t("home-button-playgame")}
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={signUpAsGuest}
                className=" text-white border-white self-center font-serif w-1/3 rounded-full font-extrabold text-xl mt-auto bg-darkGreen-50 "
              >
                {t("home-button-playguest")}
              </Button>
            )}
          </Stack>
        </div>
      </div>
    </div>
  );
}
