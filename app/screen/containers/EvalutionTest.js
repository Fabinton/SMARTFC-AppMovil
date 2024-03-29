import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { Stack } from "@react-native-material/core";
import CustomButton from "../../components/customButton";
import { useSelector } from "react-redux";
import { createEvaluation } from "../../../utils/parsers";

const EvalutionTest = ({ navigation, route }) => {
  const [evaluationStep, setEvaluationStep] = useState(0);
  const [index, setIndex] = useState(0);
  const [StartCounting, setStartCounting] = useState(false);
  const { selectedActivity, selectedStudent, selectedIPConfig } = useSelector(
    (state) => state.videos
  );
  const { isConnected } = useSelector((state) => state.connection);
  const test = useMemo(() => selectedActivity, [selectedActivity]);
  const student = useMemo(() => selectedStudent, [selectedStudent]);
  const connection = useMemo(() => isConnected, [isConnected]);
  const alredyTested = false;
  const evaluationType = route?.params?.toRender === 0 ? true : false;
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % (35 + 1));
    }, 1000);
    if (StartCounting && index === 35) {
      setTimeout(() => {
        setEvaluationStep(evaluationStep + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [index]);
  const { evaluation } = createEvaluation(test, evaluationType);
  const questionCount = evaluation.length;
  //console.log(questionCount);
  return (
    <>
      {alredyTested ? (
        <View>
          <Stack
            style={styles.container}
            direction="column"
            alignItems="center"
          >
            <Text style={styles.text}>¡Oh no!</Text>
            <Text style={styles.text2}>
              Parece que ya respondiste la evaluación, recuerda que sólo puedes
              responderla una única vez.
            </Text>
            <Image
              style={{
                width: 320,
                height: 350,
                marginTop: 40,
              }}
              source={require("../../../assets/images/sad.png")}
            />
          </Stack>
        </View>
      ) : (
        <View>
          <Stack
            style={styles.container}
            direction="column"
            alignItems="center"
          >
            <Text style={styles.text}>Instrucciones:</Text>
            <Text style={styles.text2}>
              1. Podrás realizar la evaluación solo una vez {"\n"}
              {"\n"}
              2. Selecciona una única respuesta {"\n"}
              {"\n"}
              3. El resultado estará basado en si la respuesta es correcta o no
              y en el tiempo que tomes en responder {"\n"}
            </Text>
            <CustomButton
              text="Jugar"
              onPress={() => {
                setEvaluationStep(1);
                setStartCounting(true);
                setIndex(0);
              }}
            />
            <Image
              style={{
                width: 320,
                height: 350,
                position: "absolute",
                top: "110%",
              }}
              source={require("../../../assets/images/expTest.png")}
            />
          </Stack>
          {evaluation?.map((eva) => {
            //console.log("97 evaluacion ya " + eva.step+ " questions "+ eva.question);
            if (evaluationStep === eva.step) {
              //console.log("preguntas "+ questionCount);
              navigation.navigate({
                name: "GamificationEvaluation",
                params: {
                  question: eva.question,
                  answers: eva.answers,
                  correct: eva.correct,
                  setEvaluationStep: setEvaluationStep,
                  evaluationStep: evaluationStep,
                  index: index,
                  setIndex: setIndex,
                  evaluationType: evaluationType,
                  IDstudent: student.id_estudiante,
                  IDactivity: test.id_actividad,
                  internetConnection: connection,
                  selectedIPConfig: selectedIPConfig,
                  valorEvaluation :questionCount,
                },
              });
            }            
          })}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  text2: {
    paddingTop: 20,
    fontSize: 20,
    textAlign: "center",
    color: "#6D6E6E",
  },
});

export default EvalutionTest;
