import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'react-native-firebase';

export class BookListItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      bookAlreadyOwned: false,
      stateLoaded: false
    }

    this.bookAlreadyOwned = this.bookAlreadyOwned.bind(this);
  }

  componentDidMount() {
    this.bookAlreadyOwned();
  }

  bookAlreadyOwned() {
    firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/books").once('value').then((bookListSnapshot) => {
      bookListSnapshot.forEach((bookSnapshot) => {
        if (bookSnapshot.val().ISBN === this.props.ISBN) {
          this.setState({bookAlreadyOwned: true});
        }
      });
    }).then(() => this.setState({stateLoaded: true}));
  }

  render() {
    if (this.state.stateLoaded && this.props.browseBooksScreen) {
      return (
        <View>
          <View style={{height: 1, backgroundColor: "#808080"}}></View>
          <View style={{marginHorizontal: this.props.browseBooksScreen ? 10 : 0}}>
            <View style={styles.bookListItemContainer}>
              <Image style={this.props.browseBooksScreen ? {width: 20, height: 100, marginRight: 10, marginTop: 5, flex: 1.6} : {width: 20, height: 100, marginRight: 10, marginTop: 5, flex: 1}} source={{uri: this.props.coverURL}}/>
              <View style={styles.bookInfoContainer}>
                <Text style={styles.bookTitle}>{this.props.title}</Text>
                <Text style={styles.bookSummary} numberOfLines={this.props.browseBooksScreen ? 5 : 3}>{this.props.summary}</Text>
                {!this.props.browseBooksScreen && 
                <TouchableOpacity style={styles.button} onPress={() => this.props.openBookModal(this.props.book)}>
                  <Text>View</Text>
                  <Icon name="chevron-right" color="#808080" size={20}/>
                </TouchableOpacity>}
              </View>
              
              {this.props.browseBooksScreen && 
              <View style={{flex: 1.8}}>
                <View style={styles.browseBooksScreenButtonsContainer}>
                  {!this.state.bookAlreadyOwned && 
                  <TouchableOpacity style={styles.browseBooksScreenButton} onPress={() => {this.props.addBookToUserList(this.props.index); this.setState({bookAlreadyOwned: true})}}>
                    <Text>Add</Text>
                    <Icon name="plus" color="#808080" size={20}/>
                  </TouchableOpacity>}
                  {this.state.bookAlreadyOwned &&
                  <TouchableOpacity style={styles.browseBooksScreenButton} onPress={() => {this.props.removeBookFromUserList(this.props.index); this.setState({bookAlreadyOwned: false})}}>
                    <Text>Remove</Text>
                    <Icon name="minus" color="#808080" size={20}/>
                  </TouchableOpacity>}
                  <TouchableOpacity style={styles.browseBooksScreenButton} onPress={() => this.props.openBookModal(this.props.book)}>
                    <Text>View</Text>
                    <Icon name="chevron-right" color="#808080" size={20}/>
                  </TouchableOpacity>
                </View>
              </View>}
            </View>
          </View>
        </View>
      );
    } else if (!this.props.browseBooksScreen) {
      return (
        <View>
          <View style={{height: 1, backgroundColor: "#808080"}}></View>
          <View style={{marginHorizontal: this.props.browseBooksScreen ? 10 : 0}}>
            <View style={styles.bookListItemContainer}>
              <Image style={this.props.browseBooksScreen ? {width: 20, height: 100, marginRight: 10, marginTop: 5, flex: 1.6} : {width: 20, height: 100, marginRight: 10, marginTop: 5, flex: 1}} source={{uri: this.props.coverURL}}/>
              <View style={styles.bookInfoContainer}>
                <Text style={styles.bookTitle}>{this.props.title}</Text>
                <Text style={styles.bookSummary} numberOfLines={this.props.browseBooksScreen ? 5 : 3}>{this.props.summary}</Text>
                {!this.props.browseBooksScreen && 
                <TouchableOpacity style={styles.button} onPress={() => this.props.openBookModal(this.props.book)}>
                  <Text>View</Text>
                  <Icon name="chevron-right" color="#808080" size={20}/>
                </TouchableOpacity>}
              </View>
              
              {this.props.browseBooksScreen && 
              <View style={{flex: 1.8}}>
                <View style={styles.browseBooksScreenButtonsContainer}>
                  {!this.state.bookAlreadyOwned && 
                  <TouchableOpacity style={styles.browseBooksScreenButton} onPress={() => {this.props.addBookToUserList(this.props.index); this.setState({bookAlreadyOwned: true})}}>
                    <Text>Add</Text>
                    <Icon name="plus" color="#808080" size={20}/>
                  </TouchableOpacity>}
                  {this.state.bookAlreadyOwned &&
                  <TouchableOpacity style={styles.browseBooksScreenButton} onPress={() => {this.props.removeBookFromUserList(this.props.index); this.setState({bookAlreadyOwned: false})}}>
                    <Text>Remove</Text>
                    <Icon name="minus" color="#808080" size={20}/>
                  </TouchableOpacity>}
                  <TouchableOpacity style={styles.browseBooksScreenButton} onPress={() => this.props.openBookModal(this.props.book)}>
                    <Text>View</Text>
                    <Icon name="chevron-right" color="#808080" size={20}/>
                  </TouchableOpacity>
                </View>
              </View>}
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
  bookListItemContainer: {
    flexDirection: "row",
    marginVertical: 10
  },
  bookInfoContainer: {
    flex: 4
  },
  bookTitle: {
    marginBottom: 5,
    fontSize: 16
  },
  bookSummary: {
  },
  button: {
    marginTop: 5,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center"
  },
  browseBooksScreenButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center"
  },
  browseBooksScreenButtonsContainer: {
    justifyContent: "space-between",
    flexGrow: 1,
    flex: 1
  }
})