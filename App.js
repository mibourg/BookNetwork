import React from 'react';
import {createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SplashScreen} from './screens/SplashScreen';
import {LoginScreen} from './screens/LoginScreen';
import {CreateAccountScreen} from './screens/CreateAccountScreen';
import {AccountCreatedScreen} from './screens/AccountCreatedScreen';
import {ForgotPasswordScreen} from './screens/ForgotPasswordScreen';
import {PasswordResetLinkSentScreen} from './screens/PasswordResetLinkSentScreen';
import {ProfileScreen} from './screens/ProfileScreen';
import {BrowseBooksScreen} from './screens/BrowseBooksScreen';
import {PeopleScreen} from './screens/PeopleScreen';
import {BrowsePeopleScreen} from './screens/BrowsePeopleScreen';

const peopleNavigator = createStackNavigator(
  {
    People: PeopleScreen,
    BrowsePeople: BrowsePeopleScreen
  }
);

const MainTabNavigator = createBottomTabNavigator(
  {
    BrowseBooks: BrowseBooksScreen,
    Profile: ProfileScreen,
    People: peopleNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Profile' && focused) {
          iconName = 'account';
        } else if (routeName === 'Profile' && !focused) {
          iconName = 'account';
        } else if (routeName === 'BrowseBooks' && focused) {
          iconName = 'book';
          
        } else if (routeName === 'BrowseBooks' && !focused) {
          iconName = 'book';
        } else if (routeName === 'People' && focused) {
          iconName = 'account-multiple';
        } else if (routeName === 'People' && !focused) {
          iconName = 'account-multiple';
        }
        return <Icon name={iconName} color={tintColor} size={horizontal ? 20 : 25}/>;
      },
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: "#77AD78",
      inactiveTintColor: "#808080",
      activeBackgroundColor: "#fffafa",
      inactiveBackgroundColor: "#fffafa"
    },
    initialRouteName: 'Profile'
  },
);

MainTabNavigator.navigationOptions = {
  header: null
}

const MainNavigator = createStackNavigator(
  {
    Splash: {screen: SplashScreen},
    Login: {screen: LoginScreen},
    CreateAccount: {screen: CreateAccountScreen},
    AccountCreated: {screen: AccountCreatedScreen},
    ForgotPassword: {screen: ForgotPasswordScreen},
    PasswordResetLinkSent: {screen: PasswordResetLinkSentScreen},
    Main: MainTabNavigator
  },
  {
    initialRouteName: 'Splash'
  }
);

const App = createAppContainer(MainNavigator);

export default App;