import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'react-native-firebase';
import { ScrollView } from 'react-native-gesture-handler';

export class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.navigation.navigate("Splash");
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate("Login");
    }).catch((error) => {
      this.props.navigation.navigate("Profile");
    });
  }

  render() {
    return (
      <ScrollView>
        <TouchableOpacity style={styles.button} onPress={this.logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#77AD78",
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 15,
    borderRadius: 5,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "#fffafa",
    fontSize: 20
  }
});