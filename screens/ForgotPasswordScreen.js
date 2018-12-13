import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import SpinnerButton from 'react-native-spinner-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'react-native-firebase';

export class ForgotPasswordScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#8FD694"
    },
    headerTintColor: "#fffafa"
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showEmptyFieldMessage: false,
      showUserNotFoundMessage: false,
      enteredEmail: ""
    }

    this.resetPassword = this.resetPassword.bind(this);
    this.validateInputOnceMessagesAreShown = this.validateInputOnceMessagesAreShown.bind(this);
  }

  resetPassword() {
    this.setState({loading: true}, () => {
      let emptyField = false;
      if (this.state.enteredEmail.trim() === "") {
        this.setState({showEmptyFieldMessage: true, loading: false});
        emptyField = true;
      }

      if (!emptyField) {
        firebase.auth().sendPasswordResetEmail(this.state.enteredEmail).then(() => {
          this.props.navigation.navigate("PasswordResetLinkSent");
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
    if (this.state.showEmptyFieldMessage) {
      if (!(this.state.enteredEmail.trim() === "")) {
        this.setState({showEmptyFieldMessage: false});
      } 
    }

    if (this.state.showUserNotFoundMessage) {
      this.setState({showUserNotFoundMessage: false});
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{flexGrow: 1, justifyContent: "center"}}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Enter your email below and we'll send you a link to reset your password!</Text>
        </View>
        {this.state.showEmptyFieldMessage && <View style={styles.messageContainer}>
          <Icon name="alert-circle" color="#fffafa" size={20}/>
          <Text style={styles.message}>Please fill in the email field.</Text>
        </View>}
        {this.state.showUserNotFoundMessage && <View style={styles.messageContainer}>
          <Icon name="alert-circle" color="#fffafa" size={20}/>
          <Text style={styles.message}>We can't find an account corresponding to that email.</Text>
        </View>}
        <TextInput placeholder="Email" placeholderTextColor="#fffafa" style={styles.credentialsInput} onChangeText={(enteredEmail) => {this.setState({enteredEmail}, () => this.validateInputOnceMessagesAreShown())}}/>
        <SpinnerButton buttonStyle={styles.button} spinnerType="MaterialIndicator" isLoading={this.state.loading} onPress={this.resetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </SpinnerButton>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#77AD78",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    marginHorizontal: 10,
    textAlign: "center",
    fontSize: 24,
    color: "#fffafa"
  },
  messageContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 20,
    alignItems: "center",
  },
  message: {
    color: "#fffafa",
    marginLeft: 5
  },
  credentialsInput: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 20,
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
  }
});