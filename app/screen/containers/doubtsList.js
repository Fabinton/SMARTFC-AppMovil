import React, { Component } from "react";
import { FlatList, RefreshControl, Alert } from "react-native";
import Layout from "../../components/suggestion-list-layout";
import Empty from "../../components/empty";
import Separator from "../../components/separator";
import Suggestion from "../components/doubtComponents";
import { connect } from "react-redux";
import API from "../../../utils/api";

function mapStateToProps(state) {
  return {
    list: state.videos.subject,
    duda: state.videos.duda,
    ipconfig: state.videos.selectedIPConfig,
    student: state.videos.selectedStudent,
    internetConnection: state.connection.isConnected,
    loading: state.connection.loading,
  };
}

class SuggestionList extends Component {
  renderEmpty = () => (
    <Empty text="No hay materias asociadas al colegio"></Empty>
  );
  itemSeparatos = () => (
    <Separator text="No hay materias asociadas al colegio"></Separator>
  );
  viewContenido = (item) => {};
  renderItem = ({ item }) => {
    return (
      <Suggestion
        {...item}
        onPress={() => {
          this.viewContenido(item);
        }}
      />
    );
  };
  keyExtractor = (item) => item.id_duda.toString();
  async getAllDoubts() {
    if (this.props.internetConnection) {
      this.props.dispatch({
        type: "SET_LOADING",
        payload: true,
      });
      const body = {
        id_estudiante: this.props.student.id_estudiante,
      };
      await API.allDoubtsStudents(this.props.ipconfig, body)
        .then(({ data }) => {
          this.props.dispatch({
            type: "SET_DOUBT_LIST",
            payload: {
              data,
            },
          });
        })
        .catch((e) => {
          Alert.alert(
            "Error",
            "Error al traer las dudas del servidor.",
            [{ text: "OK", onPress: () => {} }],
            { cancelable: false }
          );
        })
        .finally(() => {
          this.props.dispatch({
            type: "SET_LOADING",
            payload: false,
          });
        });
    } else {
      Alert.alert(
        "Error",
        "Recuerda que debes tener conexión a internet para sincronizar las preguntas.",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  }
  render() {
    let data = [];
    data = this.props.duda;

    return (
      <Layout
        title="Tus Dudas"
        onPress={() => {
          this.getAllDoubts();
        }}
      >
        <FlatList
          keyExtractor={this.keyExtractor}
          data={data}
          ListEmptyComponent={this.renderEmpty}
          ItemSeparatorComponent={this.itemSeparatos}
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={() => {
                this.getAllDoubts();
              }}
            />
          }
        />
      </Layout>
    );
  }
}
export default connect(mapStateToProps)(SuggestionList);
