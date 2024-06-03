import React from "react";
import { View } from "tamagui";
import Colors from "../constants/Colors";
import { StyleSheet, Text } from "react-native";

export default function messageBox(props: {
  text: String;
  self: boolean;
  time: string;
}) {
  const styles = StyleSheet.create({
    container: {
      flexDirection: props.self ? "row-reverse" : "row",
      alignItems: "center",
      marginStart: 16,
    },
    textContainer: {
      marginRight: props.self ? 0 : 10,
      marginLeft: props.self ? 10 : 0,
      alignSelf: props.self ? "flex-end" : "flex-start",
      alignItems: props.self ? "flex-end" : "flex-start",
    },
    text: {
      // Add additional styling as needed
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text
          style={{
            backgroundColor: props.self
              ? Colors.dark.secondary
              : Colors.dark.primary,
            marginTop: 12,
            padding: 8,
            paddingHorizontal: 16,
            borderTopRightRadius: props.self ? 0 : 12,
            borderTopLeftRadius: props.self ? 12 : 0,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            flexShrink: 1,
            fontFamily: "Helvetica",
            fontSize: 14,
            color: "white",
          }}
        >
          {props.text}
        </Text>
        <Text
          style={{
            fontFamily: "Helvetica",
            fontSize: 10,
            color: "gray",
            marginTop: 4,
            marginEnd: props.self ? 4 : 0,
            marginStart: props.self ? 0 : 4,
          }}
        >
          {props.time}
        </Text>
      </View>
      {/* Add more Text components as needed */}
    </View>
  );
}
