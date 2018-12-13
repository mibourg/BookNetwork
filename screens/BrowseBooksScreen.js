import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Image, ImageBackground, Platform, FlatList, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase';
import Modal from 'react-native-modal';
import { BookListItem } from './BookListItem';
import CompleteFlatList from 'react-native-complete-flatlist';

export class BrowseBooksScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: firebase.auth().currentUser,
      displayedBooks: [],
      viewBook: false,
      viewingBook: {},
      stateLoaded: false
    }

    this.fetchBooks = this.fetchBooks.bind(this);
    this.addBookToUserList = this.addBookToUserList.bind(this);
    this.removeBookFromUserList = this.removeBookFromUserList.bind(this);
    this.openBookModal = this.openBookModal.bind(this);
    this.renderBook = this.renderBook.bind(this);
  }

  componentWillMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.setState({
        currentUser: firebase.auth().currentUser,
        displayedBooks: [],
        viewBook: false,
        viewingBook: {},
        stateLoaded: false
      });
      this.fetchBooks();
    });
  }

  fetchBooks() {   
    firebase.database().ref("/books").once('value').then((bookListSnapshot) => {
      bookListSnapshot.forEach((bookSnapshot) => {
        this.setState(previousState => ({
          displayedBooks: [...previousState.displayedBooks, bookSnapshot.val()]
        }));
      });
    }).then(() => this.setState({stateLoaded: true}));
  }

  addBookToUserList(index) {
    firebase.database().ref("users/" + this.state.currentUser.uid + "/books/").child(this.state.displayedBooks[index].ISBN).set(this.state.displayedBooks[index]);
    this.setState(this.state);
  }

  removeBookFromUserList(index) {
    firebase.database().ref("users/" + this.state.currentUser.uid + "/books/").child(this.state.displayedBooks[index].ISBN).remove();
    this.setState(this.state);
  }

  openBookModal(book) {
    this.setState({
      viewBook: true,
      viewingBook: book
    });
  }

  renderBook(data, index) {
    const item = data;
    return <BookListItem index={item.id} book={item} coverURL={item.coverPhotoURL} ISBN={item.ISBN} title={item.title} summary={item.summary} browseBooksScreen={true} addBookToUserList={this.addBookToUserList} removeBookFromUserList={this.removeBookFromUserList} openBookModal={this.openBookModal}/>
  }
  
  render() {
    if (this.state.stateLoaded) {
      return (
        <View>
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

          <ScrollView>
            <View style={styles.booksContainer}>
              <CompleteFlatList searchKey={['title', 'author', 'summary']} keyExtractor={(item, index) => String(index)} style={styles.bookList} data={this.state.displayedBooks.slice(0,this.state.displayedBooks.length)} renderItem={this.renderBook}/>
              <View style={{height: 1, backgroundColor: "#808080"}}></View>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return <View></View>;
    }
  }
}

const styles = StyleSheet.create({
  bookList: {
    marginHorizontal: 10,
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
  button: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center"
  },
});