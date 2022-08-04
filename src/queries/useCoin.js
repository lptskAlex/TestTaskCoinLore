import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import {getCoinData} from '../api/getCoinData';

export const useCoin = (index, cb) => {
  return useQuery(['test', index], () => getCoinData(index), {
    onSuccess: res => {
      AsyncStorage.setItem(`@coin${index}`, JSON.stringify(res));
      cb();
    },
  });
};
