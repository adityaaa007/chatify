import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { View, Text, Avatar, Circle, XStack, YStack } from "tamagui";
import { router } from "expo-router";
import Colors from "../constants/Colors";
import { storage } from "../utils/Storage";
import { FilePenLine } from "lucide-react-native";
import SocketManager from "../controller/SocketManager";
import { AppState, AppStateStatus } from "react-native";
import {SERVER_URL} from '@env'

export default function Friends() {
  const numColumns = 2;

  const [nameString, setNameString] = useState("");
  const [idString, setIdString] = useState("");

  const data = [
    {
      id: "1",
      title: require("../../assets/images/1.png"),
    },
    {
      id: "2",
      title: require("../../assets/images/2.png"),
    },
    {
      id: "3",
      title: require("../../assets/images/3.png"),
    },
    {
      id: "4",
      title: require("../../assets/images/4.png"),
    },
    {
      id: "5",
      title: require("../../assets/images/5.png"),
    },
    {
      id: "6",
      title: require("../../assets/images/6.png"),
    },
    {
      id: "7",
      title: require("../../assets/images/7.png"),
    },
    {
      id: "8",
      title: require("../../assets/images/8.png"),
    },
    {
      id: "10",
      title: require("../../assets/images/10.png"),
    },
    // Add more items as needed
  ];
  // Function to fetch the title based on the id
  function getImageById(id: string) {
    const item = data.find((item) => item.id === id);
    return item ? item.title : null;
  }

  type User = {
    name: string;
    id: string;
  };

  type RenderItemProps = {
    item: User;
  };

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setNameString(storage.getString("name")!);
    setIdString(storage.getString("id")!);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        console.log('unmounting friends...............');

        const socket = SocketManager.getSocket();
        // disconnect only if connected
        if(SocketManager.isConnected()) {
          console.log("Disconnecting from socket server... "+storage.getString("name")!+" "+storage.getString("id")!);
          const tempName = storage.getString("name")!;
          const tempId = storage.getString("id")!;

          socket?.emit("user-connect", { name: tempName, id: tempId, active: false });

          setTimeout(() => {
            socket?.disconnect();
          }, 100); // Add a small delay before disconnecting
        }

      }
      else if (nextAppState === 'active'){
        //connecting to server only if not connected
        setTimeout(() => {
          if(!SocketManager.isConnected()) SocketManager.connect(SERVER_URL);
        }, 100); // Add a small delay before disconnecting

        const socket = SocketManager.getSocket();
        socket!.emit("get-users", true);
        
      }

    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function to remove the event listener when the component unmounts or dependencies change
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (nameString != "") {
      const socket = SocketManager.getSocket();// Replace with your server address

      socket!.on("users", (usersMap: { [name: string]: string }) => {
        const filteredUsersArray = Object.entries(usersMap)
          .filter(([name]) => name !== nameString) // Filter out users with name 'John'
          .map(([name, id]) => ({ name, id }));

        setUsers(filteredUsersArray);
        console.log("users: " + JSON.stringify(usersMap) + " for " + nameString);
      });

      socket!.emit("get-users", true);
    }
  }, [nameString]);

  const renderItem = ({ item }: RenderItemProps) => (
    <TouchableOpacity
      onPress={async () => {
        storage.set("friend-name", item.name);
        storage.set("friend-id", item.id);

        console.log(
          storage.getString("friend-name") +
            " " +
            storage.getString("friend-id")
        );
        router.push("/pages/chat");
      }}
    >
      <View
        backgroundColor={Colors.dark.secondary}
        borderRadius={16}
        marginTop={24}
        margin={16}
        padding={16}
        alignItems="center"
        width="$12"
      >
        <Avatar size="$6">
          <Avatar.Image src={getImageById(item.id)} />
          <Avatar.Fallback bc={Colors.dark.secondary} />
        </Avatar>

        <XStack marginTop={16} alignItems="center">
          <Text
            style={{
              fontFamily: "Helvetica",
              fontSize: 14,
              color: "white",
              width: 80,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            {item.name}
          </Text>
          <Circle size={12} backgroundColor={"greenyellow"} marginStart={8} />
        </XStack>
      </View>
    </TouchableOpacity>
  );

  return (
    <View backgroundColor={"black"} flex={1} paddingHorizontal={24}>
      <StatusBar barStyle={"light-content"} backgroundColor={"black"} />
      <XStack justifyContent="flex-start" alignItems="center" marginTop={24}>
        <Avatar
          size="$6"
          backgroundColor={Colors.dark.secondary}
          borderRadius={16}
          padding={8}
          marginEnd={16}
        >
          <Avatar.Image src={getImageById(idString ? idString : "1")} />
          <Avatar.Fallback bc={Colors.dark.secondary} />
        </Avatar>

        <YStack>
          <Text
            style={{
              fontFamily: "Helvetica-Light",
              fontSize: 20,
              color: "white",
              marginTop: 8,
            }}
          >
            Hello there,
          </Text>

          <Text
            style={{
              fontFamily: "Helvetica-Bold",
              fontSize: 20,
              color: "white",
              marginTop: 0,
            }}
          >
            {nameString}
          </Text>
        </YStack>
      </XStack>

      <TouchableOpacity
        onPress={() => {
          router.push("/pages/chooseAvatar");
        }}
        style={{
          position: "absolute",
          top: 32,
          end: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FilePenLine color={Colors.dark.primary} size={20} />
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 14,
            color: Colors.dark.primary,
            marginStart: 8,
          }}
        >
          Edit profile
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: "Helvetica-Light",
          fontSize: 24,
          color: "white",
          marginTop: 32,
        }}
      >
        Buddy List
      </Text>

      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
