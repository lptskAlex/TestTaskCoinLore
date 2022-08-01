import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import {getCoinsData} from '../api/getCoinsData';

export const useCoins = cb => {
  return useQuery(['coins'], () => getCoinsData(), {
    onSuccess: res => {
      AsyncStorage.setItem('@coins', JSON.stringify(res));
      cb();
    },
  });
};
