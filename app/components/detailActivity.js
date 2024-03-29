import React from "react";
import { View, Text, StyleSheet } from "react-native";

function Details(props) {
  return (
    <View>
      <Text style={styles.texto}>{props.titulo_actividad}</Text>
      <Text style={styles.grado}>{props.descripcion_actividad}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  texto: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 10,
    marginLeft: 10,
    textAlign: "center",
  },
  grado: {
    fontWeight: "bold",
    color: "#9C9C9C",
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
  },
});

export default Details;
