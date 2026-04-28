import React, {useCallback, useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {BottomTab} from '@components/BottomTab/BottomTab';
import {RealtimeChatHeader} from '@components/Headers/RealtimeChatHeader';
import {ChatRoomList} from '@components/RealtimeChat/ChatRoomList';
import {useQuery} from 'react-query';
import {getUserInfo} from '@apis/member';
import {getChatRooms} from '@apis/chat';
import {SCREEN_NAMES} from '@constants/navigation';

interface Props {
  navigation: NativeStackNavigationProp<StackParamsList>;
}

export const RealtimeChat = ({navigation}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const {data: userInfo} = useQuery('userInfo', getUserInfo);
  const {data: chatRooms} = useQuery('chatRooms', getChatRooms);

  // 3초간 로딩 화면 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const goToHome = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.MAIN.MAIN);
  }, [navigation]);

  const goToLetterBox = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.MAIN.MAIN);
  }, [navigation]);

  const goToRealtimeChat = useCallback(() => {
    // Already on RealtimeChat
  }, []);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressHome = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.MAIN.MAIN);
  }, [navigation]);

  const handlePressStamp = useCallback(() => {
    navigation.navigate('StampHistory');
  }, [navigation]);

  const handleRoomPress = useCallback((roomId: number) => {
    console.log('채팅방 입장:', roomId);
    // TODO: 채팅방 입장 기능 구현
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            {/* TODO: GIF 이미지 추가 예정 */}
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        ) : (
          <>
            <RealtimeChatHeader
              stampQuantity={userInfo?.stampQuantity || 0}
              onPressBack={handlePressBack}
              onPressHome={handlePressHome}
              onPressStamp={handlePressStamp}
            />
            <ChatRoomList rooms={chatRooms || []} onPressRoom={handleRoomPress} />
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Galmuri11',
    fontSize: 16,
    color: 'white',
  },
});
