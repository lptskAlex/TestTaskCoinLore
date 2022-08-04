import React, {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, SafeAreaView, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components';

import {UserContext} from '../../App';
import {useCoins} from '../queries/useCoins';
import {sizes} from '../constants';

const Container = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  margin: ${sizes.M}px;
`;

const Input = styled.TextInput`
    border-radius: ${sizes.S}px;
    padding: ${sizes.M}px;
    margin-top: ${sizes.M}px;
    width: 200px;
    align-items: center;
    justify-content: center;
    elevation: 5;
    shadow-color: #000;
    shadow-offset: {width: 0, height: 2};
    shadow-opacity: 0.8;
    shadow-radius: 2;
    border-width: 1px;
    border-color: #000;
`;

const Button = styled.TouchableOpacity`
    background-color: #fff;
    border-radius: ${sizes.S}px;
    padding: ${sizes.M}px;
    margin-top: ${sizes.M}px;
    width: 200px;
    align-items: center;
    justify-content: center;
    elevation: 5;
    shadow-color: #000;
    shadow-offset: {width: 0, height: ${sizes.XS}};
    shadow-opacity: 0.8;
    shadow-radius: 2;
    border-width: 1px;
    border-color: #000;
`;

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${sizes.M}px ${sizes.L}px;
    margin-top: ${sizes.M}px;
    align-items: center;
    justify-content: center;
    elevation: 5;
    shadow-color: #000;
    shadow-offset: {width: 0, height: ${sizes.XS}};
    shadow-opacity: 0.8;
    shadow-radius: 2;
    border-width: 1px;
    border-color: #000;


  justify-content: space-between;
`;

const ItemDetail = styled.Text`
  min-width: 40%;
`;

const Item = ({item, noInternet, index}) => {
  const navigation = useNavigation();
  return (
    <ItemContainer
      onPress={() => navigation.navigate('Chart', {currencyIndex: index})}
      disabled={noInternet}>
      <ItemDetail>{item.name}</ItemDetail>
      <ItemDetail>{item.price_usd}$</ItemDetail>
      <ItemDetail>{item.percent_change_24h}%</ItemDetail>
    </ItemContainer>
  );
};

export const List = () => {
  const [minChange, setMinChange] = useState();
  const [items, setItems] = useState();
  const [noInternet, setNoInternet] = useState(false);
  const [minChangeFilter, setMinChangeFilter] = useState();
  const {data: coinsData, isLoading} = useCoins(() => setNoInternet(false));
  const {userName} = useContext(UserContext);

  const netInfo = useNetInfo();

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@coins');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (netInfo.isConnected === false) {
      if (!coinsData) {
        setItems(getData());
      }
      setNoInternet(true);
      Alert.alert('No internet connection');
    } else {
      setNoInternet(false);
    }
  }, [netInfo]);

  return (
    <Container>
      {!isLoading && (
        <>
          <Text>Welcome {userName}!</Text>
          <Input
            numeric
            type="number"
            placeholder="Minimum 24-hr % Change"
            value={minChange}
            onChangeText={text => setMinChange(text.replace(/[^0-9^,.-]/g, ''))}
          />
          <Button
            onPress={() =>
              minChange
                ? setMinChangeFilter(minChange)
                : setMinChangeFilter(null)
            }>
            <Text>Filter</Text>
          </Button>

          <FlatList
            style={{width: '100%'}}
            data={
              minChangeFilter
                ? (items || coinsData?.data).filter(
                    el => +el.percent_change_24h >= +minChangeFilter,
                  )
                : items || coinsData?.data
            }
            renderItem={({item, index}) => (
              <Item noInternet={noInternet} item={item} index={index} />
            )}
            keyExtractor={item => item.id}
          />
        </>
      )}
    </Container>
  );
};
