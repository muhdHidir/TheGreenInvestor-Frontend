import { Avatar, Group, Text, Box } from "@mantine/core";
import React from "react";

const RemainingAvatars = ({ name, position, score, image }) => {
  function toFixed(num, fixed) {
    fixed = fixed || 0;
    fixed = Math.pow(10, fixed);
    return Math.floor(num * fixed) / fixed;
  }
  return (
    <>
      <Group className="w-full items-center" position="apart">
        <Group className="w-1/3">
          <Avatar
            style={{ width: "3rem", height: "3rem" }}
            src={`https://tgi-bucket.s3.ap-southeast-1.amazonaws.com/avatars/avatar-${image}.png`}
            alt="profilepic"
          />
          <Text className="font-semibold text-darkGreen-50">{name}</Text>
        </Group>
        <Text className="w-1/3 font-semibold text-darkGreen-50">{`${toFixed(
          score
        )} pts`}</Text>
        <Box
          className={`inline-flex border pt-2 pb-2 pl-3 pr-3 border-solid text-xs mb-1 space-x-2 text-center items-center bg-darkGreen-50 rounded-full`}
        >
          <Text className="font-semibold text-base text-white">{position}</Text>
        </Box>
      </Group>
    </>
  );
};

export default RemainingAvatars;
