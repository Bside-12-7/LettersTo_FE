import React, {useCallback, useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {RealtimeChatHeader} from '@components/Headers/RealtimeChatHeader';
import {ChatRoomList} from '@components/RealtimeChat/ChatRoomList';
import {InsufficientStampModal} from '@components/Modals/RealtimeChat/InsufficientStampModal';
import {ChatRoomEntryModal} from '@components/Modals/RealtimeChat/ChatRoomEntryModal';
import {useQuery, useQueryClient} from 'react-query';
import {getUserInfo} from '@apis/member';
import {
  getChatRooms,
  checkChatRoomTicket,
  issueChatRoomTicket,
} from '@apis/chat';
import {SCREEN_NAMES} from '@constants/navigation';
import Toast from 'react-native-root-toast';
import type {ChatTicketIssueResult} from '@type/types';

interface Props {
  navigation: NativeStackNavigationProp<StackParamsList>;
}

export const RealtimeChat = ({navigation}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [insufficientStampModalVisible, setInsufficientStampModalVisible] =
    useState(false);
  const [entryModalVisible, setEntryModalVisible] = useState(false);
  const [entryModalData, setEntryModalData] = useState<
    (ChatTicketIssueResult & {roomId: number}) | null
  >(null);

  const queryClient = useQueryClient();
  const {data: userInfo} = useQuery('userInfo', getUserInfo);
  const {data: chatRooms} = useQuery('chatRooms', getChatRooms);

  // 3초간 로딩 화면 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
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

  const handleRoomPress = useCallback(
    async (roomId: number) => {
      try {
        // 1. 참여 여부 확인
        const ticket = await checkChatRoomTicket(roomId);

        if (ticket.status === 'ACTIVE') {
          // 2. 이미 참여 중 - 인원수 확인
          const room = chatRooms?.find(r => r.id === roomId);
          if (room && room.participantCount >= room.capacity) {
            Toast.show('방이 꽉 찼어요, 나중에 다시 시도해 주세요!', {
              duration: Toast.durations.LONG,
              position: Toast.positions.CENTER,
            });
            return;
          }
          // 채팅 화면으로 이동
          navigation.navigate('ChatRoom', {roomId});
        } else {
          // 3. 참여하지 않음 - 우표 확인
          if (userInfo && userInfo.stampQuantity <= 2) {
            setInsufficientStampModalVisible(true);
          } else {
            // 티켓 발급
            const result = await issueChatRoomTicket(roomId);
            // 우표 개수 갱신
            queryClient.invalidateQueries('userInfo');
            setEntryModalData({roomId, ...result});
            setEntryModalVisible(true);
          }
        }
      } catch (error) {
        console.error('채팅방 입장 오류:', error);
        Toast.show('문제가 발생했습니다', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
        });
      }
    },
    [chatRooms, userInfo, navigation, queryClient],
  );

  const handleConfirmEntry = useCallback(async () => {
    if (!entryModalData) return;

    setEntryModalVisible(false);

    // 인원수 다시 확인
    const room = chatRooms?.find(r => r.id === entryModalData.roomId);
    if (room && room.participantCount >= room.capacity) {
      Toast.show('방이 꽉 찼어요, 나중에 다시 시도해 주세요!', {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
      });
      return;
    }

    // 채팅 화면으로 이동
    navigation.navigate('ChatRoom', {roomId: entryModalData.roomId});
  }, [entryModalData, chatRooms, navigation]);

  const handleCloseInsufficientStampModal = useCallback(() => {
    setInsufficientStampModalVisible(false);
  }, []);

  const handleGoToStampHistory = useCallback(() => {
    setInsufficientStampModalVisible(false);
    navigation.navigate('StampHistory');
  }, [navigation]);

  const handleCloseEntryModal = useCallback(() => {
    setEntryModalVisible(false);
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
            <ChatRoomList
              rooms={chatRooms || []}
              onPressRoom={handleRoomPress}
            />
          </>
        )}
      </SafeAreaView>
      <InsufficientStampModal
        isVisible={insufficientStampModalVisible}
        onPressClose={handleCloseInsufficientStampModal}
        onPressGoToStampHistory={handleGoToStampHistory}
      />
      <ChatRoomEntryModal
        isVisible={entryModalVisible}
        onPressClose={handleCloseEntryModal}
        onPressEnter={handleConfirmEntry}
      />
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
