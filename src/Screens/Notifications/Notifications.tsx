import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getNotifications, setNotificationRead} from '@apis/notification';
import {Header2} from '@components/Headers/Header2';
import {NotificationItem} from '@components/Notification/NotificationItem';
import {NotificationSlideSwitch} from '@components/Notification/NotificationSlideSwitch';
import Toast from '@components/Toast/toast';
import type {StackParamsList} from '@type/stackParamList';
import {Feedback, Notification, NotificationList} from '@type/types';
import {FeedbackItem} from '@components/Feedback/FeedbackItem';

type Props = NativeStackScreenProps<StackParamsList, 'Notifications'>;

const FEEDBACK_ITEM: Feedback = {
  id: -1,
  type: 'FEEDBACK',
};

export const Notifications = ({navigation}: Props) => {
  const [excludeReadNotifications, setExcludeReadNotifications] =
    useState<boolean>(false);
  const [currentCursor, setCurrentCursor] = useState<number>();
  const [notifications, setNotifications] = useState<NotificationList>([]);

  const onPressBack = () => {
    navigation.pop();
  };

  const toggleNotificationType = () => {
    setExcludeReadNotifications(!excludeReadNotifications);
    setNotifications([]);
    setCurrentCursor(undefined);
  };

  const {top: SAFE_AREA_TOP, bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  const onPressNotification = (selectedNotificationId: number) => async () => {
    const selectedNotificationIndex = notifications.findIndex(
      item => item.id === selectedNotificationId,
    );

    const notification = notifications[selectedNotificationIndex];

    if (!notifications[selectedNotificationIndex].read) {
      readNotification(notification, selectedNotificationIndex);
    }

    if (notification.intent) {
      goToLetterBox(notification.intent);
    }
  };

  const goToLetterBox = (intent: string) => {
    const notificationIntent = JSON.parse(intent);

    if (notificationIntent.fromMemberId && notificationIntent.letterBoxId) {
      const link = `letterstoapp://letterbox/${notificationIntent.letterBoxId}/${notificationIntent.fromMemberId}`;
      Linking.openURL(link);
    }
  };

  const readNotification = async (
    notification: Notification,
    index: number,
  ) => {
    try {
      await setNotificationRead(notification.id);

      notifications[index].read = true;
      setNotifications([...notifications]);
    } catch (error: any) {
      Toast.show('문제가 발생했습니다');
    }
  };

  const notificationList = useMemo(() => {
    if (excludeReadNotifications === true) {
      return notifications.filter(notification => notification.read === false);
    } else {
      return notifications;
    }
  }, [excludeReadNotifications, notifications]);

  const handleEndReached = () => {
    getNotificationsWithParams(!excludeReadNotifications, currentCursor);
  };

  const getNotificationsWithParams = async (
    read?: boolean,
    cursor?: number,
  ) => {
    try {
      const notificationRequestData: {read?: boolean; cursor?: number} = {};

      if (!read) {
        notificationRequestData.read = false;
      }

      if (cursor) {
        notificationRequestData.cursor = cursor;
      }

      const {content, cursor: nextCursor} = await getNotifications(
        notificationRequestData,
      );

      setNotifications([...notifications, ...content]);
      setCurrentCursor(nextCursor);
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다');
    }
  };

  useEffect(() => {
    getNotificationsWithParams(!excludeReadNotifications, currentCursor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeReadNotifications]);

  return (
    <View style={[styles.container, {paddingTop: SAFE_AREA_TOP}]}>
      <StatusBar barStyle={'light-content'} />
      <Header2 title={'알림'} color={'white'} onPressBack={onPressBack} />
      <View style={styles.contentContainer}>
        <NotificationSlideSwitch
          excludeReadNotifications={excludeReadNotifications}
          toggleNotificationType={toggleNotificationType}
        />
        {(excludeReadNotifications === true && notificationList.length > 0) ||
        (excludeReadNotifications === false && notificationList.length > 0) ? (
          <FlatList
            data={[FEEDBACK_ITEM, ...notifications]}
            contentContainerStyle={{
              paddingBottom: SAFE_AREA_BOTTOM,
              borderTopColor: '#0000cc40',
              borderTopWidth: 1,
            }}
            onEndReached={handleEndReached}
            renderItem={({item}) =>
              item.type === 'FEEDBACK' ? (
                <FeedbackItem />
              ) : (
                <NotificationItem
                  key={item.id}
                  notification={item}
                  onPress={onPressNotification}
                />
              )
            }
          />
        ) : (
          <View style={styles.noUnreadNotification}>
            <Text style={styles.noUnreadNotificationText}>
              모든 알림을 확인했어요!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000cc',
  },
  contentContainer: {flex: 1, backgroundColor: 'white', marginTop: 5},
  hr: {
    borderTopColor: '#0000cc40',
    borderTopWidth: 1,
  },
  noUnreadNotification: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  noUnreadNotificationText: {
    fontFamily: 'Galmuri11',
    fontSize: 16,
    color: '#0000cc',
  },
});
