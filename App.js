import React, {createContext, useMemo, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {Login} from './src/screens/Login';
import {List} from './src/screens/List';
import {Chart} from './src/screens/Chart';

const Stack = createNativeStackNavigator();

export const UserContext = createContext({
  userName: '',
  setUserName: () => {},
});

const queryClient = new QueryClient();

const App = () => {
  const [userName, setUserName] = useState('John Smith');
  const value = useMemo(() => ({userName, setUserName}), [userName]);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <UserContext.Provider value={value}>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="List" component={List} />
            <Stack.Screen name="Chart" component={Chart} />
          </Stack.Navigator>
        </UserContext.Provider>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
