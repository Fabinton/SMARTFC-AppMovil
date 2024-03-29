import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  BackHandler,
  Alert,
  LogBox,
} from "react-native";
import CustomButton from "../../components/customButton";
import React, { useEffect, useState } from "react";
import { calculateTestGrade, saveEventsDB } from "../../../utils/parsers";
import { useDispatch } from "react-redux";
import { Audio } from "expo-av";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const GamificationTest = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [allAnswers, setAllAnswers] = useState({});
  const [evaScore, setEvaScore] = useState(0);
  const [sound, setSound] = useState();
  const [clockSound, setClockSound] = useState();
  const {
    setIndex,
    question,
    answers,
    setQuizStep,
    quizStep,
    index,
    evaluationType,
    IDstudent,
    IDactivity,
    internetConnection,
    selectedIPConfig,
  } = route?.params;
  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  const alertMessage = () => {
    return Alert.alert(
      "Felicitaciones.",
      "El quiz ha sido completado, Recuerda que si no tienes acceso a internet, debes sincronizar desde mis cursos en el futuro.",
      [
        {
          text: "Ir a Mis materias.",
          onPress: () => {
            saveEventsDB(
              IDstudent,
              IDactivity,
              allAnswers,
              evaScore,
              evaluationType,
              internetConnection,
              selectedIPConfig,
              dispatch,
              navigation
            );
          },
        },
      ],
      { cancelable: false }
    );
  };
  useEffect(() => {
    index === 35 &&
      (() => {
        answers?.map((ans) => setAllAnswers({ ...allAnswers, [ans.res]: 0 }));
        setEvaScore(evaScore + calculateTestGrade(0, 4, index, evaluationType));
      })();
    if (index === 35 && quizStep >= 3) {
      alertMessage();
    }
    if (index === 28) playClockSound();
  }, [index]);

  const completedTest = () => {
    if (quizStep >= 3) {
      alertMessage();
    }
  };

  useEffect(() => {
    completedTest();
  }, [allAnswers]);

  async function playButtonSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/sounds/buttonClick.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }
  async function playClockSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/sounds/clock-ticking.mp3")
    );
    setClockSound(sound);
    await sound.playAsync();
  }
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  useEffect(() => {
    return clockSound
      ? () => {
          clockSound.unloadAsync();
        }
      : undefined;
  }, [clockSound]);
  return (
    <View style={styles.viewContainer}>
      <View style={styles.questionAnswer}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question}</Text>
        </View>
        <View style={styles.answersContainer}>
          {answers?.map((ans) => (
            <View style={{ marginBottom: 5 }} key={ans.id}>
              <CustomButton
                text={ans.question}
                onPress={() => {
                  playButtonSound();
                  clockSound && clockSound.unloadAsync();
                  setAllAnswers({
                    ...allAnswers,
                    [`  ${ans.question}` + ans.question]: ans.id, //to prevent automatic sort of javascript it key its a number.
                  });
                  const totalValue = calculateTestGrade(
                    ans.id,
                    ans.correctAns,
                    index,
                    evaluationType
                  );
                  setQuizStep(quizStep + 1);
                  setIndex(0);
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    backgroundColor: "#3E454D",
  },
  questionAnswer: {
    display: "flex",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "column",
  },
  questionContainer: {
    paddingHorizontal: 30,
    height: 180,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  answersContainer: {
    marginTop: 100,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    marginHorizontal: 55,
  },
  questionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#70C2E5",
  },
});

export default GamificationTest;
