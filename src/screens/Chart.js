import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Grid, LineChart, XAxis, YAxis} from 'react-native-svg-charts';
import {useNetInfo} from '@react-native-community/netinfo';
import styled from 'styled-components';

import {useCoin} from '../queries/useCoin';

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
`;

const ChartContainer = styled.View`
  height: 200px;
  flex-direction: row;
  margin-horizontal: 8px;
`;

export const Chart = ({route}) => {
  const {id} = route.params;
  const [noInternet, setNoInternet] = useState(false);
  const {data: coinData, refetch} = useCoin(id, () => setNoInternet(true));

  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isConnected === false) {
      setNoInternet(true);
    }
  }, [netInfo]);

  const [items, setItems] = useState([]);
  const [refetchCount, setRefetchCount] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [timer, setTimer] = useState(30);
  const [timerId, setTimerId] = useState();

  useEffect(() => {
    startTimer();
    const fetchIntervalId = setInterval(() => {
      refetch();
      startTimer();
      setRefetchCount(refetchCount + 1);
    }, 30000);
    setIntervalId(fetchIntervalId);

    return () => {
      clearInterval(id);
      clearInterval(timerId);
    };
  }, []);

  const startTimer = () => {
    setTimer(30);
    setTimerId(
      setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000),
    );
  };

  useEffect(() => {
    if (coinData) {
      setItems([
        ...items,
        {
          ...coinData,
          time: new Date(),
        },
      ]);
      if (refetchCount === 5) {
        clearInterval(intervalId);
        clearInterval(timerId);
      }
    }
  }, [coinData]);

  return (
    <View>
      <Title>{coinData[0]?.name}</Title>
      {!noInternet && <Text>Till next price fetch: {timer}</Text>}
      <ChartContainer>
        <YAxis
          data={items.map(item => +item[0].price_usd)}
          contentInset={{top: 20, bottom: 20}}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={5}
        />
        <LineChart
          style={{flex: 1, marginLeft: 16}}
          data={items.map(item => +item[0].price_usd)}
          svg={{stroke: 'rgb(134, 65, 244)'}}
          contentInset={{top: 20, bottom: 20}}>
          <XAxis
            data={items.map(item => +item[0].time)}
            svg={{fontSize: 12, fill: 'grey', translateX: 12}}
            formatLabel={(_, index) => {
              return `${items[index].time.getHours()}:${items[
                index
              ].time.getMinutes()}`;
            }}
          />

          <Grid />
        </LineChart>
      </ChartContainer>
    </View>
  );
};
