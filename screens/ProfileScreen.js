import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, FlatList, ScrollView, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase';
import SideMenu from 'react-native-side-menu';
import { Menu } from './ProfileSideMenu';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import { BookListItem } from './BookListItem';

export class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      currentUser: firebase.auth().currentUser,
      sideMenuOpen: false,
      profilePictureURL: null,
      bio: "",
      editingBio: false,
      editedBio: "",
      name: firebase.auth().currentUser.displayName,
      editingName: false,
      editedName: "",
      books: [],
      displayedBooks: [],
      viewBook: false,
      viewingBook: {},
      viewAllBooks: false,
      gotPhotoURL: false,
      gotBio: false,
      gotBooks: false
    };

    this.fetchPhotoURL = this.fetchPhotoURL.bind(this);
    this.updatePhotoURL = this.updatePhotoURL.bind(this);
    this.fetchBio = this.fetchBio.bind(this);
    this.updateBio = this.updateBio.bind(this);
    this.fetchBooks = this.fetchBooks.bind(this);
    this.shuffleArray = this.shuffleArray.bind(this);
    this.getThreeRandomBooks = this.getThreeRandomBooks.bind(this);
    this.openBookModal = this.openBookModal.bind(this);
  }

  componentWillMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.setState({
        currentUser: firebase.auth().currentUser,
        sideMenuOpen: false,
        profilePictureURL: null,
        bio: "",
        editingBio: false,
        editedBio: "",
        name: firebase.auth().currentUser.displayName,
        editingName: false,
        editedName: "",
        books: [],
        displayedBooks: [],
        viewBook: false,
        viewingBook: {},
        viewAllBooks: false,
        gotPhotoURL: false,
        gotBio: false,
        gotBooks: false
      });
      this.fetchPhotoURL();
      this.fetchBio();
      this.fetchBooks();    
    });
  }

  fetchPhotoURL() {
    firebase.storage().ref("profile-pictures/" + this.state.currentUser.uid).getDownloadURL().then((url) => {this.setState({profilePictureURL: String(url), gotPhotoURL: true})}).catch(() => {this.setState({profilePictureURL: "http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png", gotPhotoURL: true})});
  }

  updatePhotoURL() {
    ImagePicker.showImagePicker({title: "Pick a photo!"}, (response) => {
      if (response.didCancel) {
        //Cancelled
      } else if (response.error) {
        //Error
      } else { 
        firebase.storage().ref("profile-pictures").child(this.state.currentUser.uid).putFile(response.uri).then(() => {
          firebase.storage().ref("profile-pictures/" + this.state.currentUser.uid).getDownloadURL().then((url) => {
            this.setState({profilePictureURL: String(url)});
            firebase.database().ref("users/" + firebase.auth().currentUser.uid).child("profilePictureURL").set(String(url));
          });
        });
      }
    });
  }

  updateName(newName) {
    firebase.database().ref("users/" + firebase.auth().currentUser.uid).child("name").set(newName);
    this.setState({name: newName});
  }

  fetchBio() {
    firebase.database().ref("users/" + this.state.currentUser.uid + "/bio").once('value').then((snapshot) => {
      this.setState({bio: snapshot.val()});
    }).then(() => {this.setState({gotBio: true});});
  }

  updateBio(newBio) {
    firebase.database().ref("users/" + firebase.auth().currentUser.uid).child("bio").set(newBio);
    this.setState({bio: newBio});
  }
  
  fetchBooks() {   
    firebase.database().ref("users/" + this.state.currentUser.uid + "/books").once('value').then((bookListSnapshot) => {
      bookListSnapshot.forEach((bookSnapshot) => {
        this.setState(previousState => ({
          books: [...previousState.books, bookSnapshot.val()]
        }));
      });
    }).then(() => {this.getThreeRandomBooks(); this.setState({gotBooks: true});}).catch(() => this.setState({books: []}));
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
    let randomBooks = this.shuffleArray(this.state.books).slice(0, 3);
    this.setState({
      displayedBooks: randomBooks
    });
  }
  
  openBookModal(book) {
    this.setState({
      viewBook: true,
      viewingBook: book
    });
  }

  render() {
    const navigation = this.props.navigation;
    const menu = (<Menu navigation={navigation}/>);

    if (this.state.gotBio && this.state.gotPhotoURL && this.state.gotBooks) {
      return (
        <SideMenu menu={menu} menuPosition="right" isOpen={this.state.sideMenuOpen}> 

          <Modal isVisible={this.state.editingName} onBackButtonPress={() => {this.setState({editedName: "", editingName: false})}}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Name</Text>
              <TextInput style={styles.bioTextInput} placeholder="Name" placeholderTextColor="#fffafa" value={this.state.editedName} onChangeText={(text) => this.setState({editedName: text})} multiline={true}/>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={() => {this.setState({editedName: "", editingName: false})}}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => {this.updateName(this.state.editedName); firebase.auth().currentUser.updateProfile({displayName: this.state.editedName}); this.setState({name: this.state.editedName, editingName: false, editedName: ""});}}>
                  <Text style={styles.modalButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal isVisible={this.state.editingBio} onBackButtonPress={() => {this.setState({editedBio: "", editingBio: false})}}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Bio</Text>
              <TextInput style={styles.bioTextInput} placeholder="Bio" placeholderTextColor="#fffafa" value={this.state.editedBio} onChangeText={(text) => this.setState({editedBio: text})} multiline={true}/>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={() => {this.setState({editedBio: "", editingBio: false})}}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => {this.updateBio(this.state.editedBio); this.setState({editingBio: false, editedBio: ""});}}>
                  <Text style={styles.modalButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
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
                <Text style={styles.bookModalTitle}>Your Books</Text>
                <TouchableOpacity style={{position: "absolute", marginTop: 5, marginLeft: 5}} onPress={() => this.setState({viewAllBooks: false})}>
                  <Icon name="close" color="#808080" size={20}/>
                </TouchableOpacity>
              </View>
              <FlatList keyExtractor={(item, index) => String(index)} style={styles.fullBookList} data={this.state.books} renderItem={({item}) => (<BookListItem index={item.id} book={item} coverURL={item.coverPhotoURL} title={item.title} summary={item.summary} openBookModal={this.openBookModal}/>)}></FlatList>
              <View style={{height: 1, backgroundColor: "#808080", marginBottom: 5}}></View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.bookModalButton} onPress={() => {this.setState({viewAllBooks: false}); this.props.navigation.navigate("BrowseBooks");}}>
                  <Text style={styles.modalButtonText}>Add More</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>

          <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.header}>  
                <TouchableOpacity style={styles.settingsButton} onPress={() => this.setState({sideMenuOpen: !this.sideMenuOpen})} onChange={(isOpen) => this.setState({isOpen: isOpen})}>
                  <Icon name="dots-horizontal" color="#ffffff" size={30}/>
                </TouchableOpacity>
              </View>
              <View style={styles.profilePictureContainer}>
                <Image resizeMode="cover" style={styles.profilePicture} source={{uri: this.state.profilePictureURL}}/>
                <TouchableOpacity style={styles.editButton} onPress={this.updatePhotoURL}>
                  <Icon name="square-edit-outline" color="#808080" size={20}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{this.state.name}</Text>
              <TouchableOpacity onPress={() => this.setState({editingName: true, editedName: this.state.name})}>
                <Icon name="square-edit-outline" color="#808080" size={20}/>
              </TouchableOpacity>
            </View>
            <View style={styles.bioContainer}>
              <Text style={styles.bio}>{this.state.bio}</Text>
              <TouchableOpacity onPress={() => this.setState({editingBio: true, editedBio: this.state.bio})}>
                <Icon name="square-edit-outline" color="#808080" size={20}/>
              </TouchableOpacity>
            </View>
            <View style={styles.booksContainer}>
              <Text style={styles.bookListTitle}>Books</Text>
              {this.state.books.length > 0 && <FlatList keyExtractor={(item, index) => String(index)} style={styles.bookList} data={this.state.displayedBooks} renderItem={({item}) => (<BookListItem index={item.id} book={item} coverURL={item.coverPhotoURL} title={item.title} summary={item.summary} openBookModal={this.openBookModal}/>)}></FlatList>}
              <View style={{height: 1, backgroundColor: "#808080", marginHorizontal: 10, marginBottom: 5}}></View>
            </View>
            {this.state.books.length > 0 && <View style={styles.bookListButtonsContainer}>
              <TouchableOpacity style={styles.button} onPress={() => this.setState({viewAllBooks: true})}>
                <Text style={styles.buttonText}>View All</Text>
              </TouchableOpacity>
            </View>}
            {this.state.books.length === 0 &&
            <TouchableOpacity style={{alignItems: "center"}} onPress={() => this.props.navigation.navigate("BrowseBooks")}>
              <Text>You don't have any books yet. Tap here to add some!</Text>
            </TouchableOpacity>}
          </ScrollView>
        </SideMenu>
      );
    } else {
      return <View></View>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  headerContainer: {
    height: 210,
  },
  header: {
    backgroundColor: "#77AD78",
    height: 150,
    alignItems: "flex-end"
  },
  settingsButton: {
    marginTop: 5,
    marginRight: 10
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
    position: "absolute",
    alignSelf: "center",
  },
  editButton: {
    margin: 2.5,
    alignSelf: "flex-end"
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
  bioTextInput: {
    alignSelf: "stretch",
    backgroundColor: "#7DBA84",
    color: "#fffafa",
    padding: 10,
    marginBottom: 5
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
  modalContainer: {
    borderRadius: 10,
    backgroundColor: "#77AD78",
    paddingVertical: 50,
    paddingHorizontal: 25
  },
  modalTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    color: "#fffafa"
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  modalButton: {
    borderRadius: 5,
    backgroundColor: "#8FD694",
    paddingVertical: 15,
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  modalButtonText: {
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
  bookModalButton: {
    borderRadius: 5,
    backgroundColor: "#7DBA84",
    paddingVertical: 15,
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center"
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
  }
});