import React from 'react';
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { ParamListBase } from "@react-navigation/native";
import { useWindowDimensions, StatusBar } from 'react-native';

import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';

import { ConfirmButton } from '../../components/ConfirmButton';

import {
  Container,
  Content,
  Title,
  Message,
  Footer,
} from './styles';

export function SchedulingComplete(){
  const { width } = useWindowDimensions();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  function handleConfirm(){
    navigation.navigate('Home');
  }

  return(
    <Container>
      <StatusBar
        barStyle='light-content'
        translucent
        backgroundColor="transparent"
      />
      <LogoSvg width={width}/>

      <Content>
        <DoneSvg width={80} height={80}/>
        <Title>Carro Alugado!</Title>

        <Message>
          Agora você só precisa ir {'\n'}
          até a concessionária da RENTX {'\n'}
          pegar o seu automóvel.
        </Message>
      </Content>

      <Footer>
        <ConfirmButton title="OK" onPress={handleConfirm}/>
      </Footer>
    
    </Container>
  );
}