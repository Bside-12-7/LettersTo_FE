import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import type {ChatMessage} from '@type/types';
import {BASE_URL_TEST, BASE_URL_PROD} from '@constants/common';
import {Avatar} from '@components/Avatar/Avatar';
import {dateFormatter} from '@utils/dateFormatter';

const BASE_URL = __DEV__ ? BASE_URL_TEST : BASE_URL_PROD;

interface Props {
  message: ChatMessage;
  isMyMessage: boolean;
  showIdentity: boolean;
  onPressNickname: (memberId: number) => void;
  onPressLink: (url: string) => void;
}

const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+)/g;
const URL_TEST_REGEX = /^https?:\/\/[^\s]+$/;

export const containsUrl = (text: string): boolean =>
  /https?:\/\/[^\s]+/.test(text);

const getAvatarColor = (senderId: number): 'yellow' | 'pink' =>
  senderId % 2 === 0 ? 'yellow' : 'pink';

export const MessageBubble = React.memo(
  ({
    message,
    isMyMessage,
    showIdentity,
    onPressNickname,
    onPressLink,
  }: Props) => {
    if (message.type === 'SYSTEM_JOIN' || message.type === 'SYSTEM_LEAVE') {
      return (
        <View style={styles.systemContainer}>
          <Text style={styles.systemText}>{message.content}</Text>
        </View>
      );
    }

    const displayNickname = isMyMessage ? '나' : message.nickname;
    const avatarColor = getAvatarColor(message.senderId);
    const time = dateFormatter('HH:mm', new Date(message.sentAt));

    const renderContent = () => {
      if (message.pictureFileId) {
        return (
          <Image
            source={{uri: `${BASE_URL}/files/${message.pictureFileId}`}}
            style={styles.image}
            resizeMode="cover"
          />
        );
      }
      const parts = message.content.split(URL_SPLIT_REGEX);
      const textColor = isMyMessage ? '#0000CC' : 'white';
      return (
        <Text style={[styles.messageText, {color: textColor}]}>
          {parts.map((part, index) => {
            if (URL_TEST_REGEX.test(part)) {
              return (
                <Text
                  key={index}
                  style={[styles.link, {color: textColor}]}
                  onPress={() => onPressLink(part)}>
                  {part}
                </Text>
              );
            }
            return part;
          })}
        </Text>
      );
    };

    return (
      <View style={styles.row}>
        {showIdentity ? (
          <Pressable
            style={styles.identity}
            onPress={() => onPressNickname(message.senderId)}>
            <Avatar nickname={displayNickname} color={avatarColor} size={30} />
            <Text
              style={styles.nickname}
              numberOfLines={1}
              ellipsizeMode="tail">
              {displayNickname}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.identity} />
        )}
        <View
          style={[
            styles.bubble,
            isMyMessage ? styles.bubbleSolid : styles.bubbleOutlined,
            !!message.pictureFileId && styles.bubbleImage,
          ]}>
          {renderContent()}
        </View>
        <Text style={styles.time}>{time}</Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: 16,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 84,
  },
  nickname: {
    fontFamily: 'Galmuri11',
    fontSize: 13,
    color: 'white',
    flex: 1,
  },
  bubble: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexShrink: 1,
    maxWidth: '55%',
  },
  bubbleSolid: {
    backgroundColor: 'white',
  },
  bubbleOutlined: {
    backgroundColor: '#0000CC',
    borderWidth: 1,
    borderColor: 'white',
  },
  bubbleImage: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
  },
  messageText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
  },
  link: {
    textDecorationLine: 'underline',
  },
  image: {
    width: 140,
    height: 140,
  },
  time: {
    fontFamily: 'Galmuri11',
    fontSize: 11,
    color: '#ffffffaa',
    marginLeft: 6,
    alignSelf: 'flex-end'
  },
  systemContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#ffffff80',
  },
});
