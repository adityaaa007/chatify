import { View } from "tamagui";
import React from "react";
import { StatusBar, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "tamagui";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import Colors from "../constants/Colors";

export default function GetStarted() {
  return (
    <View flex={1} backgroundColor={"black"}>
      <StatusBar backgroundColor="black" />
      <Image
        src={require("../../assets/images/22.jpg")}
        position="absolute"
        width={wp(80)}
        height={hp(100)}
        resizeMode="contain"
        alignSelf="center"
      ></Image>

      <BlurView
        tint="dark"
        intensity={50}
        style={{
          position: "absolute",
          width: wp(100),
          height: hp(100),
          overflow: "hidden",
        }}
        blurReductionFactor={1}
      ></BlurView>

      <View position="absolute" bottom={32} width="80%">
        <Text
          style={{
            fontFamily: "Helvetica-Light",
            fontSize: 50,
            color: "white",
            width: "100%",
            margin: 24,
          }}
        >
          Elevate your chatting experience!
        </Text>

        <TouchableOpacity
          onPress={() => {
            router.replace(`/pages/chooseAvatar`);
          }}
          style={{
            padding: 16,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Helvetica-Bold",
              fontSize: 14,
              color: Colors.dark.primary,
              marginStart: 8,
              marginEnd: 8,
            }}
          >
            Get started
          </Text>
          <Image
            src={require("../../assets/images/arrow-right.png")}
            style={{ width: 16, height: 16, tintColor: Colors.dark.primary }}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
}
