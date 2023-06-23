import React, {useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Notification} from '@type/types';
import {subDate} from '@utils/dateFormatter';
import {Avatar} from '../Avatar/Avatar';

type Props = {
  notification: Notification;
  onPress: (notificationId: number) => () => void;
};

export const NotificationItem = ({notification, onPress}: Props) => {
  const notifiedDate = useMemo(() => {
    const {days, hours, minutes} = subDate(
      new Date(),
      new Date(notification.createdDate),
    );

    if (days > 0) {
      return days + '일 전';
    } else if (hours > 0) {
      return hours + '시간 전';
    } else if (minutes > 0) {
      return minutes + '분 전';
    } else {
      return '방금';
    }
  }, [notification]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress(notification.id)}>
      <View
        style={[
          styles.notificationItemBox,
          {
            backgroundColor: notification.read ? 'white' : '#0000cc13',
          },
        ]}>
        <Text style={styles.dateText}>{notifiedDate}</Text>
        <Avatar notificationType={notification.type} />
        <View style={styles.wrap}>
          <View style={styles.title}>
            <Text style={styles.titleText}>
              {notification.title.replace('님에게 ', '님에게\n')}
            </Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>{notification.content}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationItemBox: {
    minHeight: 100,
    borderBottomColor: '#0000cc40',
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    position: 'relative',
    flexDirection: 'row',
  },
  dateText: {
    position: 'absolute',
    top: 18,
    right: 24,
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
  },
  wrap: {marginLeft: 12, marginRight: 24},
  title: {height: 36, justifyContent: 'center'},
  titleText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000cc',
  },
  content: {minHeight: 30, justifyContent: 'center'},
  contentText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
  },
});
