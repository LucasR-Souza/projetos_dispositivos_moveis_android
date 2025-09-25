import react from "react";
import { View, Text, StyleSheet } from "react-native";

function TelaInicial({ route }){
    const {email} = route.params;

    return ( <View style={styles.container}>
        <Text styles={styles.textoInicial}> Bem vindo, {email}!</Text>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        fles: 1,
        justifyContent: 'center',
        alignItens: 'center'
    },
    textoInicial: {
        fontSize: 20,
        fontWight: 'bold'
    }
})

export default TelaInicial;