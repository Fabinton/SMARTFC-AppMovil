import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Alert } from "react-native";
import { connect } from "react-redux";
import HeaderReturn from "../../components/headerReturn";
import CustomButton from "../../components/customButton";
import { Stack, Flex, Spacer } from "@react-native-material/core";
import { getLocalEventsByStudent } from "../../../utils/parsers";

class selectMoment extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          Selecciona la etapa
        </HeaderReturn>
      ),
    };
  };

  detailActivity() {
    this.props.navigation.navigate({
      name: "DetailActivitySubj",
    });
  }
  excersiceActivity() {
    if (this.props.activity.taller == 1) {
      this.props.navigation.navigate({
        name: "PlayExcersise",
      });
    } else {
      Alert.alert(
        "Taller",
        "El taller no esta disponible en este momento",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
    }
  }

  async evaluationActivity() {
    const localEvents = await getLocalEventsByStudent(
      this.props.student.id_estudiante,
      this.props.activity.id_actividad
    );
    const lastEvent = localEvents?.reverse();
    if (this.props.activity.evaluacion == 1 && !lastEvent[0]?.check_fin) {
      this.props.navigation.navigate({
        name: "EvalutionTest",
        params: { toRender: 0 },
      });
    } else if (lastEvent[0]?.check_fin) {
      Alert.alert(
        "Evaluacion",
        "La evaluación ya ha sido realizada.",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Evaluacion",
        "La evaluación no esta disponible en este momento",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
    }
  }

  retroalimentacionActivity() {
    if (this.props.activity.retroalimentacion == 1) {
      this.props.navigation.navigate({
        name: "SelectRetroalimentacion",
      });
    } else {
      Alert.alert(
        "Retroalimentacion",
        "La retroalimentacion no esta disponible en este momento",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    return (
      <Stack
        style={styles.container}
        direction="column"
        alignItems="stretch"
        spacing={6}
      >
        <View style={styles.box0}>
          <Text style={styles.textActivity}>
            {this.props.activity.titulo_actividad}
          </Text>
          <Spacer />
          <Flex inline center>
            <Text style={styles.textSelected}>
              Selecciona {"\n"} una etapa {"\n"}para {"\n"}continuar
            </Text>
            <Image
              style={{
                width: 200,
                height: 250,
              }}
              source={require("../../../assets/images/saludo.png")}
            />
          </Flex>
          <Spacer />
          <CustomButton
            text="PRACTICA EN CASA"
            onPress={() => this.detailActivity()}
          />
          <Spacer />
          <CustomButton
            text="PRACTICA EN CLASE"
            onPress={() => this.excersiceActivity()}
          />
          <Spacer />
          <CustomButton
            text="REALIZA TU EXAMEN"
            onPress={() => this.evaluationActivity()}
          />
          <Spacer />
          <CustomButton
            text="RETROALIMENTACION"
            onPress={() => this.retroalimentacionActivity()}
          />
          <Spacer />
        </View>
      </Stack>
    );
  }
}
const styles = StyleSheet.create({
  dialogo: {
    position: "absolute",
    width: 270,
    height: 270,
    top: "20%",
    left: "0%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C2C2C",
    borderColor: "black",
  },
  box0: {
    flex: 11,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  textSelected: {
    marginLeft: 50,
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C2C2C",
    textAlign: "center",
  },
  textActivity: {
    marginTop: 35,
    fontSize: 25,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
});

function mapStateToProps(state) {
  return {
    student: state.videos.selectedStudent,
    activity: state.videos.selectedActivity,
    ipconfig: state.videos.selectedIPConfig,
  };
}
export default connect(mapStateToProps)(selectMoment);
