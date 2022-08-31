import React, { Component } from "react";
import Header from "../components/header";
import SuggestionList from "../containers/suggestion-list";
import { StyleSheet } from "react-native";
import API from "../../utils/api";
import { connect } from "react-redux";

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header onPress={() => navigation.openDrawer()}>Contenido REA</Header>
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      contenidos: [],
    };
  }
  async componentDidMount() {
    const contenido = await API.getContent(this.props.ipconfig);
    this.props.dispatch({
      type: "SET_CONTENTS_LIST",
      payload: {
        contenido,
      },
    });
  }
  render() {
    return <SuggestionList />;
  }
}

const styles = StyleSheet.create({
  texto: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
function mapStateToProps(state) {
  return {
    student: state.videos.selectedStudent,
    ipconfig: state.videos.selectedIPConfig,
  };
}

export default connect(mapStateToProps)(Home);
