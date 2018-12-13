import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Image, ImageBackground, Platform, FlatList, ScrollView, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import firebase from 'react-native-firebase';
import { UserListItem } from './UserListItem';
import { BookListItem } from './BookListItem';
import CompleteFlatList from 'react-native-complete-flatlist';


export class PeopleScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      currentUser: firebase.auth().currentUser,
      displayedUsers: [],
      viewProfile: false,
      viewingUser: {},
      viewingUserBooks: [],
      viewingUserDisplayedBooks: [],
      viewBook: false,
      viewingBook: {},
      viewAllBooks: false,
      gotUsers: false
    }

    this.fetchDisplayedUsers = this.fetchDisplayedUsers.bind(this);
    this.openProfileModal = this.openProfileModal.bind(this);
    this.openBookModal = this.openBookModal.bind(this);
    this.shuffleArray = this.shuffleArray.bind(this);
    this.getThreeRandomBooks = this.getThreeRandomBooks.bind(this);
    this.addUserToFriendsList = this.addUserToFriendsList.bind(this);
    this.removeUserFromFriendsList = this.removeUserFromFriendsList.bind(this);
    this.renderUser = this.renderUser.bind(this);
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.setState({
        currentUser: firebase.auth().currentUser,
        displayedUsers: [],
        viewProfile: false,
        viewingUser: {},
        viewingUserBooks: [],
        viewingUserDisplayedBooks: [],
        viewBook: false,
        viewingBook: {},
        viewAllBooks: false, 
        gotUsers: false
      });
      this.fetchDisplayedUsers();
    });
  }

  fetchDisplayedUsers() {
    firebase.database().ref("users/").once('value').then((userListSnapshot) => {
      userListSnapshot.forEach((userSnapshot) => {
        let isFriend = false;
        firebase.database().ref("users/" + this.state.currentUser.uid + "/friends").once('value').then((friendListSnapshot) => {
          friendListSnapshot.forEach((friendSnapshot) => {
            if (friendSnapshot.val() === userSnapshot.key) {
              isFriend = true;
            }
          });
        }).then(() => {
          if (isFriend) {
            this.setState(previousState => ({
              displayedUsers: [...previousState.displayedUsers, userSnapshot.val()]
            }));
          }
        });
      });
    }).then(() => this.setState({gotUsers: true}));
  }

  openProfileModal(user) {
    firebase.database().ref("users/" + user.id + "/books").once('value').then((bookListSnapshot) => {
      bookListSnapshot.forEach((bookSnapshot) => {
        this.setState(previousState => ({
          viewingUserBooks: [...previousState.viewingUserBooks, bookSnapshot.val()]
        }));
      });
    }).then(() => {
      this.getThreeRandomBooks();
      this.setState({
        viewProfile: true,
        viewingUser: user
      });
    });
  }

  shuffleArray(givenArray) {
    let array = [...givenArray];
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  getThreeRandomBooks() {
    let randomBooks = this.shuffleArray(this.state.viewingUserBooks).slice(0, 3);
    this.setState({
      viewingUserDisplayedBooks: randomBooks
    });
  }

  openBookModal(book) {
    this.setState({
      viewBook: true,
      viewingBook: book
    });
  }

  addUserToFriendsList(user) {
    firebase.database().ref("users/" + this.state.currentUser.uid + "/friends/").child(user.id).set(user.id);
  }

  removeUserFromFriendsList(user) {
    firebase.database().ref("users/" + this.state.currentUser.uid + "/friends/").child(user.id).remove();
  }
  
  renderUser(data, index) {
    const item = data.cleanData ? data.cleanData : data;
    return <UserListItem addUserToFriendsList={() => this.addUserToFriendsList(item)} removeUserFromFriendsList={() => this.removeUserFromFriendsList(item)} id={item.id} profilePhotoURL={item.profilePictureURL} name={item.name} bio={item.bio} openProfileModal={() => this.openProfileModal(item)}/>
  }

  //TODO: Could use a complete flat list for searching through friends list
  render() {
    if (this.state.gotUsers) {
      return (
        <View>

          <Modal isVisible={this.state.viewProfile} onBackButtonPress={() => this.setState({viewProfile: false, viewingUser: {}, viewingUserBooks: []})}>
            <ScrollView style={styles.profileContainer}>
              <View style={styles.profileHeaderContainer}>
                <View style={styles.profileHeader}>
                  <TouchableOpacity style={{position: "absolute", marginTop: 15, marginLeft: 15}} onPress={() => this.setState({viewProfile: false, viewingUser: {}, viewingUserBooks: []})}>
                    <Icon name="close" color="#fffafa" size={20}/>
                  </TouchableOpacity>  
                </View>
                <View style={styles.profilePictureContainer}>
                  <Image style={styles.profilePicture} source={{uri: this.state.viewingUser != null ? this.state.viewingUser.profilePictureURL : null}}/>
                </View>
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{this.state.viewingUser != null ? this.state.viewingUser.name : ""}</Text>
              </View>
              <View style={styles.bioContainer}>
                <Text style={styles.bio}>{this.state.viewingUser != null ? this.state.viewingUser.bio : ""}</Text>
              </View>
              <View style={styles.booksContainer}>
                <Text style={styles.bookListTitle}>Books</Text>
                <FlatList keyExtractor={(item, index) => String(index)} style={styles.bookList} data={this.state.viewingUserDisplayedBooks} renderItem={({item}) => (<BookListItem index={item.id} book={item} coverURL={item.coverPhotoURL} title={item.title} summary={item.summary} openBookModal={this.openBookModal}/>)}></FlatList>
                <View style={{height: 1, backgroundColor: "#808080", marginHorizontal: 10, marginBottom: 5}}></View>
              </View>
              <View style={styles.bookListButtonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => this.setState({viewAllBooks: true})}>
                  <Text style={styles.buttonText}>View All</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>

          <Modal isVisible={this.state.viewBook} onBackButtonPress={() => this.setState({viewBook: false})}>
            <View style={styles.bookListModalContainer}>
              <View style={styles.bookModalHeader}>
                <Text style={styles.bookModalTitle}>{this.state.viewingBook.title}</Text>
                <TouchableOpacity style={{position: "absolute", marginTop: 5, marginLeft: 5}} onPress={() => this.setState({viewBook: false})}>
                  <Icon name="close" color="#808080" size={20}/>
                </TouchableOpacity>
                <View style={{height: 1, backgroundColor: "#808080"}}></View>
              </View>
              <ScrollView>
                <View style={styles.bookContainer}>
                  <Image style={styles.bookCoverPhoto} source={{uri: this.state.viewingBook.coverPhotoURL}}/>
                  <View style={styles.bookInfoContainer}>
                    <Text style={styles.bookInfo}>Author(s): {this.state.viewingBook.author}</Text>
                    <Text style={styles.bookInfo}>Pages: {this.state.viewingBook.pages}</Text>
                    <Text style={styles.bookInfo}>Published: {this.state.viewingBook.publishingDate}</Text>
                    <Text style={styles.bookInfo}>Publisher: {this.state.viewingBook.publisher}</Text>
                    <Text style={styles.bookInfo}>ISBN: {this.state.viewingBook.ISBN}</Text>
                    <Text style={styles.bookInfo}>Language: {this.state.viewingBook.language}</Text>
                    <View style={{flexDirection: "row", alignItems: "center", flexGrow: 1}}>
                      <TouchableOpacity onPress={() => Linking.openURL(this.state.viewingBook.amazonURL)} style={{marginRight: 10}}>
                        <Icon name="amazon" color="#808080" size={35}/>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => Linking.openURL(this.state.viewingBook.goodreadsURL)}>
                        <FontAwesomeIcon name="goodreads" color="#808080" size={35}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <Text style={styles.bookSummary}>{this.state.viewingBook.summary}</Text>
              </ScrollView>
            </View>
          </Modal>

          <Modal isVisible={this.state.viewAllBooks} onBackButtonPress={() => this.setState({viewAllBooks: false})}>
            <ScrollView style={styles.bookListModalContainer}>
              <View style={styles.bookModalHeader}>
                <Text style={styles.bookModalTitle}>{this.state.viewingUser.name}'s Books</Text>
                <TouchableOpacity style={{position: "absolute", marginTop: 5, marginLeft: 5}} onPress={() => this.setState({viewAllBooks: false})}>
                  <Icon name="close" color="#808080" size={20}/>
                </TouchableOpacity>
              </View>
              <FlatList keyExtractor={(item, index) => String(index)} style={styles.fullBookList} data={this.state.viewingUserBooks} renderItem={({item}) => (<BookListItem index={item.id} book={item} coverURL={item.coverPhotoURL} title={item.title} summary={item.summary} openBookModal={this.openBookModal}/>)}></FlatList>
              <View style={{height: 1, backgroundColor: "#808080", marginBottom: 5}}></View>
            </ScrollView>
          </Modal>

          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Your Fellow Readers</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("BrowsePeople")}>
                <Text>Add More</Text>
              </TouchableOpacity>
            </View>  
            <FlatList 
              keyExtractor={(item, index) => String(index)} 
              style={styles.userList} 
              data={this.state.displayedUsers} 
              renderItem={({item}) => (<UserListItem addUserToFriendsList={() => this.addUserToFriendsList(item)} removeUserFromFriendsList={() => this.removeUserFromFriendsList(item)} id={item.id} profilePhotoURL={item.profilePictureURL} name={item.name} bio={item.bio} openProfileModal={() => this.openProfileModal(item)}/>)} />
            <View style={{height: 1, backgroundColor: "#808080", marginBottom: 5}}></View>
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    textAlign: "center"
  },
  profileContainer: {
    backgroundColor: "white",
    borderRadius: 10
  },
  profileHeaderContainer: {
    height: 210
  },
  profileHeader: {
    backgroundColor: "#77AD78",
    height: 150,
    alignItems: "flex-start",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  profilePictureContainer: {
    width: 130,
    height: 130,
    backgroundColor: "white",
    position: "absolute",
    alignSelf: "center",
    marginTop: 75
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: "#808080",
    resizeMode: "contain",
    position: "absolute",
    alignSelf: "center",
  },
  nameContainer: {
    marginTop: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  name: {
    textAlign: "center",
    fontSize: 24,
    marginRight: 5
  },
  bioContainer: {
    marginTop: 10,
    flexDirection: "row",
    marginHorizontal: 10,
    marginLeft: 20,
    paddingRight: 20,
  },
  bio: {
    marginRight: 2.5,
    flexGrow: 1,
    textAlign: "center"
  },
  booksContainer: {
    marginTop: 10,
  },
  bookListTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10
  },
  bookList: {
    marginHorizontal: 10,
  },
  bookListButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#7DBA84",
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    marginTop: 5,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "#fffafa",
    fontSize: 20
  },
  bookListModalContainer: {
    borderRadius: 5,
    backgroundColor: "#fffafa",
    paddingHorizontal: 10,
    marginVertical: 20
  },
  bookModalHeader: {
    marginTop: 10
  },
  bookModalTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10
  },
  bookContainer: {
    flexDirection: "row",
    marginVertical: 10
  },
  bookCoverPhoto: {
    width: 100,
    height: 160,
    marginRight: 10,
    marginTop: 5,
  },
  bookInfoContainer: {
    flex: 5
  },
  bookTitle: {
    fontSize: 16
  },
  bookSummary: {
    marginBottom: 10
  }, 
  userList: {
    flexGrow: 1
  }
});