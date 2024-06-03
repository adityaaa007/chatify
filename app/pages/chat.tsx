import { View, Avatar } from "tamagui";
import Colors from "../constants/Colors";
import MessageBox from "../components/messageBox";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StatusBar,
  Keyboard,
  AppState,
  AppStateStatus,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { storage } from "../utils/Storage";
import { ChevronLeft, SendHorizonal, SmilePlus } from "lucide-react-native";
import ProfileData from "../constants/ProfileData";
import { router } from "expo-router";
import EmojiPicker from "rn-emoji-picker";
import { emojis } from "rn-emoji-picker/dist/data";
import SocketManager from "../controller/SocketManager";
import {SERVER_URL} from '@env'

export default function Chat() {
  type Data = {
    id: string;
    message: string;
    self: boolean;
    time: string;
  };

  const [data, setData] = useState<Data[]>([]);

  const [text, setText] = useState("");

  const [showEmoji, setShowEmoji] = useState(false);

  const flatListRef = useRef<FlatList | null>(null);

  // Function to scroll FlatList to the bottom
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Scroll to bottom whenever data changes
  useEffect(() => {
    scrollToBottom();
  }, [data]); // Assuming data is your FlatList data array

  const handleInputChange = (text: string): void => {
    // Update the state with the new input value
    setText(text);
    setShowEmoji(false);
  };

  const [id, setId] = useState("");
  const [friendId, setFriendId] = useState("");
  const [name, setName] = useState("");
  const [friendName, setFriendName] = useState("");
  const [socket, setSocket] = useState<Socket>();
  const [room, setRoom] = useState("");

  const imageData = ProfileData.data;

  useEffect(() => {
    // Listen for 'message' event from the server
    console.log("useEffect....");

    setSocket(SocketManager.getSocket()!);

    setId(storage.getString("id")!);
    setFriendId(storage.getString("friend-id")!);
    setName(storage.getString("name")!);
    setFriendName(storage.getString("friend-name")!);

    console.log(friendName + " " + friendId);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "background") {
        console.log("unmounting chat...............");

        const socket = SocketManager.getSocket();
        // disconnect only if connected
        if (SocketManager.isConnected()) {
          console.log("Disconnecting from socket server...");
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
        }
      } else if (nextAppState === "active") {
        //connecting to server only if not connected
        setTimeout(() => {
          if(!SocketManager.isConnected()) SocketManager.connect(SERVER_URL);
        }, 100); // Add a small delay before disconnecting
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function to remove the event listener when the component unmounts or dependencies change
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Function to generate a unique room name between two users
    function generateRoomName(user1Id: string, user2Id: string): string {
      // Sort the user IDs alphabetically
      const sortedIds = [user1Id, user2Id].sort();
      // Concatenate the sorted user IDs with a separator
      let concatenatedString = sortedIds.join("");
      concatenatedString = concatenatedString.split("").sort().join("");
      console.log(concatenatedString);

      return concatenatedString;
    }

    const room = generateRoomName(name, friendName);
    setRoom(room);

    if (socket) {
      //join the room
      socket.emit("joinRoom", room);

      socket.on("message", (data) => {
        // Update the state with the new message
        console.log("name: " + data.name + " my name: " + name);

        if (data.name != name) {
          setData((prevData: Data[]) => [
            ...prevData,
            {
              id: generateUniqueId(),
              message: data.message,
              self: false,
              time: data.time,
            },
          ]);
        }
      });
    }
  }, [socket]);

  // Function to fetch the title based on the id
  function getImageById(id: string) {
    const item = imageData.find((item) => item.id === id);
    return item ? item.title : null;
  }

  const messageHandler = (message: string) => {
    const data = {
      room: room,
      message: message,
      name: name,
    };
    // Emit the message to the server
    if (message != "") {
      socket?.emit("messageToServer", data);
    }
  };

  const generateUniqueId = (): string => {
    return (
      new Date().getTime().toString(36) + Math.random().toString(36).substr(2)
    );
  };

  type messageItem = {
    id: string;
    message: string;
    self: boolean;
    time: string;
  };

  type RenderItemProps = {
    item: messageItem;
  };

  const renderItem = ({ item }: RenderItemProps) => (
    <MessageBox
      text={item.message}
      self={item.self}
      time={item.time}
    ></MessageBox>
  );

  return (
    <View
      flex={1}
      backgroundColor={"black"}
      style={{
        paddingHorizontal: 0,
      }}
    >
      <StatusBar barStyle={"light-content"} backgroundColor={"black"} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <ChevronLeft color={"gray"} size={24} style={{ margin: 20 }} />
        </TouchableOpacity>

        <Avatar size="$4" circular>
          <Avatar.Image src={getImageById(friendId ? friendId : "1")} />
          <Avatar.Fallback bc={Colors.dark.secondary} />
        </Avatar>

        <Text
          style={{
            fontFamily: "Helvetica",
            fontSize: 16,
            color: "white",
            marginStart: 8,
          }}
        >
          {friendName}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        style={{ flex: showEmoji ? 0.4 : 1, marginBottom: 90, marginTop: 0 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onContentSizeChange={scrollToBottom}
      />

      <View
        alignItems="stretch"
        justifyContent="center"
        flexDirection="row"
        style={{
          position: "absolute",
          bottom: showEmoji ? 320 : 0,
          padding: 16,
          width: "100%",
        }}
      >
        <TextInput
          style={{
            fontFamily: "Helvetica",
            fontSize: 14,
            backgroundColor: "black",
            borderWidth: 2,
            borderColor: Colors.dark.secondary,
            color: "white",
            padding: 8,
            paddingHorizontal: 16,
            borderRadius: 10,
            flex: 0.85,
          }}
          placeholderTextColor={"gray"}
          value={text}
          onChangeText={handleInputChange}
          placeholder={`Enter message`}
        />

        <TouchableOpacity
          style={{ position: "absolute", bottom: 8, right: 64, padding: 8 }}
          onPress={() => {
            setShowEmoji(!showEmoji);

            Keyboard.dismiss();
          }}
        >
          <SmilePlus
            color={Colors.dark.primary}
            size={24}
            style={{ margin: 20 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 0.15 }}
          onPress={() => {
            messageHandler(text);

            // for showing self message
            if (text != "") {
              setData((prevData: Data[]) => [
                ...prevData,
                {
                  id: generateUniqueId(),
                  message: text,
                  self: true,
                  time: getCurrentTime(),
                },
              ]);
            }

            setText("");
          }}
        >
          <SendHorizonal
            color={Colors.dark.primary}
            size={24}
            style={{ margin: 20 }}
          />
        </TouchableOpacity>
      </View>

      {showEmoji ? (
        <EmojiPicker
          emojis={emojis} // emojis data source see data/emojis
          autoFocus={false} // autofocus search input
          loading={false} // spinner for if your emoji data or recent store is async
          darkMode={true} // to be or not to be, that is the question
          perLine={10} // # of emoji's per line
          onSelect={(emoji) => {
            setText(text.concat(emoji.emoji));
          }} // callback when user selects emoji - returns emoji obj
        />
      ) : null}
    </View>
  );
}

const getCurrentTime = () => {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return currentDate.toLocaleTimeString("en-US", options);
};
