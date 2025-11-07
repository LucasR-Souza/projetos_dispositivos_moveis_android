import React, { useEffect, useState } from "react";
import { View, Text, FlatList} from "react-native";
import "../../global.css";
import { db } from "../../firebase";
import { collection, getDocs} from "firebase/firestore";

function DashboardScreen() {
  const [clientes, setClientes] = useState([]);
  const [totalGanhos, setTotalGanhos] = useState(0);
  const [totalDevido, setTotalDevido] = useState(0);
  const [clientesPagos, setClientesPagos] = useState(0);

  // Buscar todos os clientes
  const listarClientes = async () => {
    const getClientes = await getDocs(collection(db, "clientes"));
    const lista = getClientes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setClientes(lista);

    // Calcular totais
    let ganhos = 0;
    let devido = 0;
    let pagos = 0;

    lista.forEach((c) => {
      ganhos += c.valorPago || 0;
      devido += (c.valorTotal || 0) - (c.valorPago || 0);
      if (c.pago) pagos += 1;
    });

    setTotalGanhos(ganhos);
    setTotalDevido(devido);
    setClientesPagos(pagos);
  };

  useEffect(() => {
    listarClientes();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-primaria text-center mb-4">
        Dashboard
      </Text>

      {/* Cards resumo */}
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 bg-green-100 rounded-lg p-4 mx-1">
          <Text className="text-gray-700">Clientes Pagos</Text>
          <Text className="text-xl font-bold text-green-600">{clientesPagos}</Text>
        </View>
        <View className="flex-1 bg-blue-100 rounded-lg p-4 mx-1">
          <Text className="text-gray-700">Ganhos</Text>
          <Text className="text-xl font-bold text-blue-600">R${totalGanhos.toFixed(2)}</Text>
        </View>
        <View className="flex-1 bg-yellow-100 rounded-lg p-4 mx-1">
          <Text className="text-gray-700">Devedores</Text>
          <Text className="text-xl font-bold text-yellow-600">R${totalDevido.toFixed(2)}</Text>
        </View>
      </View>

      {/* Lista resumida de clientes */}
      <Text className="text-lg font-semibold text-gray-700 mb-2">Clientes</Text>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const valorRestante = (item.valorTotal || 0) - (item.valorPago || 0);
          const nomeClasse = item.pago
            ? "text-gray-400 line-through"
            : "text-yellow-500 font-semibold";

          return (
            <View
              className="flex-row justify-between items-center p-3 mb-2"
              style={{ borderBottomWidth: 2, borderBottomColor: "rgba(0,0,0,0.1)" }}
            >
              <Text className={`text-base ${nomeClasse}`}>{item.nome}</Text>
              <Text className="text-gray-700">
                {item.pago ? "✅ Pago" : `💵 R$${valorRestante.toFixed(2)}`}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

export default DashboardScreen;
