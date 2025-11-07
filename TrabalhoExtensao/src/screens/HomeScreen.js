import React, { useState } from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View, Modal, Button } from 'react-native';
import RegistroScreen from "./RegistroScreen";
import LoginScreen from "./LoginScreen";
import Itens from "./Itens";
import ClientesScreen from "./ClientesScreen";
import DashboardScreen from "./dashboardScreen";

const Drawer = createDrawerNavigator();

function HomeScreen({ navigation }) {


    return (        
        <Drawer.Navigator>                    
            <Drawer.Screen name="Itens" component={Itens}/>
                    <Drawer.Screen name="dashboard" component={DashboardScreen}/> 
                    <Drawer.Screen name="clientes" component={ClientesScreen}/>
                </Drawer.Navigator> 
    )

}


export default HomeScreen