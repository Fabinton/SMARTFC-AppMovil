import { connect } from "react-redux";
import { createReduxContainer } from "react-navigation-redux-helpers";
import { CommonActions } from "@react-navigation/native";
import { BackHandler } from "react-native";
import NewAppNavigator from "./NewAppNavigator";

const ReduxifyApp = createReduxContainer(NewAppNavigator);

class AppNavigatorWithState extends ReduxifyApp {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };
  onBackPress = () => {
    // cuando le piques al back de android

    this.props.dispatch(
      CommonActions.back({
        key: null,
      })
    );
    return true;
  };
}

function mapStateToProps(state) {
  return {
    state: state.navigation,
  };
}
export default connect(mapStateToProps)(AppNavigatorWithState);
