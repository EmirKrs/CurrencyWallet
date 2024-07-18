import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appSettings from '../../../settings';
import { useFocusEffect } from '@react-navigation/native';

//Components
import Item from './Components/item';
import Header from './Components/header';

const PortfolioScreen = () => {

  const [loading, setLoading] = useState(false);
  const [portfoliosData, setPortfoliosData] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchPortfolios(); 
    }, [])
  );

  const fetchPortfolios = async () => {
    const apiUrl = `${appSettings.CurrencyExchangeWalletApiUrl}/portfolios`;
    const token = await AsyncStorage.getItem('token');

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setPortfoliosData(data);

      if (!response.ok) {
        throw new Error('Portfolio Fetch Failed');
      }
      
    } catch (error) {
      console.error('Portfolio Fetch Error:', error);
    } finally {
      setLoading(false);
    }
    
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4A261" />
      </View>
    );
  }

  return (
    <View style={styles.flatListContainer}>
    <FlatList
      data={portfoliosData}
      keyExtractor={(item) => item.currencyId}
      renderItem={({ item }) => <Item item={item} />}
      ListHeaderComponent={<Header/>}
    ></FlatList>
  </View>
  )
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#FFFFFF'
  },

  flatListContainer: {
    flex:1,
    justifyContent: "center",
    backgroundColor: '#FFFFFF',
  },
});

export default PortfolioScreen;