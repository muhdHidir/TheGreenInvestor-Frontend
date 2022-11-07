import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { variants } from "../assets/Animations";

import DataMetric from "../components/DataMetric/DataMetric";
import { CashIcon, MoraleIcon, SustainabilityIcon } from "../icons";
import { Box, Grid, Text, Button, LoadingOverlay } from "@mantine/core";
import { Input } from "@mantine/core";

import authHeader from "../services/auth-header";

import axios from "axios";
import ReviewModal from "../components/PostQuestionReview/ReviewModal";
import GameEndPopup from "../components/GameEnd/GameEndPopup";

export default function Game() {
  const [data, setData] = useState([]);
  const [question, setQuestion] = useState();
  const [options, setOptions] = useState();
  const [responseStats, setResponseStats] = useState(null);
  const [responseFeedback, setResponseFeedback] = useState("");
  const [isOpenEnded, setIsOpenEnded] = useState(false);

  //income statistic
  const [income, setIncome] = useState(20);

  //input values for open-ended questions
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");

  //used for the highlighting of the selected option
  const [selectedOption, setSelectedOption] = useState(null);

  //index to iterate through the set of 10 questions
  const [index, setIndex] = useState(1);

  //Statistics Data State to update Graphs
  const [moraleChartData, setMoraleChartData] = useState([100]);
  const [sustainabilityChartData, setSustainabilityChartData] = useState([150]);
  const [cashChartData, setCashChartData] = useState([0, 100]);

  //for Review modal
  const [openReview, setOpenReview] = useState(false);

  //for End Game modal
  const [openEndGame, setOpenEndGame] = useState(false);

  //handle closing of the reviewModal
  function closeReviewHandler() {
    setOpenReview(false);
    setIndex(index + 1);
    setQuestion(data[index]);
    setSelectedOption(null);
  }

  //handle closing of end game handler
  function closeEndGameHandler() {
    setOpenEndGame(false);
  }

  //function called when the submit button is clicked (to transition the question and options and charts)
  async function onClickHandler() {
    if (selectedOption != null) {
      setResponseStats(
        [
          options[selectedOption].costImpact,
          options[selectedOption].moraleImpact,
          options[selectedOption].sustainabilityImpact,
        ],
        function () {
          console.log("setResponsestats completed");
        }
      );
      setResponseFeedback(options[selectedOption].feedback, function () {
        console.log("setfeedback completed");
      });
    }

    //submit Answer to backend
    submitAnswer();
    
    setOpenReview(true);
    //setOpenEndGame(true);
  }

  //function to change chart data upon submitting a response
  useEffect(() => {
    function changeChartData() {
      if (question?.openEnded === false && responseStats !== null) {
        setMoraleChartData([moraleChartData[0] + responseStats[1]]);
        setSustainabilityChartData([
          sustainabilityChartData[0] + responseStats[2],
        ]);
        setCashChartData((prevState) => [
          ...prevState,
          cashChartData[cashChartData.length - 1] - responseStats[0] + income,
        ]);
        setIncome(income + options[selectedOption].incomeImpact);
      }
    }
    changeChartData();
  }, [responseFeedback, responseStats]);

  //function to submit Answer to backend
  async function submitAnswer() {
    if (isOpenEnded) {
      const response = await axios
        .post(
          `https://api.thegreeninvestor.net:8080/api/${question.id}/answer`,
          {
            //concatenate input1, input2 and input3 by comma
            answer: inputValue1 + "," + inputValue2 + "," + inputValue3,
            isOpenEnded: true,
          },
          {
            headers: authHeader(),
            "Content-Type": "application/json",
          }
        )
        .then((response) => {
          console.log(response);
        });

      //reset the input values
      setInputValue1("");
      setInputValue2("");
      setInputValue3("");
    }
  }

  //to retrieve data from the backend regarding questions,first option
  useEffect(() => {
    async function getAllData() {
      await axios
        .get("https://api.thegreeninvestor.net:8080/api/questionsAndOptions", {
          headers: authHeader(),
          "Content-Type": "application/json",
        })
        .then(async (response) => {
          await setData(response.data);
          await setQuestion(response.data[0]);
          await setIsOpenEnded(response.data[0].openEnded);
          await setOptions(response.data[0].options);
        })
        .catch((error) => console.log(error.response));
    }
    getAllData();
  }, []);

  //function to get subsequent options using the id
  useEffect(() => {
    async function getOptions() {
      if (question !== undefined) {
        setOptions(question.options);
        setIsOpenEnded(question.openEnded);
      }
    }
    getOptions();
  }, [question]);

  

  // prevent running into an not found error causing the app to crash
  if (data === undefined || question === undefined || options === undefined) {
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
    >
      <ReviewModal
        content={responseFeedback}
        cash={responseStats && responseStats[0]}
        morale={responseStats && responseStats[1]}
        sustainability={responseStats && responseStats[2]}
        opened={openReview}
        handleClose={closeReviewHandler}
      />
      <GameEndPopup
        failed={true}
        opened={openEndGame}
        handleClose={closeEndGameHandler}
        userName={"Bob"}
        finalScore={2000}
      />
      <Box className="bg-gray-50 bg-opacity-70 h-[85vh] rounded-xl align-middle w-full pt-2 pr-2 pl-2 pb-1">
        <Grid className="h-full w-full">
          <Grid.Col span={7} className="h-full">
            <Box className="h-[55%] w-full flex flex-col items-center space-y-4">
              <Text className="text-center font-semibold text-xl">
                {question.question}
              </Text>
              <img
                className="h-[60%] w-[40%] text-center rounded-2xl drop-shadow-xl"
                src={question.imageLink}
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
                  {options[0].option}
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
                  {options[1].option}
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
                  {options[2].option}
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
                  {options[3].option}
                </Button>

                <Button
                  onClick={onClickHandler}
                  disabled={selectedOption === null ? true : false}
                  size="md"
                  className="h-[90%] w-[15%] bg-darkGreen-50 text-white"
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
                <Input
                  className="w-[80%] h-full bg-gray-50 text-black"
                  placeholder="Enter your answer here"
                  value={inputValue1}
                  onChange={(e) => setInputValue1(e.target.value)}
                />
                <Input
                  className="w-[80%] h-full bg-gray-50 text-black"
                  placeholder="Enter your answer here"
                  value={inputValue2}
                  onChange={(e) => setInputValue2(e.target.value)}
                />
                <Input
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
                increment={income}
                value={cashChartData[cashChartData.length - 1]}
                unit={"SGD"}
                label="Cash"
                chartData={cashChartData}
              />
            </Box>

            <Box className="h-[47%] w-full flex flex-row space-x-2">
              <Box className="h-full w-1/2">
                <DataMetric
                  morale={true}
                  className="w-1/2"
                  increment={responseStats ? responseStats[1] : 0}
                  icon={<MoraleIcon color="grey" className="text-xl" />}
                  value={moraleChartData[0]}
                  unit={"%"}
                  label="Morale"
                  chartData={moraleChartData}
                />
              </Box>
              <Box className="h-full w-1/2">
                <DataMetric
                  morale={false}
                  className="w-1/2"
                  icon={<SustainabilityIcon color="grey" className="text-xl" />}
                  increment={responseStats ? responseStats[2] : 0}
                  value={sustainabilityChartData[0]}
                  unit={"pts"}
                  label="Sustainability"
                  chartData={sustainabilityChartData}
                />
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </motion.div>
  );
}
