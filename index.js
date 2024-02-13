/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {Linking} from 'react-native';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    // process the notification'
    const {link = null} = notification?.data || {}; // <---- 1
    if (link) Linking.openURL(link);
    else Linking.openURL('letterstoapp://notifications'); // <---- 2

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
});

AppRegistry.registerComponent(appName, () => App);
