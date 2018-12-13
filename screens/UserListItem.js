import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'react-native-firebase';

export class UserListItem extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      userAlreadyFriends: false,
      stateLoaded: false
    }

    this.userAlreadyFriends = this.userAlreadyFriends.bind(this);
  }

  componentDidMount() {
    this.userAlreadyFriends();
  }

  userAlreadyFriends() {
    firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/friends").once('value').then((userListSnapshot) => {
      userListSnapshot.forEach((userSnapshot) => {
        if (userSnapshot.val() === this.props.id) {
          this.setState({userAlreadyFriends: true});
        }
      });
    }).then(() => this.setState({stateLoaded: true}));
  }

  render() {
    if (this.state.stateLoaded) {
      return (
        <View>
          <View style={{height: 1, backgroundColor: "#808080"}}></View>
          <View style={styles.userListItemContainer}>
            <Image style={styles.profilePhoto} source={{uri: this.props.profilePhotoURL}}/>
            <View style={styles.userInfoContainer}>
              <Text style={styles.name}>{this.props.name}</Text>
              <Text style={styles.bio} numberOfLines={2}>{this.props.bio}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              {!this.state.userAlreadyFriends && 
              <TouchableOpacity style={styles.button2} onPress={() => {this.props.addUserToFriendsList(); this.setState({userAlreadyFriends: true})}}>
                <Text>Add</Text>
                <Icon style={{marginLeft: 5}} name="account-plus" color="#808080" size={20}/>
              </TouchableOpacity>}
              {this.state.userAlreadyFriends &&
              <TouchableOpacity style={styles.button2} onPress={() => {this.props.removeUserFromFriendsList(); this.setState({userAlreadyFriends: false})}}>
                <Text>Remove</Text>
                <Icon style={{marginLeft: 5}} name="account-minus" color="#808080" size={20}/>
              </TouchableOpacity>}
              <TouchableOpacity style={styles.button2} onPress={() => this.props.openProfileModal()}>
                <Text>View</Text>
                <Icon name="chevron-right" color="#808080" size={20}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else {
      return <View></View>;
    }
  }
}

const styles = StyleSheet.create({
  userListItemContainer: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 10
  },
  profilePhoto: {
    width: 65,
    height: 65,
    marginRight: 10,
    marginTop: 5,
  },
  userInfoContainer: {
    flex: 5,
    marginRight: 10
  },
  name: {
    marginBottom: 5,
    fontSize: 16
  },
  bio: {
  },
  viewProfileButton: {
    flexDirection: "row",
    alignItems: "center"
  },
  button2: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonsContainer: {
    justifyContent: "space-between",
  }
})