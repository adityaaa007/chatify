import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";

type Data = {
  visible: boolean;
  onClose: () => void;
  message: string;
};

const CustomAlert = ({ visible, onClose, message }: Data) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.alert}>
            <Text style={{ color: "white", fontFamily: "Helvetica" }}>
              {message}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{ marginTop: 16, padding: 8 }}
            >
              <Text
                style={{
                  color: Colors.dark.primary,
                  fontFamily: "Helvetica-Bold",
                  fontSize: 14,
                }}
              >
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alert: {
    paddingVertical: 32,
    backgroundColor: "black",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
});

export default CustomAlert;
