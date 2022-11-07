import { Box, Grid, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CircleData from "./CircleData";
import HorizontalBarChart from "./HorizontalBarChart";

const ImportanceSustain = () => {
  const [loading, setLoading] = useState(true);

  //different data that needs to be passed to the charts
  const [data, setData] = useState();
  const [flight, setFlight] = useState();
  const [electricity, setElectricity] = useState();
  const [fuelConsumption, setFuelConsumption] = useState();

  //getting carbon data from the backend
  useEffect(() => {
    async function getCarbonData() {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.thegreeninvestor.net:8080/api/carbon`, {
          "Content-Type": "application/json",
        });
        setData(res.data);
      } catch (error) {
        console.log(error.response);
      }

      setLoading(false);
    }
    getCarbonData();
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setFlight(data[9].data);
      setElectricity(data[0].data);
      setFuelConsumption([
        data[10].data.attributes.carbon_lb,
        data[7].data.attributes.carbon_lb,
        data[12].data.attributes.carbon_lb,
      ]);
    }
  }, [data]);

  //dont load until data has been retrieved
  if (
    data === undefined ||
    flight === undefined ||
    electricity === undefined ||
    fuelConsumption === undefined
  ) {
    return (
      <Box className="h-full w-full items-center">
        <LoadingOverlay
          className="items-center align-middle h-full w-full"
          loaderProps={{ size: "xl", color: "black" }}
          overlayOpacity={0}
          visible
        />
      </Box>
    );
  }
  return (
    <div className="h-full w-full relative">
      {loading && (
        <Box className="h-full w-full items-center">
          <LoadingOverlay
            className="items-center align-middle h-full w-full"
            loaderProps={{ size: "xl", color: "black" }}
            overlayOpacity={0}
            visible
          />
        </Box>
      )}
      {!loading && (
        <Grid className="h-full w-full">
          <Grid.Col span={3}>
            <Text className="text-md my-2 font-serif">
              On the right, you are provided with stastics regarding some of the
              biggest causes of carbon emissions such as flight, electricity and
              fuel. BIT is Bituminous Coal , MSW is Municipal Solid Waste and
              LIG is Lignite Coal. From these large numbers, we can understand
              that all these cause a lot of harm to the environment. Thus, do be
              mindful of your actions!
            </Text>
          </Grid.Col>
          <Grid.Col span={9}>
            <Group className="flex items-center justify-center h-full w-full p-0 -space-x-4">
              <CircleData
                value={flight.attributes.carbon_lb}
                label={"Flight"}
                unit={"lb"}
              />
              <CircleData
                value={electricity.attributes.carbon_lb}
                label={"Electricity"}
                unit={"lb"}
              />
              <HorizontalBarChart data={fuelConsumption} />
            </Group>
          </Grid.Col>
        </Grid>
      )}
    </div>
  );
};

export default ImportanceSustain;
