import React, { useState } from "react";
import { View, StyleSheet, Button, TextInput, Text } from "react-native";

function DataScreen({ route }){
    const {valor} = route.params;

    return(
        <View>
            <Text>
                Dados: {valor}
            </Text>
        </View>
    )
}

export default DataScreen;