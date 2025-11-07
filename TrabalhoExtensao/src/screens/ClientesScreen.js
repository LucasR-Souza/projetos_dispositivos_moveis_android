import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import "../../global.css";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [detalhesVisivel, setDetalhesVisivel] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [pagamento, setPagamento] = useState("");
  const [modalAddVisivel, setModalAddVisivel] = useState(false);
  const [nome, setNome] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [produto, setProduto] = useState("");
  const [produtos, setProdutos] = useState([]);

  const showToast = (msg) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else console.log(msg);
  };

  // Listar clientes
  const listarClientes = async () => {
    const getClientes = await getDocs(collection(db, "clientes"));
    const lista = getClientes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setClientes(lista);
  };

  useEffect(() => {
    listarClientes();
  }, []);

  // Excluir cliente
  const excluirCliente = (id, nome) => {
    Alert.alert(
      "Excluir Cliente",
      `Tem certeza que deseja excluir "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "clientes", id));
            showToast("🗑️ Cliente excluído!");
            listarClientes();
          },
        },
      ]
    );
  };

  // Registrar pagamento parcial
  const registrarPagamento = async () => {
    const valor = parseFloat(pagamento);
    if (isNaN(valor) || valor <= 0) {
      showToast("⚠️ Digite um valor válido!");
      return;
    }

    const novoPago = (clienteSelecionado.valorPago || 0) + valor;
    const pagoCompleto = novoPago >= clienteSelecionado.valorTotal;

    await updateDoc(doc(db, "clientes", clienteSelecionado.id), {
      valorPago: novoPago,
      pago: pagoCompleto,
    });

    showToast("💰 Pagamento registrado!");
    setPagamento("");
    setDetalhesVisivel(false);
    listarClientes();
  };

  // Adicionar novo cliente
  const adicionarCliente = async () => {
    if (!nome.trim() || !valorTotal.trim()) {
      showToast("⚠️ Preencha nome e valor!");
      return;
    }

    try {
      await addDoc(collection(db, "clientes"), {
        nome,
        valorTotal: parseFloat(valorTotal),
        valorPago: 0,
        pago: false,
        itens: produtos.map((p) => ({ nome: p, quantidade: 1 })),
        dataCompra: serverTimestamp(),
      });

      showToast("🧾 Cliente adicionado!");
      setNome("");
      setValorTotal("");
      setProduto("");
      setProdutos([]);
      setModalAddVisivel(false);
      listarClientes();
    } catch (e) {
      showToast("Erro ao adicionar cliente!");
    }
  };

  const adicionarProdutoNaLista = () => {
    if (produto.trim()) {
      setProdutos([...produtos, produto]);
      setProduto("");
    }
  };

  return (
    <View className="flex-1">
      {/* Título */}
      <Text className="text-2xl font-bold text-primaria text-center mt-5 mb-3">
        Clientes 💼
      </Text>

      {/* Botão para adicionar cliente */}
      <TouchableOpacity
        className="bg-primaria rounded-xl py-3 mx-5 mb-5 shadow-md active:bg-primaria/80"
        onPress={() => setModalAddVisivel(true)}
      >
        <Text className="text-white font-bold text-center text-lg">
          + Adicionar Cliente
        </Text>
      </TouchableOpacity>

      {/* Lista de clientes */}
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const valorRestante = (item.valorTotal || 0) - (item.valorPago || 0);
          const nomeClasse = item.pago
            ? "text-gray-400 line-through"
            : "text-yellow-600 font-semibold";

          return (
            <View
              className="mx-4 mb-3 flex-row justify-between items-center p-4 rounded-2xl bg-white shadow-sm"
              style={{ borderBottomWidth: 2, borderBottomColor: "rgba(0,0,0,0.05)" }}
            >
              <View>
                <Text className={`text-lg ${nomeClasse}`}>{item.nome}</Text>
                <Text className="text-gray-500">
                  {item.pago
                    ? "✅ Pago"
                    : `💵 Deve R$${valorRestante.toFixed(2)}`}
                </Text>
              </View>

              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="bg-blue-500 rounded-full px-3 py-1 active:bg-secundaria/80"
                  onPress={() => {
                    setClienteSelecionado(item);
                    setDetalhesVisivel(true);
                  }}
                >
                  <Text className="text-white font-semibold">Detalhes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-500 rounded-full px-3 py-1 active:bg-red-600"
                  onPress={() => excluirCliente(item.id, item.nome)}
                >
                  <Text className="text-white font-semibold">Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Modal de Detalhes */}
      <Modal
        visible={detalhesVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setDetalhesVisivel(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-5 w-11/12">
            {clienteSelecionado && (
              <>
                <Text className="text-lg font-bold text-primaria text-center mb-4">
                  {clienteSelecionado.nome}
                </Text>

                <Text className="text-gray-700 mb-1">
                  💰 Valor total:{" "}
                  <Text className="font-semibold text-gray-900">
                    R${clienteSelecionado.valorTotal.toFixed(2)}
                  </Text>
                </Text>
                <Text className="text-gray-700 mb-4">
                  ✅ Pago:{" "}
                  <Text className="font-semibold text-gray-900">
                    R${(clienteSelecionado.valorPago || 0).toFixed(2)}
                  </Text>
                </Text>

                <Text className="font-semibold mb-2 text-gray-800">
                  🧾 Itens comprados:
                </Text>
                {clienteSelecionado.itens?.length ? (
                  clienteSelecionado.itens.map((it, i) => (
                    <Text key={i} className="text-gray-700">
                      • {it.nome} ({it.quantidade})
                    </Text>
                  ))
                ) : (
                  <Text className="text-gray-400">Nenhum item listado</Text>
                )}

                <TextInput
                  placeholder="Adicionar pagamento (R$)"
                  value={pagamento}
                  onChangeText={setPagamento}
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg px-3 h-[40px] mt-4"
                />

                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity
                    className="flex-1 bg-green-500 py-2 rounded-lg mr-2"
                    onPress={registrarPagamento}
                  >
                    <Text className="text-center text-white font-semibold">
                      Registrar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-gray-300 py-2 rounded-lg ml-2"
                    onPress={() => setDetalhesVisivel(false)}
                  >
                    <Text className="text-center text-gray-700 font-semibold">
                      Fechar
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Adição de Cliente */}
      <Modal
        visible={modalAddVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAddVisivel(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-5 w-11/12">
            <Text className="text-lg font-bold text-primaria text-center mb-4">
              Novo Cliente
            </Text>

            <TextInput
              placeholder="Nome do cliente"
              value={nome}
              onChangeText={setNome}
              className="border border-gray-300 rounded-lg px-3 h-[40px] mb-3"
            />

            <TextInput
              placeholder="Valor total (R$)"
              value={valorTotal}
              onChangeText={setValorTotal}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-3 h-[40px] mb-3"
            />

            <View className="flex-row items-center mb-3">
              <TextInput
                placeholder="Produto"
                value={produto}
                onChangeText={setProduto}
                className="border border-gray-300 flex-1 rounded-lg px-3 h-[40px] mr-2"
              />
              <TouchableOpacity
                className="bg-primaria px-4 py-2 rounded-lg active:bg-primaria/80"
                onPress={adicionarProdutoNaLista}
              >
                <Text className="text-white font-semibold text-lg">+</Text>
              </TouchableOpacity>
            </View>

            {produtos.length > 0 && (
              <View className="mb-3">
                <Text className="font-semibold text-gray-700 mb-1">
                  Produtos adicionados:
                </Text>
                {produtos.map((p, i) => (
                  <Text key={i} className="text-gray-600">
                    • {p}
                  </Text>
                ))}
              </View>
            )}

            <TouchableOpacity
              className="bg-primaria py-3 rounded-xl mt-3 active:bg-primaria/80"
              onPress={adicionarCliente}
            >
              <Text className="text-center text-white font-bold text-lg">
                Salvar Cliente
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Clientes;
