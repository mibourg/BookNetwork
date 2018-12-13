import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import SpinnerButton from 'react-native-spinner-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'react-native-firebase';

export class CreateAccountScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showEmptyFieldsMessage: false,
      showWeakPasswordMessage: false,
      showEmailAlreadyUsedMessage: false,
      maskPassword: true,
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    };

    this.togglePasswordMasking = this.togglePasswordMasking.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.validateInputOnceMessagesAreShown = this.validateInputOnceMessagesAreShown.bind(this);
  }

  togglePasswordMasking() {
    if (this.state.maskPassword) {
      this.setState({maskPassword: false});
    } else {
      this.setState({maskPassword: true});
    }
  }

  createAccount() {
    this.setState({loading: true}, () => { 
      let emptyFields = false;
      let weakPassword = false;
      if (this.state.firstName.trim() === "" || this.state.lastName.trim() === "" || this.state.email.trim() === "" || this.state.password.trim() === "") {
        this.setState({showEmptyFieldsMessage: true, loading: false});
        emptyFields = true;
      } 
      
      if (this.state.password.length < 6) {
        this.setState({showWeakPasswordMessage: true, loading: false});
        weakPassword = true;
      } 
      
      if (!(emptyFields || weakPassword)) {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
          firebase.auth().currentUser.updateProfile({
            displayName: this.state.firstName + " " + this.state.lastName,
          });
          firebase.auth().currentUser.sendEmailVerification().then(() => {
            this.props.navigation.navigate("AccountCreated");
            this.setState({loading: false});
          });
          firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
            bio: "Tap the little icon on the right to edit your bio.",
            id: firebase.auth().currentUser.uid,
            profilePictureURL: "http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
            books: [],
            name: this.state.firstName + " " + this.state.lastName
          });
          firebase.database().ref("users/" + firebase.auth().currentUser.uid).child("name").set(this.state.firstName + " " + this.state.lastName);
        }).catch((error) => {
          this.setState({loading: false});
          if (error.code === "auth/email-already-in-use") {
            this.setState({showEmailAlreadyUsedMessage: true});
          }
        });
      }
    }); 
  }

  validateInputOnceMessagesAreShown() {
    if (this.state.showEmptyFieldsMessage) {
      if (!(this.state.firstName.trim() === "" || this.state.lastName.trim() === "" || this.state.email.trim() === "" || this.state.password.trim() === "")) {
        this.setState({showEmptyFieldsMessage: false});
      } 
    }
    
    if (this.state.showWeakPasswordMessage) {
      if (this.state.password.length >= 6) {
        this.setState({showWeakPasswordMessage: false});
      }
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}} >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>We're thrilled to see you join us!</Text>
          <Text style={styles.subtitle}>We'll just take down some information really quickly.</Text>
        </View>
        {this.state.showEmptyFieldsMessage && <View style={styles.messageContainer}>
          <Icon name="alert-circle" color="#fffafa" size={20}/>
          <Text style={styles.message}>Please fill in all the fields.</Text>
        </View>}
        {this.state.showWeakPasswordMessage && <View style={styles.messageContainer}>
          <Icon name="alert-circle" color="#fffafa" size={20}/>
          <Text style={styles.message}>Your password should have at least 6 characters.</Text>
        </View>}
        {this.state.showEmailAlreadyUsedMessage && <View style={styles.messageContainer}>
          <Icon name="alert-circle" color="#fffafa" size={20}/>
          <Text style={styles.message}>The provided email address is already in use.</Text>
        </View>}
        <View style={styles.accountInformationContainer}>
          <TextInput placeholder="First Name" placeholderTextColor="#fffafa" style={styles.credentialsInput} onChangeText={(firstName) => this.setState({firstName}, () =>  this.validateInputOnceMessagesAreShown())}/>
          <TextInput placeholder="Last Name" placeholderTextColor="#fffafa" style={styles.credentialsInput} onChangeText={(lastName) => this.setState({lastName}, () =>  this.validateInputOnceMessagesAreShown())} />
          <TextInput placeholder="Email" placeholderTextColor="#fffafa" style={styles.credentialsInput} onChangeText={(email) => {this.setState({email}, () =>  this.validateInputOnceMessagesAreShown()); this.setState({showEmailAlreadyUsedMessage: false})}}/>
          <View style={styles.passwordInputContainer}>
            <TextInput placeholder="Password" placeholderTextColor="#fffafa" style={styles.passwordInput} secureTextEntry={this.state.maskPassword} onChangeText={(password) => this.setState({password}, () =>  this.validateInputOnceMessagesAreShown())}/>
            <TouchableOpacity style={styles.passwordMaskButton} onPress={this.togglePasswordMasking}>
              <Icon name={this.state.maskPassword ? "eye" : "eye-off"} color="#fffafa" size={20}/> 
            </TouchableOpacity>
          </View>
          <SpinnerButton buttonStyle={styles.button} spinnerType="MaterialIndicator" isLoading={this.state.loading} onPress={this.createAccount}>
            <Text style={styles.buttonText}>Create Your Account</Text>
          </SpinnerButton>
          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
              <Text style={styles.helpButtonText}>Already have an account?</Text>
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
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    color: "#fffafa",
    textAlign: "center"
  },
  subtitle: {
    fontSize: 20,
    color: "#fffafa",
    textAlign: "center"
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
  accountInformationContainer: {
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
  passwordInputContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginHorizontal: 20,
    paddingLeft: 10,
    marginVertical: 10,
    backgroundColor: "#7DBA84"
  },
  passwordInput: {
    flexGrow: 1,
    fontSize: 16,
    color: "#fffafa"
  },
  passwordMaskButton: {
    width: 50,
    justifyContent: "center",
    alignItems: "center"
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
  loadingIcon: {
    marginVertical: 23,
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