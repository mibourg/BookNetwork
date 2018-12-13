import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import firebase from 'react-native-firebase';

export class SplashScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    if (firebase.auth().currentUser !== null) {
      this.props.navigation.navigate("Main");
    } else {
      this.props.navigation.navigate("Login");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#fffafa" size="large"/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#77AD78",
    justifyContent: "center"
  }
});