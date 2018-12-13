import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import SpinnerButton from 'react-native-spinner-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'react-native-firebase';

export class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showEmptyFieldsMessage: false,
      showUserNotFoundMessage: false,
      enteredEmail: "",
      enteredPassword: ""
    }

    this.login = this.login.bind(this);
    this.validateInputOnceMessagesAreShown = this.validateInputOnceMessagesAreShown.bind(this);
  }

  login() {
    this.setState({loading: true}, () => {
      let emptyFields = false;
      if (this.state.enteredEmail.trim() === "" || this.state.enteredPassword === "") {
        this.setState({showEmptyFieldsMessage: true, loading: false});
        emptyFields = true;
      }

      if (!emptyFields) {
        firebase.auth().signInWithEmailAndPassword(this.state.enteredEmail, this.state.enteredPassword).then(() => {
          this.props.navigation.navigate("Main");
          this.setState({loading: false});
        }).catch((error) => {
          this.setState({loading: false});
          if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
            this.setState({showUserNotFoundMessage: true});
          }
        });
      }
    });
  }

  validateInputOnceMessagesAreShown() {
    if (this.state.showEmptyFieldsMessage) {
      if (!(this.state.enteredEmail.trim() === "" || this.state.enteredPassword === "")) {
        this.setState({showEmptyFieldsMessage: false});
      } 
    }

    if (this.state.showUserNotFoundMessage) {
      this.setState({showUserNotFoundMessage: false});
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>LoginScreen</Text>
        </View>
        {this.state.showEmptyFieldsMessage && <View style={styles.messageContainer}>
          <Icon name="alert-circle" color="#fffafa" size={20}/>
          <Text style={styles.message}>Please fill in all the fields.</Text>
        </View>}
        {this.state.showUserNotFoundMessage && <View style={styles.messageContainer}>
          <Icon name="alert-circle" color="#fffafa" size={20}/>
          <Text style={styles.message}>We can't find an account corresponding to that email and password combination.</Text>
        </View>}
        <View style={styles.loginContainer}>
          <TextInput placeholder="Email" placeholderTextColor="#fffafa" style={styles.credentialsInput} onChangeText={(enteredEmail) => {this.setState({enteredEmail}, () => this.validateInputOnceMessagesAreShown())}}/>
          <TextInput placeholder="Password" placeholderTextColor="#fffafa" style={styles.credentialsInput} secureTextEntry={true} onChangeText={(enteredPassword) => {this.setState({enteredPassword}, () => this.validateInputOnceMessagesAreShown())}}/>
          <SpinnerButton buttonStyle={styles.button} spinnerType="MaterialIndicator" isLoading={this.state.loading} onPress={this.login}>
            <Text style={styles.buttonText}>Login</Text>
          </SpinnerButton>
          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("CreateAccount")}>
              <Text style={styles.helpButtonText}>Don't have an account?</Text>
            </TouchableOpacity>
            {
              //TODO: Create a forgot password screen that will send an email link to reset password
            }
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ForgotPassword")}>
              <Text style={styles.helpButtonText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#77AD78"
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1
  },
  logo: {
    fontSize: 64,
    color: "#fffafa"
  },
  messageContainer: {
    flexDirection: "row",
    marginLeft: 20,
    alignItems: "center",
  },
  message: {
    color: "#fffafa",
    marginLeft: 5
  },
  loginContainer: {
    justifyContent: "center"
  },
  credentialsInput: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    color: "#fffafa",
    backgroundColor: "#7DBA84"
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
  },
  helpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20
  },
  helpButtonText: {
    color: "#fffafa"
  }
});