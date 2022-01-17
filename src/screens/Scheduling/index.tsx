import React, { useState } from 'react';
import { format } from 'date-fns';
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/core";
import { ParamListBase } from "@react-navigation/native";
import { useTheme } from 'styled-components';
import { StatusBar, Alert } from 'react-native';

import { Button } from '../../components/Button';
import { BackButton } from '../../components/BackButton';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { CarDTO } from '../../dtos/CarDTO';
import { 
  Calendar, 
  DayProps, 
  generateInterval,
  MarkedDateProps
} from '../../components/Calendar';

import ArrowSvg from '../../assets/arrow.svg';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer,
} from './styles';


interface Params {
  car: CarDTO;
}

interface RentalPeriod {
  startFomatted: string;
  endFormatted: string;
}

export function Scheduling(){
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
  const theme = useTheme();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const route = useRoute();
  const { car } = route.params as Params;

  function handleConfirmRental(){
    navigation.navigate('SchedulingDetails', {
      car, 
      dates: Object.keys(markedDates),
    }); 
  }

  function handleBack(){
    navigation.goBack();
  }

  function handleChangeDate(date: DayProps){
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp){
      start = end;
      end = start;
    }
    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const fistDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFomatted: format(getPlatformDate(new Date(fistDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
    })
  }
  
  return(
    <Container>
      
      <Header>
        <StatusBar
          barStyle='light-content'
          translucent
          backgroundColor="transparent"
        />
        
        <BackButton
          onPress={ handleBack }
          color={theme.colors.shape}
        />

        <Title>
          Escolha uma {'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod.endFormatted}>
              {rentalPeriod.startFomatted}
            </DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATE</DateTitle>
            <DateValue selected={!!rentalPeriod.endFormatted}>
              {rentalPeriod.endFormatted}
            </DateValue>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar 
          markedDates={markedDates}
          onDayPress={handleChangeDate}
        />
      </Content>

      <Footer>
        <Button 
          title="Confirmar" 
          onPress={handleConfirmRental}
          enabled={!!rentalPeriod.startFomatted}
          />
      </Footer>

    </Container>
  );
}