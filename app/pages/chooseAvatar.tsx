import { Text, TouchableOpacity, View, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar } from "tamagui";
import { FlatList, StyleSheet, TextInput } from "react-native";
import Colors from "../constants/Colors";
import CustomAlert from "../components/customAlert";
import { storage } from "../utils/Storage";
import { router } from "expo-router";
import ProfileData from "../constants/ProfileData";
import SocketManager from "../controller/SocketManager";
import {SERVER_URL} from '@env'

type Data = {
  id: string;
  title: string;
};

type RenderItemProps = {
  item: Data;
};

const data = ProfileData.data;

const numColumns = 3; // Number of columns in the grid

export default function ChooseAvatar() {
  const [selectedItem, setSelectedItem] = useState("");

  const [name, setName] = useState("");

  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (text: string): void => {
    // Update the state with the new input value
    setName(text);
  };

  const handleButtonClick = (): void => {
    if (name == "" || selectedItem == "") {
      setShowAlert(true);
    }
    // save the info to MMKV storage
    else {
      storage.set("name", name);
      storage.set("id", selectedItem);

      // route to the friends page
      router.replace("/pages/friends");

      // reconnecting to socket server on name or avatar change
      const socket = SocketManager.getSocket();
      if (SocketManager.isConnected()) {
        console.log("Reconnecting with new name from socket server...");
        const tempName = storage.getString("name")!;
        const tempId = storage.getString("id")!;

        socket?.emit("user-connect", {
          name: tempName,
          id: tempId,
          active: false,
        });
        setTimeout(() => {
          socket?.disconnect();
        }, 100); // Add a small delay before disconnecting

        setTimeout(() => {
          if(!SocketManager.isConnected()) SocketManager.connect(SERVER_URL);
        }, 100); // Add a small delay before disconnecting
      }
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    const nameString = storage.getString("name");
    const id = storage.getString("id");

    if (nameString && id) {
      setName(nameString);
      setSelectedItem(id);
    }
  }, []);

  const renderItem = ({ item }: RenderItemProps) => (
    <TouchableOpacity
      style={[
        styles.item,
        selectedItem === item.id && styles.selectedItem, // Apply selected item styles if the item is selected
      ]}
      onPress={() => setSelectedItem(item.id)} // Set the selected item when pressed
    >
      <Avatar size="$8" borderRadius={10}>
        <Avatar.Image src={item.title} resizeMode="stretch" />
        <Avatar.Fallback bc={Colors.dark.secondary} />
      </Avatar>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <StatusBar barStyle={"light-content"} backgroundColor={"black"} />

      <CustomAlert
        visible={showAlert}
        onClose={handleCloseAlert}
        message="Please enter an alias and pick an avatar"
      />

      <Text
        style={{
          fontFamily: "Helvetica-Light",
          fontSize: 24,
          color: "white",
          marginStart: 24,
          marginTop: 24,
        }}
      >
        Enter your alias
      </Text>

      <TextInput
        style={{
          fontFamily: "Helvetica",
          fontSize: 14,
          margin: 16,
          backgroundColor: "black",
          borderWidth: 2,
          borderColor: Colors.dark.secondary,
          color: "white",
          padding: 8,
          paddingHorizontal: 16,
          borderRadius: 10,
        }}
        placeholder="Enter alias"
        value={name}
        onChangeText={handleInputChange}
        placeholderTextColor={"gray"}
      ></TextInput>
      <Text
        style={{
          fontFamily: "Helvetica-Light",
          fontSize: 24,
          color: "white",
          marginTop: 24,
          marginStart: 24,
          marginBottom: 8,
        }}
      >
        Pick your avatar
      </Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.container}
      />
      <TouchableOpacity
        onPress={handleButtonClick}
        style={{
          backgroundColor: Colors.dark.primary,
          borderRadius: 10,
          marginHorizontal: 24,
          marginVertical: 24,
          padding: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{ color: "white", fontFamily: "Helvetica-Bold", fontSize: 14 }}
        >
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 10,
    margin: 10,
    width: 100, // Calculate width based on number of columns
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  selectedItem: {
    borderColor: Colors.dark.primary, // Change border color when item is selected
    borderWidth: 2,
  },
});
