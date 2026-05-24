import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  Keyboard,
  TextInput,
  FlatList,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {useInfiniteQuery, useQueryClient} from 'react-query';
import EventSource from 'react-native-sse';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-root-toast';
import {useAuthStore} from '@stores/auth';
import {
  getChatMessages,
  sendTextMessage,
  sendPictureMessage,
  sendHeartbeat,
  joinChatRoom,
} from '@apis/chatMessage';
import {getImageUploadUrl} from '@apis/file';
import type {ChatMessage, SSEEndedEvent, SSEUpdatedEvent} from '@type/types';
import {MessageList} from '@components/RealtimeChat/MessageList';
import {MessageInput} from '@components/RealtimeChat/MessageInput';
import {ChatTexticonSelector} from '@components/RealtimeChat/ChatTexticonSelector';
import {ProfileModal} from '@components/Modals/RealtimeChat/ProfileModal';
import {BackButton} from '@components/Button/Header/BackButton';

type Props = NativeStackScreenProps<StackParamsList, 'ChatRoom'>;

const HEARTBEAT_INTERVAL = 30000; // 30초
const HEARTBEAT_TIMEOUT = 90000; // 90초

export const ChatRoomScreen = ({route, navigation}: Props) => {
  const {roomId, roomName} = route.params;
  const queryClient = useQueryClient();

  // 사용자 정보
  const userInfo = useAuthStore(state => state.userInfo);
  const myMemberId = userInfo.id;

  // 입력
  const [inputText, setInputText] = useState('');
  const [texticonMode, setTexticonMode] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // 모달
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  // Refs
  const sseRef = useRef<EventSource | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastHeartbeatRef = useRef<number>(Date.now());
  const inputRef = useRef<TextInput>(null);
  const cursorPosition = useRef<{start: number; end: number}>({
    start: 0,
    end: 0,
  });
  const flatListRef = useRef<FlatList>(null);

  // useInfiniteQuery로 메시지 로드
  // 응답은 DESC(최신 우선). pages[0]가 최신 페이지, 각 page 안에서도 index 0이 최신.
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useInfiniteQuery(
      ['chatMessages', roomId],
      async ({pageParam}) => {
        // 첫 페이지 로드 시 채팅방 입장
        if (!pageParam) {
          await joinChatRoom(roomId);
        }

        const response = await getChatMessages(roomId, {
          before: pageParam,
          size: 30,
        });
        return response || [];
      },
      {
        // before=X 는 id<X 인 메시지를 DESC 로 반환하므로
        // 다음 페이지(더 과거) 커서는 마지막 페이지의 마지막 원소(가장 오래된 id) 가 되어야 한다.
        getNextPageParam: lastPage => {
          if (lastPage.length === 0) return undefined;
          return lastPage[lastPage.length - 1].id;
        },
        onError: error => {
          console.error('메시지 로드 실패:', error);
          Toast.show('채팅방 입장에 실패했습니다', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
          });
        },
      },
    );

  // 모든 페이지의 메시지를 하나의 배열로 합치기 (DESC: index 0 이 최신)
  const messages = data?.pages.flatMap(page => page) || [];

  // SSE updated 이벤트 후 새 메시지 가져오기
  // - 캐시에서 직접 최신 id 를 읽어 closure 의존성을 줄인다.
  // - after=X 응답은 ASC 이므로, DESC 인 pages[0] 앞쪽에 reverse 후 prepend 한다.
  const fetchNewMessages = useCallback(async () => {
    try {
      const cached = queryClient.getQueryData<{
        pages: ChatMessage[][];
        pageParams: unknown[];
      }>(['chatMessages', roomId]);
      const newestId = cached?.pages[0]?.[0]?.id;
      if (!newestId) return;

      const response = await getChatMessages(roomId, {
        after: newestId,
        size: 100,
      });

      if (!response || response.length === 0) return;

      const descNew = [...response].reverse();

      queryClient.setQueryData(['chatMessages', roomId], (old: any) => {
        if (!old) {
          return {pages: [descNew], pageParams: [undefined]};
        }
        const [firstPage, ...rest] = old.pages as ChatMessage[][];
        return {
          ...old,
          pages: [[...descNew, ...firstPage], ...rest],
        };
      });
    } catch (error) {
      console.error('새 메시지 가져오기 실패:', error);
    }
  }, [roomId, queryClient]);

  // SSE 연결
  const connectSSE = useCallback(async () => {
    try {
      const baseUrl = __DEV__
        ? 'http://15.165.100.80/api'
        : 'https://api.lettersto.co.kr/api';

      const url = `${baseUrl}/chat/rooms/${roomId}/messages/stream`;

      // 인증 토큰 가져오기
      const AsyncStorage = (
        await import('@react-native-async-storage/async-storage')
      ).default;
      const accessToken = await AsyncStorage.getItem('accessToken');

      const eventSource = new EventSource(url, {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
      });

      eventSource.addEventListener('ready', (event: any) => {
        console.log('SSE ready:', event.data);
      });

      eventSource.addEventListener('updated', (event: any) => {
        console.log('SSE updated:', event.data);
        try {
          const data: SSEUpdatedEvent = JSON.parse(event.data);
          fetchNewMessages();
        } catch (error) {
          console.error('SSE updated 파싱 실패:', error);
        }
      });

      eventSource.addEventListener('ended', (event: any) => {
        console.log('SSE ended:', event.data);
        try {
          const data: SSEEndedEvent = JSON.parse(event.data);
          handleSessionEnded(data.reason);
        } catch (error) {
          console.error('SSE ended 파싱 실패:', error);
        }
      });

      eventSource.addEventListener('error', (event: any) => {
        console.error('SSE error:', event);
      });

      sseRef.current = eventSource;
    } catch (error) {
      console.error('SSE 연결 실패:', error);
    }
  }, [roomId, fetchNewMessages]);

  // SSE 연결 해제
  const disconnectSSE = useCallback(() => {
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
  }, []);

  // 하트비트 시작
  const startHeartbeat = useCallback(() => {
    heartbeatTimerRef.current = setInterval(async () => {
      try {
        await sendHeartbeat(roomId);
        lastHeartbeatRef.current = Date.now();
      } catch (error) {
        console.error('하트비트 실패:', error);
        checkTimeout();
      }
    }, HEARTBEAT_INTERVAL);
  }, [roomId]);

  // 하트비트 중지
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  // 타임아웃 확인
  const checkTimeout = useCallback(() => {
    const elapsed = Date.now() - lastHeartbeatRef.current;
    if (elapsed > HEARTBEAT_TIMEOUT) {
      Alert.alert(
        '세션 종료',
        '연결이 오랫동안 응답하지 않아 세션이 종료되었습니다.',
        [{text: '확인', onPress: () => navigation.goBack()}],
      );
    }
  }, [navigation]);

  // 세션 종료 처리
  const handleSessionEnded = useCallback(
    (reason: string) => {
      const messages: {[key: string]: string} = {
        LEAVE: '채팅방을 나갔습니다.',
        INACTIVE: '활동이 없어 세션이 종료되었습니다.',
        EVICTED: '다른 기기에서 접속하여 세션이 종료되었습니다.',
        EXPIRED: '세션이 만료되었습니다.',
      };

      Alert.alert('세션 종료', messages[reason] || '세션이 종료되었습니다.', [
        {text: '확인', onPress: () => navigation.goBack()},
      ]);
    },
    [navigation],
  );

  // 텍스트 메시지 전송
  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || sendingMessage) return;

    const messageToSend = inputText.trim();
    setInputText('');
    setSendingMessage(true);

    try {
      await sendTextMessage(roomId, messageToSend);
      // SSE로 실제 메시지가 올 것이므로 별도 처리 불필요
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      Toast.show('메시지 전송에 실패했습니다', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
      });
      setInputText(messageToSend); // 실패 시 입력 복원
    } finally {
      setSendingMessage(false);
    }
  }, [inputText, roomId, sendingMessage]);

  // 이미지 선택 및 전송
  const handleImagePick = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUploading(true);
        const asset = result.assets[0];

        // 파일명 생성
        const filename = `chat_${Date.now()}.jpg`;

        // Presigned URL 발급
        const uploadData = await getImageUploadUrl(filename);
        const presignedUrl = uploadData.presignedUrl;
        const imageUrl = uploadData.url;

        // 이미지 파일 가져오기
        const response = await fetch(asset.uri);
        const blob = await response.blob();

        // S3 업로드
        await fetch(presignedUrl, {
          method: 'PUT',
          body: blob,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        // 파일 ID 추출 (URL에서 /files/ 이후 부분)
        const fileId = imageUrl.split('/files/')[1];

        // 사진 메시지 전송
        await sendPictureMessage(roomId, [fileId]);

        Toast.show('이미지가 전송되었습니다', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
      }
    } catch (error) {
      console.error('이미지 전송 실패:', error);
      Toast.show('이미지 전송에 실패했습니다', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
      });
    } finally {
      setImageUploading(false);
    }
  }, [roomId]);

  // 텍스티콘 토글
  // - 진입: 키보드 dismiss → 슬라이드 다운 후 패널 노출 (300ms) → input 포커스 복원
  //   (showSoftInputOnFocus={!texticonMode} 이므로 키보드는 안 올라오고 커서만 유지)
  // - 해제: 패널 닫고 input focus → showSoftInputOnFocus 가 다시 true 라 키보드 복귀
  const toggleTexticonMode = useCallback(() => {
    if (texticonMode) {
      setTexticonMode(false);
      inputRef.current?.blur();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1);
    } else {
      Keyboard.dismiss();
      setTimeout(() => {
        setTexticonMode(true);
      }, 300);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 600);
    }
  }, [texticonMode]);

  // 텍스티콘 삽입 — 패널 유지, 연속 삽입 허용
  const insertTexticonAtCursor = useCallback(
    (texticon: string) => {
      const {start, end} = cursorPosition.current;
      const newText =
        inputText.substring(0, start) + texticon + inputText.substring(end);
      setInputText(newText);

      const newCursorPos = start + texticon.length;
      cursorPosition.current = {start: newCursorPos, end: newCursorPos};
    },
    [inputText],
  );

  // 프로필 모달 열기
  const openProfileModal = useCallback((memberId: number) => {
    setSelectedMemberId(memberId);
    setProfileModalVisible(true);
  }, []);

  // 링크 클릭 핸들러
  const handleLinkPress = useCallback((url: string) => {
    Alert.alert(
      '외부 링크',
      '신뢰할 수 있는 링크인지 한번 더 확인해 주세요. 이 링크에 연결할까요?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: () => {
            Linking.openURL(url).catch(err =>
              console.error('링크 열기 실패:', err),
            );
          },
        },
      ],
    );
  }, []);

  // 초기화
  useEffect(() => {
    connectSSE();
    startHeartbeat();

    return () => {
      disconnectSSE();
      stopHeartbeat();
    };
  }, [connectSSE, startHeartbeat, disconnectSSE, stopHeartbeat]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* 헤더 */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={'white'} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {roomName}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          {/* 메시지 목록 */}
          <MessageList
            messages={messages}
            myMemberId={myMemberId}
            onLoadMore={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            hasMore={hasNextPage || false}
            isLoading={isFetchingNextPage}
            onPressNickname={openProfileModal}
            onPressLink={handleLinkPress}
          />

          {/* 메시지 입력 */}
          <MessageInput
            value={inputText}
            onChangeText={setInputText}
            onSend={handleSendMessage}
            onPressImage={handleImagePick}
            onPressTexticon={toggleTexticonMode}
            texticonMode={texticonMode}
            disabled={imageUploading || sendingMessage}
            inputRef={inputRef}
            onSelectionChange={event => {
              cursorPosition.current = event.nativeEvent.selection;
            }}
          />

          {/* 텍스티콘 선택기 (인라인: 키보드 자리 차지) */}
          {texticonMode && (
            <ChatTexticonSelector onSelectTexticon={insertTexticonAtCursor} />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* 프로필 모달 */}
      <ProfileModal
        visible={profileModalVisible}
        memberId={selectedMemberId}
        onClose={() => setProfileModalVisible(false)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  headerTitle: {
    fontFamily: 'Galmuri11',
    fontSize: 16,
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
});
