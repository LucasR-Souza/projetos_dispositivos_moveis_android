import React, { useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, Modal, TouchableOpacity, Image, ToastAndroid, Platform, Alert } from 'react-native';
import "../../global.css";
import { Picker } from "@react-native-picker/picker";
import { collection, setDoc, doc, getDocs, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

import editIcon from "../../assets/edit_icon.png";
import deleteIcon from "../../assets/delete_icon.png"; // <- adicione um ícone de lixeira

function Itens() {
  const [visible, setVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('0');
  const [emoji, setEmoji] = useState('');
  const [itens, setItens] = useState([]);
  const [editar, setEditar] = useState(false);

  // Emojis aleatórios
  const foodEmojis = ["🍎", "🍞", "🥩", "🍫", "🍇", "🍉", "🍌", "🍍", "🥦", "🥕", "🍪", "🍋"];
  const getRandomEmoji = () => foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
  const [emojiPlaceholder, setEmojiPlaceholder] = useState(getRandomEmoji());

  // Atualizar emoji quando o modal abre
  useEffect(() => {
    if (visible) setEmojiPlaceholder(getRandomEmoji());
  }, [visible]);

  // Listar itens
  const listarItens = async () => {
    const getItens = await getDocs(collection(db, 'itens'));
    const itemList = getItens.docs.map(doc => ({ nome: doc.id, ...doc.data() }));
    setItens(itemList);
  };

  useEffect(() => {
    listarItens();
  }, []);

  // Toast helper
  const showToast = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      console.log(msg);
    }
  };

  // Adicionar item
  const adicionarItem = async () => {
    try {
      const documento = await getDoc(doc(db, 'itens', nome));
      if (documento.exists()) {
        showToast('❌ Esse item já existe!');
      } else {
        await setDoc(doc(db, 'itens', nome), { quantidade, emoji });
        showToast('✅ Item adicionado!');
        listarItens();
      }
    } catch {
      showToast('⚠️ Erro ao adicionar!');
    }

    setNome('');
    setQuantidade('0');
    setEmoji('');
  };

  // Editar item
  const editItem = async (item) => {
    setEditar(true);
    setVisible(true);
    setNome(item.nome);
    setQuantidade(item.quantidade);
    setEmoji(item.emoji);
  };

  const salvarEdicao = async () => {
    try {
      await updateDoc(doc(db, 'itens', nome), { quantidade, emoji });
      showToast('✏️ Item atualizado!');
      listarItens();
    } catch (e) {
      showToast('⚠️ Erro ao editar!');
    }
    setEditar(false);
    setVisible(false);
  };

  // Excluir item
  const excluirItem = async (itemNome) => {
    Alert.alert(
      "Excluir Item",
      `Tem certeza que deseja excluir "${itemNome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'itens', itemNome));
              showToast('🗑️ Item excluído!');
              listarItens();
            } catch (e) {
              showToast('⚠️ Erro ao excluir!');
            }
          },
        },
      ]
    );
  };

  return (
    <View>
      {/* Modal (adição e edição) */}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-5 w-11/12 shadow-lg">

            <Text className="text-xl font-bold text-primaria text-center mb-4">
              {editar ? "Editar Item" : "Adicionar Item"}
            </Text>

            {/* Entradas */}
            <View className="flex-row justify-between mb-4 items-center">
              {/* Emoji */}
              <TextInput
                placeholder={emojiPlaceholder}
                value={emoji}
                onChangeText={setEmoji}
                className="border w-16 rounded-lg px-2 h-[40px] text-left bg-white"
                maxLength={3}
              />

              {/* Nome */}
              <TextInput
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                editable={!editar}
                className={`border flex-1 mx-2 px-3 rounded-lg h-[40px] ${editar ? "bg-gray-100 text-gray-500" : "bg-white text-gray-800"}`}
              />

              {/* Quantidade */}
              <View className="border rounded-lg w-24 justify-center h-[40px] bg-white">
                <Picker
                  selectedValue={quantidade}
                  onValueChange={(value) => setQuantidade(value)}
                  mode="dropdown"
                >
                  {[...Array(100)].map((_, i) => (
                    <Picker.Item key={i} label={String(i)} value={String(i)} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Botões */}
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                className="flex-1 bg-primaria py-3 rounded-lg mr-2 shadow-md"
                onPress={() => {
                  editar ? salvarEdicao() : adicionarItem();
                  setVisible(false);
                }}>
                <Text className="text-white font-bold text-center text-lg">
                  {editar ? "Salvar" : "Adicionar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-gray-300 py-3 rounded-lg ml-2 shadow-md"
                onPress={() => setVisible(false)}>
                <Text className="text-center text-gray-700 font-semibold text-lg">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Botão principal */}
      <TouchableOpacity
        className="bg-primaria rounded-lg py-3 mt-4 mx-4 shadow-lg"
        onPress={() => {
          setEditar(false);
          setVisible(true);
        }}>
        <Text className="text-white font-bold text-center text-lg">Adicionar</Text>
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
  data={itens}
  keyExtractor={(item, index) => String(index)}
  contentContainerStyle={{ paddingVertical: 12 }}
  renderItem={({ item }) => (
    <View
      className="mx-4 mb-3 flex-row justify-between items-center p-4 rounded-2xl shadow-md bg-white"
      style={{ borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.1)' }}
    >
      {/* Emoji e Nome */}
      <View className="flex-row items-center">
        <Text className="text-2xl mr-3">{item.emoji || "🍽️"}</Text>
        <Text className="text-base font-semibold text-gray-800">{item.nome}</Text>
      </View>

      {/* Quantidade + Botões */}
      <View className="flex-row items-center space-x-3">
        {/* Número da quantidade */}
        <View className="bg-background px-3 py-1 rounded-full">
          <Text className="text-white font-semibold">{item.quantidade}</Text>
        </View>

        {/* Botão Editar */}
        <TouchableOpacity
          className="bg-blue-400 rounded-full p-2 active:bg-primaria/80"
          onPress={() => editItem(item)}
        >
          <Image
            source={editIcon}
            className="w-5 h-5 tint-white"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Botão Excluir */}
        <TouchableOpacity
          className="bg-red-500 rounded-full p-2 active:bg-red-600"
          onPress={() => excluirItem(item.nome)}
        >
          <Image
            source={deleteIcon}
            className="w-5 h-5 tint-white"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  )}
/>
    </View>
  );
}

export default Itens;
