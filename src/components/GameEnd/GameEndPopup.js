import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  DollarIcon,
  MoraleIcon,
  SkullIcon,
  StarIcon,
  SustainabilityIcon,
} from "../../icons";
import GameEndAvatar from "./GenericAvatar";
import StatsDisplay from "./StatsDisplay";

import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import GameService from "../../services/GameService";
import ProfileService from "../../services/ProfileService";

const GameEndPopup = ({
  failed,
  opened,
  handleClose,
  finalMorale,
  finalSustainability,
  finalCash,
}) => {
  let navigate = useNavigate();

  const [user, setUser] = useState();

  const [totalScore, setTotalScore] = useState();

  //get results of the user at the end or when he loses
  useEffect(() => {
    async function getStateAndQuestionData() {
      await GameService.getGameState()
        .then(async (response) => {
          setTotalScore(response.data.totalScore);
          console.log(response);
        })
        .catch((error) => console.log(error));
      setUser(AuthService.getCurrentUser());
    }
    getStateAndQuestionData();
  }, [opened]);

  const [profileDetails, setProfileDetails] = useState(null);

  //user profileDetails
  useEffect(() => {
    async function getDetails() {
      await ProfileService.getProfileDetails().then((response) => {
        setProfileDetails(response.data);
      });
    }
    getDetails();
  }, [opened]);

  if (user === undefined || profileDetails === null) {
    return (
      <Modal
        centered
        size="lg"
        opened={opened}
        onClose={handleClose}
        withCloseButton={false}
        closeOnClickOutside={false}
      >
        <LoadingOverlay
          loaderProps={{ size: "xl", color: "black" }}
          overlayOpacity={0.0}
          overlayColor="#c5c5c5"
          visible
        />
      </Modal>
    );
  }
  return (
    <>
      <Modal
        centered
        size="lg"
        opened={opened}
        onClose={handleClose}
        withCloseButton={false}
        closeOnClickOutside={false}
      >
        <Stack className="h-full w-full items-center">
          {!failed ? (
            <Group
              position="center"
              className="w full items-center align-center content-center"
            >
              <StarIcon className="text-2xl items-center align-center self-center text-gold-50" />
              <Text className=" text-center font-bold text-3xl text-darkGreen-50">
                Congratulations!
              </Text>
              <StarIcon className=" text-2xl items-center align-center self-center text-gold-50" />
            </Group>
          ) : (
            <>
              <Group
                position="center"
                className="w full items-center align-center content-center"
              >
                <SkullIcon className="text-2xl items-center align-center self-center text-red-600" />
                <Text className=" text-center font-bold text-3xl text-red-600">
                  You Lost!
                </Text>
                <SkullIcon className=" text-2xl items-center align-center self-center text-red-600" />
              </Group>
            </>
          )}
          <GameEndAvatar
            name={user && user.username}
            profilePicIndex={profileDetails.profileIndex}
          />
          {!failed ? (
            <Text className=" text-center font-bold text-lg text-darkGreen-50 ">
              YOU ARE A GREEN INVESTOR!
            </Text>
          ) : (
            <Text className=" text-center font-bold text-lg text-darkGreen-50 ">
              YOU ARE CLOSE! TRY AGAIN!
            </Text>
          )}
          <Text className=" text-center font-semibold text-lg text-darkGreen-50 ">
            {`Final Score: ${totalScore} pts`}
          </Text>
          <Group className="pt-2">
            <StatsDisplay icon={<DollarIcon />} value={finalCash} />
            <StatsDisplay icon={<MoraleIcon />} value={finalMorale} />
            <StatsDisplay
              icon={<SustainabilityIcon />}
              value={finalSustainability}
            />
          </Group>
          <Group className="pt-2">
            <Button
              className="w-32 bg-darkGreen-50 rounded-md"
              onClick={() => {
                navigate("/home");
              }}
            >
              Home
            </Button>
            <Button
              className="w-32 bg-darkGreen-50 rounded-md"
              onClick={() => {
                handleClose();
                navigate("/leaderboard");
              }}
            >
              Leaderboard
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default GameEndPopup;
