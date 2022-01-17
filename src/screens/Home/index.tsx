import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useTheme } from 'styled-components';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { ParamListBase } from "@react-navigation/native";
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize'; 

import { api } from '../../services/api'

import Logo from '../../assets/logo.svg';
import { CarDTO } from '../../dtos/CarDTO';

import { Car } from '../../components/Car';
import { Load } from '../../components/Load';

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  MyCarsButton,
  CarList
} from './styles';

export function Home(){
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const theme = useTheme();

  function handleCarDetails(car: CarDTO){
    navigate("CarDetails", { car } );
  }

  function handleOpenMyCar(){
    navigate("MyCars");
  }

  useEffect(() => {
    async function fetchCars(){
      try {
        const response = await api.get('/cars');
        setCars(response.data);  
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);
  return(
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />  
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          <TotalCars>
            Total de {cars.length} carros
          </TotalCars>       
        </HeaderContent>
      </Header>

      { loading ? <Load /> : 
        <FlatList
          data={cars}
          keyExtractor={item => item.id }
          renderItem={({ item }) => 
            <Car data={item} onPress={ () => handleCarDetails(item)} />
          }
          style={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
        /> 
      }

      <MyCarsButton onPress={handleOpenMyCar}>
        <Ionicons 
          name="ios-car-sport"
          size={32}
          color={theme.colors.background_secondary}
          />
      </MyCarsButton>
    
    </Container>
  );
}