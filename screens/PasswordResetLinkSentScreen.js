import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import firebase from 'react-native-firebase';

export class PasswordResetLinkSentScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
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
          <Text style={styles.title}>Alright!</Text>
          <Text style={styles.subtitle}>To reset your password, follow the link in the email we just sent you.</Text> 
        </View>
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Login</Text>
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
    marginVertical: 10,
    fontSize: 64,
    color: "#fffafa",
    textAlign: "center"
  },
  subtitle: {
    marginVertical: 10,
    fontSize: 24,
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