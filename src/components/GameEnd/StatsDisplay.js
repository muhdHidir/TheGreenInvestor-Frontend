import { Box, Indicator, Text } from "@mantine/core";
import React from "react";

const StatsDisplay = ({ icon, value }) => {
  return (
    <Indicator
      label={icon}
      position="top-center"
      color="#245A44"
      inline
      size={22}
    >
      <Box className="rounded-3xl pt-1 pb-1 pl-4 pr-4 border-solid  border-2 border-darkGreen-50">
        <Text className="text-darkGreen-50 font-semibold">{value}</Text>
      </Box>
    </Indicator>
  );
};

export default StatsDisplay;
