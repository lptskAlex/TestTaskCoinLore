import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {SafeAreaView, Text, TextInput} from 'react-native';
import styled from 'styled-components';
import {UserContext} from '../../App';

const Container = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Button = styled.TouchableOpacity`
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
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

const Input = styled.TextInput`
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
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

export const Login = () => {
  const [username, setUsername] = useState('');
  const navigation = useNavigation();
  const {setUserName} = useContext(UserContext);

  return (
    <Container>
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button
        onPress={() => {
          setUserName(username);
          navigation.navigate('List');
        }}
        disabled={!username}>
        <Text>Login</Text>
      </Button>
    </Container>
  );
};
