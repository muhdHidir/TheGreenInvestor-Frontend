import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { variants } from "../assets/Animations";

import DataMetric from "../components/DataMetric/DataMetric";
import { CashIcon, MoraleIcon, SustainabilityIcon } from "../icons";
import {
  Box,
  Grid,
  Text,
  Button,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { Input } from "@mantine/core";

import authHeader from "../services/auth-header";

import axios from "axios";
import ReviewModal from "../components/PostQuestionReview/ReviewModal";
import GameEndPopup from "../components/GameEnd/GameEndPopup";
import GameService from "../services/GameService";

export default function Game() {
  const [data, setData] = useState([]);
  const [listQuestions, setListQuestions] = useState();
  const [options, setOptions] = useState();
  const [image, setImage] = useState();

  const [isOpenEnded, setIsOpenEnded] = useState(false);

  const [responseStats, setResponseStats] = useState(null);
  const [responseFeedback, setResponseFeedback] = useState("");
  const [article, setArticle] = useState();
  const [multiplier, setMultiplier] = useState();

  const [currentYear, setCurrentYear] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState();

  //income statistic
  const [currentIncome, setCurrentIncome] = useState(null);
  const [currentMorale, setCurrentMorale] = useState(null);
  const [currentSustainability, setCurrentSustainability] = useState(null);

  //input values for open-ended questions
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");

  //used for the highlighting of the selected option
  const [selectedOption, setSelectedOption] = useState(null);

  //Statistics Data State to update Graphs
  const [moraleChartData, setMoraleChartData] = useState([65]);
  const [sustainabilityChartData, setSustainabilityChartData] = useState([150]);
  const [cashChartData, setCashChartData] = useState();

  //for Review modal
  const [openReview, setOpenReview] = useState(false);

  //for End Game modal
  const [openEndGame, setOpenEndGame] = useState({
    failed: false,
    opening: false,
  });

  //handle Closing of the ReviewModal
  console.log(responseFeedback);
  console.log(responseStats);
  async function closeReviewHandler() {
    const changeQuestion = listQuestions[currentYear + 1];
    setOpenReview(false);
    setCurrentYear(currentYear + 1);

    //set questions to the next one when closing the reviewHandler
    if (changeQuestion !== undefined) {
      setCurrentQuestion(changeQuestion);

      setImage(changeQuestion.imagePath);

      setOptions(changeQuestion.optionsName);
      setIsOpenEnded(changeQuestion.openEnded);
    }
    // setResponseFeedback(null);
    // setResponseStats(null);
  }

  //handle closing of end game handler
  function closeEndGameHandler() {
    setOpenEndGame({ failed: false, opening: false });
  }

  useEffect(() => {
    if (cashChartData !== undefined && responseStats !== null) {
      if (
        responseStats?.currentSustainabilityVal < 0 ||
        responseStats?.currentMoraleVal < 0 ||
        cashChartData[cashChartData?.length - 1] < 0
      ) {
        setOpenEndGame({ failed: true, opening: true });
      } else if (currentYear > 9) {
        setOpenEndGame({ failed: false, opening: true });
      }
    }
  }, [
    responseStats?.currentSustainabilityVal,
    responseStats?.currentMoraleVal,
    cashChartData,
    currentYear,
  ]);

  //function called when the submit button is clicked (to transition the question and options and charts)
  async function onClickHandler() {
    //submit Answer to backend
    submitAnswer();

    setOpenReview(true);
  }

  //function to change chart data upon submitting a response
  useEffect(() => {
    async function changeChartData() {
      if (responseStats !== null) {
        setMoraleChartData([
          moraleChartData[0] + responseStats.changeInMoraleVal,
        ]);
        setSustainabilityChartData([
          sustainabilityChartData[0] + responseStats.changeInSustainabilityVal,
        ]);
        setCashChartData((prevState) => [
          ...prevState,
          cashChartData[cashChartData.length - 1] -
            responseStats.changeInCashVal +
            +currentIncome,
        ]);
      }
    }
    changeChartData();
  }, [responseStats]);

  //function to submit Answer to backend
  async function submitAnswer() {
    //open ended answer submission
    if (isOpenEnded) {
      await axios
        .post(
          `https://api.thegreeninvestor.net:8080/api/submitAnswer`,
          {
            //concatenate input1, input2 and input3 by comma
            answer: inputValue1 + "," + inputValue2 + "," + inputValue3,
            // isOpenEnded: true,
          },
          {
            headers: authHeader(),
            "Content-Type": "application/json",
          }
        )
        .then((response) => {
          console.log(response);
          setResponseFeedback(null);
          setResponseStats(null);
          setResponseStats(response.data);
          setResponseFeedback(response.data.feedback);
          setCurrentIncome(response.data.currentIncomeVal);
          setArticle(response.data.article);
          setMultiplier(response.data.multiplier);
        });

      //reset the input values
      setInputValue1("");
      setInputValue2("");
      setInputValue3("");
    } else {
      console.log(selectedOption);
      //multi select options
      await axios
        .post(
          `https://api.thegreeninvestor.net:8080/api/submitAnswer`,
          {
            answer: selectedOption,
          },
          {
            headers: authHeader(),
            "Content-Type": "application/json",
          }
        )
        .then((response) => {
          console.log(response);
          setResponseFeedback(null);
          setResponseStats(null);
          setResponseStats(response.data);
          setResponseFeedback(response.data.feedback);
          setCurrentIncome(response.data.currentIncomeVal);
          setArticle(response.data.article);
        });

      //reset the input values
      setSelectedOption(null);
    }
  }

  function generateCashData(costStats) {
    let result = [0, 100];
    let sum = 20;
    if (costStats != null) {
      for (let i = 0; i < costStats.length - 1; i++) {
        sum += costStats[i].changeInIncomeVal;
        result.push(
          result[result.length - 1] - costStats[i].changeInCashVal + sum
        );
      }
    }

    setCashChartData(result);
  }

  //function to set all the data before starting the game

  async function settingAllData(response) {
    const gameStateData = response.data;
    const questionRetrieved =
      gameStateData.questionsAndOptions[gameStateData.year];

    await setData(gameStateData);
    await setCurrentYear(gameStateData.year);
    await setListQuestions(gameStateData.questionsAndOptions);
    await setCurrentQuestion(questionRetrieved);
    await setImage(questionRetrieved.imagePath);

    const currentStats = gameStateData.stats;
    console.log(currentStats[currentStats.length - 1].currentSustainabilityVal);

    if (currentStats !== null && currentStats.length !== 1) {
      console.log("lalala");
      await setCurrentMorale(
        currentStats[currentStats.length - 1].currentMoraleVal
      );
      await setCurrentSustainability(
        currentStats[currentStats.length - 1].currentSustainabilityVal
      );
    } else {
      await setCurrentMorale(
        currentStats !== null ? currentStats[0].currentMoraleVal : 65
      );
      await setCurrentSustainability(
        currentStats !== null ? currentStats[0].currentSustainabilityVal : 150
      );
    }

    await setOptions(questionRetrieved.optionsName);
    await setIsOpenEnded(questionRetrieved.openEnded);

    await generateCashData(gameStateData.stats);
  }

  //to retrieve data from the backend regarding questions and stats using the api call
  useEffect(() => {
    async function getStateAndQuestionData() {
      await GameService.getGameState()
        .then(async (response) => {
          if (
            response.data.state === "start" ||
            response.data.state === "completed"
          ) {
            await GameService.postStartGame().then(async () => {
              await GameService.getGameState().then((response) => {
                settingAllData(response);
              });
            });
          } else {
            //this is for "answering" state
            settingAllData(response);
          }
        })
        .catch((error) => console.log(error));
    }
    getStateAndQuestionData();
  }, []);

  // prevent running into an not found error causing the app to crash

  console.log(currentMorale);
  if (
    data === undefined ||
    currentQuestion === undefined ||
    options === undefined ||
    currentYear === undefined ||
    cashChartData === undefined ||
    currentSustainability === null
  ) {
    return (
      <Box className="bg-gray-50 bg-opacity-70 h-[85vh] rounded-xl align-middle relative w-full pt-2 pr-2 pl-2 pb-2">
        <LoadingOverlay
          loaderProps={{ size: "xl", color: "black" }}
          overlayOpacity={0.0}
          overlayColor="#c5c5c5"
          visible
        />
      </Box>
    );
  }

  console.log(currentMorale);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
    >
      <ReviewModal
        content={responseFeedback}
        cash={responseStats && -responseStats.changeInCashVal}
        morale={responseStats && responseStats.changeInMoraleVal}
        sustainability={
          responseStats && responseStats.changeInSustainabilityVal
        }
        opened={openReview}
        setResponseStats={setResponseStats}
        setResponseFeedback={setResponseFeedback}
        responseStats={responseStats}
        responseFeedback={responseFeedback}
        openEnded={isOpenEnded}
        multiplier={multiplier}
        article={article}
        handleClose={closeReviewHandler}
      />
      <GameEndPopup
        failed={openEndGame.failed}
        opened={openEndGame.opening}
        handleClose={closeEndGameHandler}
        userName={"Bob"}
        finalCash={cashChartData && cashChartData[cashChartData.length - 1]}
        finalMorale={
          responseStats ? responseStats.currentMoraleVal : currentMorale
        }
        finalSustainability={
          responseStats
            ? responseStats.currentSustainabilityVal
            : currentSustainability
        }
      />
      <Box className="bg-gray-50 bg-opacity-70 h-[85vh] rounded-xl align-middle w-full pt-2 pr-2 pl-2 ">
        <Grid className="h-full w-full">
          <Grid.Col span={7} className="h-full">
            <Box className="h-[55%] w-full flex flex-col items-center space-y-4">
              <Text className="text-center font-semibold text-xl">
                {currentQuestion.questionName}
              </Text>
              <img
                className="h-[55%] w-[35%] text-center rounded-2xl drop-shadow-xl -pt-4"
                src={image}
                alt="new"
              />
            </Box>
            {!isOpenEnded ? (
              <Box
                size="md"
                className="h-[45%] w-full flex flex-col items-center space-y-2"
              >
                <Button
                  onClick={() => setSelectedOption(0)}
                  size="md"
                  className={
                    selectedOption === 0
                      ? "w-[80%] h-full opacity-80 bg-darkGreen-50 text-white"
                      : " w-[80%] h-full opacity-80 bg-gray-50 text-black"
                  }
                  styles={(theme) => ({
                    root: {
                      "&:hover": {
                        backgroundColor: theme.fn.darken("#245A44", 0.05),
                      },
                    },
                  })}
                >
                  {options[0]}
                </Button>
                <Button
                  onClick={() => setSelectedOption(1)}
                  size="md"
                  className={
                    selectedOption === 1
                      ? "w-[80%] h-full opacity-80 bg-darkGreen-50 text-white"
                      : " w-[80%] h-full opacity-80 bg-gray-50 text-black"
                  }
                  styles={(theme) => ({
                    root: {
                      "&:hover": {
                        backgroundColor: theme.fn.darken("#245A44", 0.05),
                      },
                    },
                  })}
                >
                  {options[1]}
                </Button>
                <Button
                  onClick={() => setSelectedOption(2)}
                  size="md"
                  className={
                    selectedOption === 2
                      ? "w-[80%] h-full opacity-80 bg-darkGreen-50 text-white"
                      : " w-[80%] h-full opacity-80 bg-gray-50 text-black"
                  }
                  styles={(theme) => ({
                    root: {
                      "&:hover": {
                        backgroundColor: theme.fn.darken("#245A44", 0.05),
                      },
                    },
                  })}
                >
                  {options[2]}
                </Button>
                <Button
                  onClick={() => setSelectedOption(3)}
                  size="md"
                  className={
                    selectedOption === 3
                      ? "w-[80%] h-full opacity-80 bg-darkGreen-50 text-white"
                      : " w-[80%] h-full opacity-80 bg-gray-50 text-black"
                  }
                  styles={(theme) => ({
                    root: {
                      "&:hover": {
                        backgroundColor: theme.fn.darken("#245A44", 0.05),
                      },
                    },
                  })}
                >
                  {options[3]}
                </Button>

                <Button
                  onClick={onClickHandler}
                  disabled={selectedOption === null ? true : false}
                  size="md"
                  className="h-[90%] w-[25%] bg-darkGreen-50 text-white"
                >
                  Submit
                </Button>
              </Box>
            ) : (
              <Box
                size="md"
                className="h-[45%] w-full flex flex-col items-center space-y-2"
              >
                <Text className="font-semibold text-lg ">
                  Enter your answers
                </Text>
                <TextInput
                  size="lg"
                  className="w-[80%]  h-full bg-gray-50 text-black"
                  placeholder="Enter your answer here"
                  value={inputValue1}
                  onChange={(e) => setInputValue1(e.target.value)}
                />
                <TextInput
                  size="lg"
                  className="w-[80%] h-full bg-gray-50 text-black"
                  placeholder="Enter your answer here"
                  value={inputValue2}
                  onChange={(e) => setInputValue2(e.target.value)}
                />
                <TextInput
                  size="lg"
                  className="w-[80%] h-full bg-gray-50 text-black"
                  placeholder="Enter your answer here"
                  value={inputValue3}
                  onChange={(e) => setInputValue3(e.target.value)}
                />
                <Button
                  onClick={onClickHandler}
                  disabled={
                    inputValue1 === "" ||
                    inputValue2 === "" ||
                    inputValue3 === ""
                      ? true
                      : false
                  }
                  size="md"
                  className="h-[90%] w-[15%] bg-darkGreen-50 text-white"
                >
                  Submit
                </Button>
              </Box>
            )}
          </Grid.Col>
          <Grid.Col span={5} className="h-full w-full space-y-2">
            <Box className="h-[53%] w-full space-y-2">
              <DataMetric
                hasChart={true}
                icon={<CashIcon color="grey" className="text-xl" />}
                increment={
                  responseStats
                    ? responseStats.currentIncomeVal
                    : data.stats === null
                    ? 0
                    : data.stats.length !== 1
                    ? data.stats[data.stats.length - 1].currentIncomeVal
                    : 0
                }
                value={cashChartData[cashChartData.length - 1]}
                unit={"SGD"}
                label="Cash"
                chartData={cashChartData}
                year={currentYear}
              />
            </Box>

            <Box className="h-[47%] w-full flex flex-row space-x-2">
              <Box className="h-full w-1/2">
                <DataMetric
                  morale={true}
                  className="w-1/2"
                  increment={
                    responseStats
                      ? responseStats.changeInMoraleVal
                      : data.stats === null
                      ? 0
                      : data.stats.length !== 1
                      ? data.stats[data.stats.length - 2].changeInMoraleVal
                      : 0
                  }
                  icon={<MoraleIcon color="grey" className="text-xl" />}
                  value={
                    responseStats
                      ? responseStats.currentMoraleVal
                      : currentMorale
                  }
                  unit={"%"}
                  label="Morale"
                  year={currentYear}
                  chartData={
                    responseStats
                      ? [responseStats.currentMoraleVal]
                      : [currentMorale]
                  }
                />
              </Box>
              <Box className="h-full w-1/2">
                <DataMetric
                  morale={false}
                  className="w-1/2"
                  icon={<SustainabilityIcon color="grey" className="text-xl" />}
                  year={currentYear}
                  increment={
                    responseStats
                      ? responseStats.changeInSustainabilityVal
                      : data.stats === null
                      ? 0
                      : data.stats.length !== 1
                      ? data.stats[data.stats.length - 2]
                          .changeInSustainabilityVal
                      : 0
                  }
                  value={
                    responseStats
                      ? responseStats.currentSustainabilityVal
                      : currentSustainability
                  }
                  unit={"pts"}
                  label="Sustainability"
                  chartData={
                    responseStats
                      ? [responseStats.currentSustainabilityVal]
                      : [currentSustainability]
                  }
                />
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </motion.div>
  );
}
