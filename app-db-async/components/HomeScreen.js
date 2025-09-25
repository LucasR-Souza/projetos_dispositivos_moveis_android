import React, { useState } from "react";
import { View, StyleSheet, Button, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function HomeScreen({ navigation }){
    const [valor, setValor] = useState('');

    const salvarDados = async () =>{
        try{
            await AsyncStorage.setItem("chave", valor);
        }catch(e){
            console.log("Falha ao salvar o dado: ", e);
        }
    }

    const exibirDados = () =>{
        if(valor != ''){
            navigation.navigate('Data', {valor})
        }else{
            alert("Salve algum dado")
        }
    }

    return(
        <View>
            <TextInput
            placeholder="Insira um valor"
            value = {valor}
            onChangeText={setValor}
            style = {{ borderWidth: 1, marginBottom: 10, marginTop: 50 }}
            />
            <Button
            title="Salvar dados"
            onPress={salvarDados}
            />
            <Button
            title="Exibir dados"
            onPress={exibirDados}
            />
        </View>
    )
}

export default HomeScreen;