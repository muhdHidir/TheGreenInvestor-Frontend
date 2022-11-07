import { Avatar, Button, Grid, Modal, Stack } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { TickIcon } from "../../icons";
import authHeader from "../../services/auth-header";

//display profile pics if the user decides to change
const ProfilePics = ({ opened, handleClose, setReturnProfilePic }) => {
  const indexArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [selectedProfilePic, setSelectedProfilePic] = useState();
  async function submitAndClose() {
    console.log("hello");
    if (Object.keys(authHeader()).length !== 0) {
      await axios
        .put(
          `https://api.thegreeninvestor.net:8080/api/user/profileImageIndex/${selectedProfilePic}`,
          undefined,
          {
            headers: authHeader(),
            "Content-Type": "application/json",
          }
        )
        .then(() => {
          setReturnProfilePic(selectedProfilePic);
          handleClose();
        });
    }
  }

  console.log(selectedProfilePic);
  return (
    <Modal
      centered
      size="xl"
      className="font-bold text-xl"
      opened={opened}
      onClose={handleClose}
      setReturnProfilePic={setReturnProfilePic}
      title="Pick your profile picture"
    >
      <Stack>
        <Grid>
          {indexArray.map((index) => {
            return (
              <Grid.Col
                span={3}
                className=" items-center align-center content-center h-full w-full "
              >
                <Button
                  className="h-full w-full"
                  onClick={() => setSelectedProfilePic(index)}
                >
                  <Stack align="center" spacing={0}>
                    <Avatar
                      className={`self-center w-full align-center text-center content-center`}
                      src={`https://tgi-bucket.s3.ap-southeast-1.amazonaws.com/avatars/avatar-${index}.png`}
                      alt="profilePic"
                      style={{ width: "5rem", height: "5rem" }}
                    />
                    {selectedProfilePic === index ? (
                      <TickIcon className="text-darkGreen-50 text-lg text-center font-bold" />
                    ) : (
                      <div className="h-5"></div>
                    )}
                  </Stack>
                </Button>
              </Grid.Col>
            );
          })}
        </Grid>
        <Button
          onClick={submitAndClose}
          className="bg-darkGreen-50 w-1/8 self-center"
        >
          Confirm
        </Button>
      </Stack>
    </Modal>
  );
};

export default ProfilePics;
