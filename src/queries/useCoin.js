import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import {getCoinData} from '../api/getCoinData';

export const useCoin = (id, cb) => {
  return useQuery(['test', id], () => getCoinData(id), {
    onSuccess: res => {
      AsyncStorage.setItem(`@coin${id}`, JSON.stringify(res));
      cb();
    },
  });
};
