import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";
import LoadingModal from "./LoadingModal";
import { useSelector } from "react-redux";
import CheckConnection from "./CheckConnection";
function HeaderReturn(props) {
  const { loading } = useSelector((state) => state.connection);
  return (
    <>
      <View>
        <StatusBar backgroundColor="#272D34" barStyle="light-content" />
        <SafeAreaView style={style.statusBar}></SafeAreaView>
        <View style={style.bar}>
          <View style={style.container}>
            <TouchableOpacity onPress={() => props.goBack()}>
              <Ionicons
                name="md-arrow-back"
                size={32}
                color="white"
                style={style.menu}
              />
            </TouchableOpacity>
            <View style={style.center}>
              <Text style={style.texto}>{props.children}</Text>
            </View>
          </View>
        </View>
        <CheckConnection />
      </View>
      {loading && <LoadingModal />}
    </>
  );
}
const style = StyleSheet.create({
  menu: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
  bar: {},
  statusBar: {
    paddingTop: 0,
    marginTop: -15,
    height: 0,
    backgroundColor: "#272D34",
  },
  container: {
    backgroundColor: "#272D34",
    padding: 10,
    flexDirection: "row",
  },
  center: {
    flex: 1,
    padding: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  texto: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10,
  },
});
export default HeaderReturn;
