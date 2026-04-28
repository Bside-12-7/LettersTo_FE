import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';

type Props = NativeStackScreenProps<StackParamsList, 'ChatRoom'>;

export const ChatRoomScreen = ({route}: Props) => {
  const {roomId} = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.text}>채팅방 #{roomId}</Text>
          <Text style={styles.subText}>WebSocket 연동 예정</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000CC',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Galmuri11',
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  subText: {
    fontFamily: 'Galmuri11',
    fontSize: 13,
    color: 'white',
  },
});
