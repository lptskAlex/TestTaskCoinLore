import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Grid, LineChart, XAxis, YAxis} from 'react-native-svg-charts';
import {useNetInfo} from '@react-native-community/netinfo';
import styled from 'styled-components';

import {useCoin} from '../queries/useCoin';
import {sizes} from '../constants';

const Title = styled.Text`
  font-size: ${sizes.XL}px;
  font-weight: bold;
`;

const ChartContainer = styled.View`
  height: 200px;
  flex-direction: row;
`;

export const Chart = ({route}) => {
  const {currencyIndex} = route.params;
  const [noInternet, setNoInternet] = useState(false);
  const {
    data: coinData,
    refetch,
    isFetching,
  } = useCoin(currencyIndex, () => setNoInternet(false));

  const netInfo = useNetInfo();

  const [items, setItems] = useState([]);
  const [refetchCount, setRefetchCount] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [timer, setTimer] = useState(30);
  const [timerId, setTimerId] = useState();
  const [shouldRefetch, setShouldRefetch] = useState(false);

  useEffect(() => {
    if (netInfo.isConnected === false) {
      setNoInternet(true);
    } else {
      setNoInternet(false);
    }
  }, [netInfo]);

  const startTimer = () => {
    setRefetchCount(prev => prev + 1);
    setTimer(30);
    setTimerId(
      setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000),
    );
    setIntervalId(
      setInterval(() => {
        setShouldRefetch(true);
        setTimer(30);
      }, 30000),
    );
  };

  const stopTimer = () => {
    clearInterval(timerId);
    clearInterval(intervalId);
  };

  const addItem = item => {
    setItems([
      ...items,
      {
        ...coinData,
        time: new Date(),
      },
    ]);
  };

  useEffect(() => {
    if (!shouldRefetch && refetchCount < 5) {
      startTimer();
    }
    if (shouldRefetch && refetchCount < 5) {
      refetch();
      setShouldRefetch(false);
      stopTimer();
    }
    if (refetchCount >= 5) {
      stopTimer();
    }
  }, [shouldRefetch]);

  useEffect(() => {
    !isFetching && addItem(coinData);
  }, [isFetching]);

  return (
    <View>
      <Title>{coinData?.name}</Title>
      {!noInternet && refetchCount < 5 && (
        <Text>Till next price refetch: {timer}</Text>
      )}
      {items && (
        <ChartContainer>
          <YAxis
            data={items.map(item => +item.price_usd)}
            contentInset={{top: 20, bottom: 20}}
            svg={{
              fill: 'grey',
              fontSize: 10,
            }}
            numberOfTicks={5}
          />
          <LineChart
            style={{flex: 1, marginLeft: 16}}
            data={items.map(item => +item.price_usd)}
            svg={{stroke: 'rgb(134, 65, 244)'}}
            contentInset={{top: 20, bottom: 20}}>
            <XAxis
              data={items.map(item => +item.time)}
              svg={{fontSize: 12, fill: 'grey'}}
              contentInset={{top: 20, bottom: 20, left: 14, right: 14}}
              formatLabel={(_, index) => {
                return `${items[index].time.getHours()}:${items[
                  index
                ].time.getMinutes()}`;
              }}
            />

            <Grid />
          </LineChart>
        </ChartContainer>
      )}
    </View>
  );
};
