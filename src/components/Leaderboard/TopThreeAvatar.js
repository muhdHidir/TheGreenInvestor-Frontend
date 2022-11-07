import React from "react";
import { Avatar, Group, Stack, Text } from "@mantine/core";
import { LeafIcon, TrophyIcon } from "../../icons";

const TopThreeAvatar = ({ first, position, name, points, image }) => {
  function toFixed(num, fixed) {
    fixed = fixed || 0;
    fixed = Math.pow(10, fixed);
    return Math.floor(num * fixed) / fixed;
  }
  return (
    <div className="h-full align-baseline items-baseline">
      <Text
        className={`h-full self-center text-center ${
          first ? "text-4xl font-bold" : "text-2xl font-semibold"
        } ${
          position === "first"
            ? "text-gold-50"
            : position === "second"
            ? "text-silver-50"
            : "text-bronze-50"
        }`}
      >
        {position === "first" ? "1st" : position === "second" ? "2nd" : "3rd"}
      </Text>
      <Stack className="-space-y-2 h-full items-baseline">
        <Group spacing={-2} className="self-center items-baseline -space-x-4">
          <LeafIcon
            style={{ transform: "scaleX(-1) rotate(-10deg)" }}
            className={`${first ? "text-2xl" : "text-xl"} text-darkGreen-50`}
          />

          <Avatar
            style={
              first
                ? { width: "8rem", height: "8rem" }
                : { width: "6rem", height: "6rem" }
            }
            src={`https://tgi-bucket.s3.ap-southeast-1.amazonaws.com/avatars/avatar-${image}.png`}
            alt="profilepic"
          />

          <LeafIcon
            className={`${first ? "text-2xl" : "text-xl"} text-darkGreen-50`}
            style={{ transform: "rotate(-10deg)" }}
          />
        </Group>
        <TrophyIcon
          className={`self-center ${
            first ? "text-4xl" : "text-2xl"
          } text-darkGreen-50`}
        />
      </Stack>

      <Text
        className={` h-full self-center text-center ${
          first ? "text-4xl font-bold" : "text-2xl font-semibold"
        } text-darkGreen-50`}
      >
        {name}
      </Text>

      <Text
        className={`self-center h-full text-center ${
          first ? "text-4xl" : "text-2xl"
        } text-darkGreen-50`}
      >
        {`${toFixed(points)} pts`}
      </Text>
    </div>
  );
};

export default TopThreeAvatar;
