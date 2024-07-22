import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, FlatList, TextInput, Modal, ScrollView } from "react-native";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { ActivityIndicator, TouchableRipple } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from "react-native";
import { LineChart } from 'react-native-chart-kit';

export default function History({ navigation, route }) {

    const screenWidth = Dimensions.get("window").width * 2;

    const chartConfig = {
        backgroundGradientFrom: "#5E60CE",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#5E60CE",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    const data = {
        labels: ["2024-12-12", "February", "March", "April", "May", "June"],
        datasets: [
          {
            data: [10, 20, 28, 40, 55, 63],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
      };

    return (
        <SafeAreaView style={styles.container}>
            <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.goBack()} />

            <Text style={styles.main_text}>
                History
            </Text>
            <ScrollView horizontal={true}>
            <LineChart
  data={data}
  width={screenWidth}
  height={310}
  verticalLabelRotation={30}
  chartConfig={chartConfig}
  bezier
/>
            </ScrollView>
            

        </SafeAreaView>
    );
}
