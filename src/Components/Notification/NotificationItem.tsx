import React, {useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
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
        style={{
          minHeight: 100,
          borderBottomColor: '#0000cc40',
          borderBottomWidth: 1,
          backgroundColor: notification.read ? 'white' : '#0000cc13',
          paddingHorizontal: 24,
          paddingVertical: 16,
          position: 'relative',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            position: 'absolute',
            top: 18,
            right: 24,
            fontFamily: 'Galmuri11',
            fontSize: 12,
            color: '#0000cc',
          }}>
          {notifiedDate}
        </Text>
        <Avatar notificationType={notification.type} />
        <View style={{marginLeft: 12, marginRight: 24}}>
          <View style={{height: 36, justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: 'Galmuri11',
                fontSize: 14,
                color: '#0000cc',
              }}>
              {notification.title.replace('님에게 ', '님에게\n')}
            </Text>
          </View>
          <View style={{minHeight: 30, justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: 'Galmuri11',
                fontSize: 12,
                color: '#0000cc',
              }}>
              {notification.content}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
