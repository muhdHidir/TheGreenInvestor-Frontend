import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import StateService from "../services/StateService";

import {
  Container,
  Box,
  Select,
  Button,
  Stack,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import GenericAvatar from "../components/GameEnd/GenericAvatar";
import ProfilePics from "../components/ProfilePics/ProfilePics";

import ProfileService from "../services/ProfileService";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState({ username: "" });

  const [opened, setOpened] = useState(false);

  const [profileDetails, setProfileDetails] = useState(null);
  const [returnedSelectedProfilePic, setReturnedProfilePic] = useState();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setCurrentUser(currentUser);
    async function getDetails() {
      if (opened === false) {
        await ProfileService.getProfileDetails().then((response) => {
          setProfileDetails(response.data);
        });
      }
    }

    getDetails();
  }, []);

  function handleClose(selectedIndex) {
    setOpened(false);
  }


  if (currentUser === undefined || profileDetails === null) {
    return (
      <Box className="bg-gray-50 bg-opacity-70 h-full rounded-xl self-center align-middle relative w-[35%] pt-2 pr-2 pl-2 pb-2">
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
    <Box className="bg-gray-50 bg-opacity-70 h-[40%] rounded-xl self-center align-middle relative w-[35%] pt-2 pr-2 pl-2 pb-2">
      <ProfilePics
        opened={opened}
        handleClose={handleClose}
        setReturnProfilePic={setReturnedProfilePic}
      />
      <Stack align="center" justify="space-between">
        <Text className="text-center font-bold text-3xl text-darkGreen-50">
          User Profile
        </Text>
        <GenericAvatar
          name={"" + currentUser.username}
          // profilePicIndex={profileDetails.profileIndex}
          profilePicIndex={
            returnedSelectedProfilePic === undefined
              ? profileDetails.profileIndex
              : returnedSelectedProfilePic
          }
        />
        <Text className="text-center font-semibold text-xl text-darkGreen-50">
          Highscore:{" "}
          <span className="font-bold">{`${profileDetails.highScore} pts`}</span>
        </Text>
        <Text className="text-center font-semibold text-xl text-darkGreen-50">
          {" "}
          No. of Games Played:{" "}
          <span className="font-bold"> {profileDetails.gamesPlayed} </span>{" "}
        </Text>
        <Button
          className="bg-darkGreen-50 w-1/2"
          onClick={() => {
            setOpened(true);
          }}
        >
          Change Profile Pic
        </Button>
      </Stack>
    </Box>
  );
}
