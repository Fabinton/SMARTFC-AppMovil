import React, { Component } from "react";
import { Video } from "expo-av";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import Layout from "../components/layout";
import shorthash from "shorthash";
import * as FileSystem from "expo-file-system";
import { connect } from "react-redux";
import { Dimensions } from "react-native";
import { ScreenOrientation } from "expo";

const BASE_API_EVENTS = "http://192.168.190.51:3000/createEventos";

class Player extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    mute: false,
    shouldPlay: false,
  };
  handlePlayAndPause = async () => {
    this.setState((prevState) => ({
      shouldPlay: !prevState.shouldPlay,
    }));
  };
  handleVolume = async () => {
    this.setState((prevState) => ({
      mute: !prevState.mute,
    }));
  };

  setOrientation() {
    if (Dimensions.get("window").height > Dimensions.get("window").width) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }

  componentDidMount = async () => {
    console.log(this.props.urlrepositorio);
    //const uri = this.props.urlrepositorio;
    var uristring = this.props.urlrepositorio;
    var ip = this.props.ipconfig;
    var uri = "http://" + ip + ":3000" + uristring.substr(28);

    console.log(uri);
    const name = shorthash.unique(uri);
    const path = `${FileSystem.cacheDirectory}${name}`;
    const video = await FileSystem.getInfoAsync(path);
    if (video.exists) {
      this.setState({
        source: {
          uri: video.uri,
        },
      });
      return;
    }
    const newVideo = await FileSystem.downloadAsync(uri, path);
    this.setState({
      source: {
        uri: newVideo.uri,
      },
    });
  };
  render() {
    //const url = this.props.descripcion_CREA;
    //console.log(this.props.descripcion_CREA);
    return (
      <View>
        <Video
          source={this.state.source}
          shouldPlay={this.state.shouldPlay}
          resizeMode="contain"
          style={styles.video}
          isMuted={this.state.mute}
          useNativeControls
          onFullscreenUpdate={this.setOrientation}
          posterSource={this.state.source}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  video: {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    width: 400,
    height: 200,
  },
  container: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#272D34",
  },
});
function mapStateToProps(state) {
  return {
    contenido: state.selectedContenido,
    ipconfig: state.videos.selectedIPConfig,
  };
}
export default connect(mapStateToProps)(Player);
