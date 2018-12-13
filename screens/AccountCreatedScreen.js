import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, BackHandler} from 'react-native';
import firebase from 'react-native-firebase';

export class AccountCreatedScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      currentUser: firebase.auth().currentUser
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => true);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => true);
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Hi, {this.state.currentUser.displayName.split(" ")[0]}!</Text>
          <Text style={styles.subtitle}>Your brand new account was created.</Text> 
          <Text style={styles.subtitle}>We've sent you a verification email, but in the mean time, you're automatically logged in!</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("Main")}>
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#77AD78",
    justifyContent: "center"
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10
  },
  title: {
    fontSize: 32,
    color: "#fffafa",
    textAlign: "center"
  },
  subtitle: {
    marginVertical: 10,
    fontSize: 20,
    color: "#fffafa",
    textAlign: "center"
  },
  button: {
    borderRadius: 5,
    backgroundColor: "#8FD694",
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 15,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "#fffafa",
    fontSize: 20
  }
});