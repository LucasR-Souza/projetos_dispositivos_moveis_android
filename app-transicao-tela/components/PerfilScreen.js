import React from "react";
import { View, Text, Button } from "react-native";

function PerfilScreen({ navigation }){
    return (
        <View style={{ flex: 1, justifyContent: "center", alignContent: 'center', margin: 80}}>
            <Text>Bem vindo a tela de Perfil</Text>
            <Button
                title="Voltar a tela Inicial"
                onPress={()=> navigation.goBack()}
            />
        </View>
    );
}

export default PerfilScreen;