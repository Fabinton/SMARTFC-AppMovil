import React, { Component } from "react";
import ContenidoLayout from "../components/detailActivity";
import { StyleSheet, Button } from "react-native";
import Close from "../../components/close";
import Details from "../../components/detailActivity";
import { Animated } from "react-native";
import { connect } from "react-redux";
import Player from "../../containers/player-activity";
import * as FileSystem from "expo-file-system";
import shorthash from "shorthash";
//import Audio from '../../containers/audio-activity';
import { NavigationActions } from "react-navigation";
import Reader from "../../containers/reader-excersise";
import HeaderReturn from "../../components/headerReturn";
import QuestionActivity from "../../components/QuestionActivity";

class playExcercise extends Component {
  state = {
    opacity: new Animated.Value(0),
  };
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          Visualiza tu contenido
        </HeaderReturn>
      ),
    };
  };
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1000,
    }).start();
  }
  render() {
    if (this.props.activity.taller == "1") {
      return (
        <Animated.View style={{ flex: 1, opacity: this.state.opacity }}>
          <ContenidoLayout>
            <Reader {...this.props.activity} />
            <QuestionActivity
              style={{ position: "absolute", top: "70%", left: "-17%" }}
            />
          </ContenidoLayout>
        </Animated.View>
      );
    } else {
      return (
        <Button title="Regresa" onPress={() => this.continuarContenido()} />
      );
    }
  }
}
function mapStateToProps(state) {
  return {
    activity: state.videos.selectedActivity,
  };
}
export default connect(mapStateToProps)(playExcercise);
