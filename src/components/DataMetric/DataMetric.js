import { Group, Stack, Text } from "@mantine/core";
import React from "react";
import BarChart from "./BarChart";
import IncrementChip from "./IncrementChip";
import LineChart from "./LineChart";

const DataMetric = ({
  label,
  icon,
  value,
  unit,
  hasChart,
  increment,
  chartData,
  morale,
  year,
}) => {
  return (
    <Stack
      spacing={4}
      className={`border border-solid border-gray-800 rounded-sm pt-2 pl-4 pr-4 pb-1 bg-gray-50 bg-opacity-50 h-full w-full justify-between `}
    >
      <Group
        spacing="xs"
        className="inline-flex text-xs mb-1 space-x-0 text-center rounded-full"
      >
        {icon}
        <Text className="text-gray-500 text-base xl:text-md">{label}</Text>
      </Group>

      <Group className="items-end" spacing={4}>
        <Text className="font-semibold text-xl xl:text-3xl notranslate">
          {value}
        </Text>
        <Text className="text-gray-500 notranslate">{unit}</Text>
        <IncrementChip
          className="mb-1 ml-2 notranslate"
          increment={increment}
          unit={unit}
        />
      </Group>
      <div className="h-full">
        {hasChart ? (
          <LineChart data={chartData} year={year} />
        ) : (
          <BarChart morale={morale} data={chartData} year={year} />
        )}
      </div>
    </Stack>
  );
};

export default DataMetric;
