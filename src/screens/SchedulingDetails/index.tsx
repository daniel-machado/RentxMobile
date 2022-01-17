import React, {useState, useEffect} from 'react';
import { Alert } from 'react-native'; 
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/core";
import { ParamListBase } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon'; 
import {format} from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';
import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name, 
  Rent,
  Period,
  Price,
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
} from './styles';
import { api } from '../../services/api';

interface Params {
  car: CarDTO;
  dates: string[];
}

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

export function SchedulingDetails(){
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  const theme = useTheme();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const route = useRoute();
  const { car, dates } = route.params as Params;

  const rentTotal = Number(dates.length * car.rent.price);

  async function handleConfirmRental() {
    setLoading(true);
    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`)

    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...dates
    ]
    await api.post('schedules_byuser', {
      user_id: 1,
      car,
      startDate: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      endDate: format(getPlatformDate(new Date(dates[dates.length -1])), 'dd/MM/yyyy')
    });

    api.put(`/schedules_bycars/${car.id}`, {
      id: car.id,
      unavailable_dates
    })
    .then(() => navigation.navigate('SchedulingComplete'))
    .catch(() => {
      setLoading(false);
      Alert.alert('Não foi possível confirmar o agendamento.')
    })
  }

  function handleBack(){
    navigation.goBack();
  }

  useEffect(() => {
    setRentalPeriod({
      startFormatted: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(new Date(dates[dates.length -1])), 'dd/MM/yyyy'),
    })
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onPress={ handleBack } />
      </Header>

      <CarImages>
        <ImageSlider imagesUrl={car.photos}/>
      </CarImages>
      
      <Content>
        <Details>
          
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>           
          </Description>

          <Rent>
            <Period>{car.rent.period}</Period>
            <Price>R$ {car.rent.price}</Price>
          </Rent>

        </Details>

        <Accessories>
          {
            car.accessories.map(accessory => (
              <Accessory 
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))
          }
        </Accessories>

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.startFormatted}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(24)}
            color={theme.colors.shape}
          />

          <DateInfo>
            <DateTitle>ATE</DateTitle>
            <DateValue>{rentalPeriod.endFormatted}</DateValue>
          </DateInfo>


        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.rent.price} ${dates.length}x diárias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>

      </Content>

      <Footer>
        <Button 
          title="Alugar agora" 
          color={theme.colors.success} 
          onPress={handleConfirmRental}
          enabled={!loading}
          loading={loading}
          />
          
      </Footer>


    </Container>

  );
}