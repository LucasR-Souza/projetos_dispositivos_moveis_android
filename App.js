import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from 'react-native'; 

const contador = () =>{
	const [contar, SetIncrementar] = useState(0);

	const incrementar = () => SetIncrementar(contar + 1);
	
		return (
			<View style={styles.base}>
       	 		<Text style={[styles.base, styles.numero]}>
       	     		{contar}
        		</Text>
				<Button title='Me aperte!!!' onPress={incrementar}/>
    		</View>
	)

}

const styles = StyleSheet.create({
	
	base: {
		paddingTop: 100,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10
	},
	numero: {
		fontSize: 20
	}
})
export default contador;