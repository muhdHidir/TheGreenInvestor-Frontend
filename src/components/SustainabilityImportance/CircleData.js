import React from "react";
import { RingProgress, Text, Group, Stack } from "@mantine/core";

const CircleData = ({ value, label, unit }) => {
  return (
    <RingProgress
      className="h-full w-full"
      size={200}
      thickness={16}
      label={
        <Stack spacing={0}>
          <Text
            className="text-2xl font-bold text-darkGreen-50 truncate hover:text-clip"
            align="center"
            px="xs"
            sx={{ pointerEvents: "none" }}
          >
            {label}
          </Text>
          <Text align="center" px="xs" sx={{ pointerEvents: "none" }}>
            <span className="text-xl font-bold text-darkGreen-50">{`${value} `}</span>
            <span className="text-xs">{unit}</span>
          </Text>
        </Stack>
      }
      sections={[
        {
          value: 100,
          color: "#75c8a6",
          tooltip: `${label} – ${value} ${unit}`,
        },
      ]}
    />
  );
};

export default CircleData;
