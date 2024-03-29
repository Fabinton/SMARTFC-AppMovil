import React,{Component} from 'react';
import { StyleSheet, Text, View, Button, WebView , Linking} from 'react-native';
import Constants from 'expo-constants'
import {connect} from 'react-redux';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("db5.db");

class Player extends Component{
    constructor(props) {
      super(props);
    }
    state = {
      mute: false,
      shouldPlay: false,
      storage: null,
      storageFilter:null,
      storageFlats: null,
    }
    componentDidMount(){
      db.transaction(tx => {
        //julieth
        tx.executeSql(
          "create table if not exists comentarios (id_CREA int, id_estudiante int, comentario text );"
        );
        tx.executeSql(
            "create table if not exists nivelsatisfaccion (id_CREA integer, id_estudiante int,contenido int,calidad int,diseño int,motivacion int,sonido int);"
          );
        tx.executeSql("select * from comentarios", [], (_, { rows: { _array } }) =>
          this.setState({ storage: _array })
        );
        tx.executeSql(
            `select * from nivelsatisfaccion ;`,
            [],
            (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
          );
      });  
    }
    almacenaNivelSatisfaccion(){
      db.transaction(tx => {
          tx.executeSql(
            `select * from comentarios where id_estudiante=? and id_CREA=?;`,
              [this.props.student.id_estudiante,this.props.contents.id_CREA],
            (_, { rows: { _array } }) => this.setState({ storageFilter: _array })
          );
      });

      var storageFilterGood = this.state.storageFilter;
      var storageFilter = storageFilterGood.reverse();

      if(storageFilter.length==0){
        //console.log("Entro a Cero")
          resultado = [{
            id_CREA: 0,
            id_estudiante: 0,
            contenido: 0,
            calidad: 0,
            diseño: 0,
            motivacion: 0,
            sonido: 0,
          }]
      }
      if(storageFilter.length!=0){
          resultado = Array.from(new Set(storageFilter.map(s => s.id_CREA )))
          .map(id_CREA => {
            return {
              id_CREA: id_CREA,
              id_estudiante: storageFilter.find(s => s.id_actividad === id_actividad && d.id_estudiante === id_estudiante).id_estudiante,
              contenido: storageFilter.find(s => s.id_actividad === id_actividad).contenido,
              calidad: storageFilter.find(s => s.id_actividad === id_actividad).calidad,
              diseño: storageFilter.find(s => s.id_actividad === id_actividad).diseño,
              motivacion: storageFilter.find(s => s.id_actividad === id_actividad).motivacion,
              sonido: storageFilter.find(s => s.id_actividad === id_actividad).sonido
            };
          });
      }
      db.transaction(
          tx => {
            tx.executeSql("insert into events (data_start, hour_start, data_end, hour_end, id_actividad, id_estudiante, check_download, check_inicio, check_fin, check_answer, count_video, check_video, check_document, check_a1, check_a2, check_a3, check_profile, check_Ea1, check_Ea2, check_Ea3) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
             [dataComplete,hoursComplete,dataComplete,hoursComplete, this.props.activity.id_actividad, this.props.student.id_estudiante,resultado[0].check_download,resultado[0].check_inicio,0,resultado[0].check_answer,resultado[0].count_video+1,1,0,resultado[0].check_a1,resultado[0].check_a2,resultado[0].check_a3,0,resultado[0].check_Ea1,resultado[0].check_Ea2,resultado[0].check_Ea3]);
          },
          null,
          null
      );
      db.transaction(tx => {
          tx.executeSql(
            `select * from events ;`,
              [],
            (_, { rows: { _array } }) => this.setState({ storage: _array })
          );
      });
      //console.log(this.state.storage [this.state.storage.length-1]);
      this.update();    
  }
  updateFlat(){
    db.transaction(tx => {
        tx.executeSql(
          `select * from flatEvent ;`,
          [],
          (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
        );
      });
    //console.log(this.state.storageFlats);
  }
  update() {
      db.transaction(tx => {
        tx.executeSql(
          `select * from events ;`,
          [],
          (_, { rows: { _array } }) => this.setState({ storage: _array })
        );
      });
      //console.log(this.state.storage[this.state.storage.length-1]);
      db.transaction(
          tx => {
            tx.executeSql(`insert into flatEvent (id_evento, upload) values (?, ?)`,
            [this.state.storage[this.state.storage.length-1].id_evento,0]);
          },
          null,
          null
      );
      db.transaction(tx => {
          tx.executeSql(
            `select * from flatEvent ;`,
            [],
            (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
          );
        });
        this.updateFlat();
  }
    _handlePress = () => {
      this.almacenaMetrica();
      var uristring = this.props.urldocumento;
      var ip = this.props.ipconfig;
      var uri = 'http://'+ip+":3000"+uristring.substr(28);
    
      Linking.openURL(uri);
      this.props.onPress && this.props.onPress();
    };
    render() {
      //const url = this.props.descripcion_CREA;
      //console.log(this.props.descripcion_CREA);
      return (
        <View style={styles.container}>
          <Text {...this.props} onPress={this._handlePress}>
            Download Your PDF
          </Text>
        </View>
      );
    }
  }
  
  
  const styles = StyleSheet.create({
      video:{
          left:0,
          right:0,
          bottom:0,
          top:0,
          width:400,
          height: 200
      },
      container:{
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
      }
  })
  function mapStateToProps(state){
    return{
      ipconfig: state.videos.selectedIPConfig,
      activity:state.videos.selectedActivity,
      student:state.videos.selectedStudent
    }
  }
  export default connect(mapStateToProps) (Player);
  