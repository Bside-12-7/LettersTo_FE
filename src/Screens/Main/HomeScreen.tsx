import React, {useState, useEffect, useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {getPublicLetters} from '@apis/letter';
import {PublicLetter, PublicLetters} from '@type/types';
import {PublicLetterItem} from '@components/PublicLetterItem';
import {EnvelopeModal} from '@components/Modals/Letter/EnvelopeModal';
import {SCREEN_HEIGHT} from '@constants/screen';
import Toast from '@components/Toast/toast';
import {useQuery} from 'react-query';
import {getUserInfo} from '@apis/member';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {useFeedbackStore} from '@stores/feedback';
import {FeedbackButton} from '@components/Feedback/FeedbackButton';

type Props = {
  navigation: NativeStackNavigationProp<StackParamsList, 'Main', undefined>;
};

export function Home({navigation}: Props) {
  const {top: SAFE_AREA_TOP} = useSafeAreaInsets();

  // 공개 편지 목록
  const [publicLetters, setPublicLetters] = useState<PublicLetters | []>([]);
  const [currentCursor, setCurrentCursor] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const getPublicLettersInit = () => {
    try {
      getPublicLetters().then(data => {
        const {content, cursor} = data;
        setPublicLetters(content);
        setCurrentCursor(cursor);
        setLoading(false);
      });
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다');
    }
  };

  useEffect(() => {
    setLoading(true);
    getPublicLettersInit();
  }, []);

  // 스크롤 시 y 위치 저장
  const [currentPositionY, setCurrentPositionY] = useState<number>(0);
  const handleScroll = (event: any) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setCurrentPositionY(positionY);
  };

  // 맨 상단으로 스크롤
  const publicLetterListRef = React.useRef<FlatList>(null);
  const scrollToTop = () => {
    publicLetterListRef.current?.scrollToIndex({animated: true, index: 0});
    setTimeout(() => setCurrentPositionY(0), 300);
  };

  // 무한 스크롤
  const handleEndReached = () => {
    if (currentCursor) {
      try {
        getPublicLetters(currentCursor).then(data => {
          const {content, cursor} = data;
          const updatedArray = [...publicLetters].concat(content);
          setPublicLetters(updatedArray);
          setCurrentCursor(cursor);
        });
      } catch (error: any) {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      }
    }
  };

  // 새로고침
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    try {
      getPublicLetters().then(data => {
        const {content, cursor} = data;
        setPublicLetters(content);
        setCurrentCursor(cursor);
        setRefreshing(false);
      });
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다');
    }
  };

  // 봉투 열기
  const [selectedItem, setSelectedItem] = useState<PublicLetter>();
  const [isEnvelopeModalVisible, setEnvelopeModalVisible] = useState(false);
  const onOpenEnvelopeModal = (item: PublicLetter) => {
    setSelectedItem(item);
    setEnvelopeModalVisible(true);
  };

  // 편지 조회
  const goToLetterViewer = (id: number) => {
    navigation.navigate('LetterViewer', {id, to: 'PUBLIC'});
  };

  const goToMyPage = () => {
    navigation.navigate('MyPage');
  };

  const goToLetterEditor = () => {
    navigation.navigate('LetterEditor');
  };

  const goToNotification = () => {
    navigation.navigate('Notifications');
  };

  const goToStampHistory = () => {
    navigation.navigate('StampHistory');
  };

  const {data: userInfo} = useQuery('userInfo', getUserInfo);

  const {isFeedbackButtonShown} = useFeedbackStore();

  // cold case
  const Empty = useMemo(
    () => (
      <View style={[styles.emptyArea, {height: SCREEN_HEIGHT * 0.8}]}>
        <Image
          source={require('@assets/common/404.png')}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyText}>
          네트워크 연결이 원활하지 않습니다.{'\n'}잠시 후 다시 시도해주세요.
        </Text>
        <Pressable style={styles.emptyBtn} onPress={handleRefresh}>
          <LinearGradient
            colors={['#FF6ECE', '#FF3DBD']}
            style={styles.emptyBtnBg}>
            <Text style={styles.emptyBtnText}>다시 시도</Text>
            <Image
              source={require('@assets/refresh.png')}
              style={styles.emptyBtnIcon}
            />
          </LinearGradient>
        </Pressable>
      </View>
    ),
    [],
  );

  const Loading = () => (
    <View
      style={{
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="#0000CC" />
    </View>
  );

  return (
    <LinearGradient
      colors={['white', '#FFFFCC']}
      locations={[0.8, 1]}
      style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <LinearGradient
        colors={['#FFCCEE', 'rgba(255, 255, 255, 0)']}
        locations={[0, 1]}
        style={[styles.header, {paddingVertical: SAFE_AREA_TOP}]}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeftContent}>
            <TouchableOpacity activeOpacity={0.7} onPress={goToNotification}>
              <Image
                source={require('@assets/Icon/Alert/alert_off.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            {userInfo && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={goToStampHistory}
                style={[styles.headerButton, {marginLeft: 12, width: 40}]}>
                <Image
                  source={require('@assets/Icon/stamp/stamps_blue.png')}
                  style={{width: 24, height: 24, marginLeft: -3}}
                />
                <View style={styles.stampArea}>
                  <Text style={styles.stampText} ellipsizeMode="clip">
                    {userInfo.stampQuantity > 999
                      ? '999+'
                      : userInfo.stampQuantity}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.headerTitle}>편지 탐색</Text>
          <View style={styles.headerRightContent}>
            <TouchableOpacity activeOpacity={0.7} onPress={goToMyPage}>
              <Image source={require('@assets/menu.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {isFeedbackButtonShown.Home || (
        <View style={[styles.feedbackBtn, {top: SAFE_AREA_TOP + 50}]}>
          <FeedbackButton screenName={'HOME'} />
        </View>
      )}
      <FlatList
        ref={publicLetterListRef}
        ListEmptyComponent={loading ? Loading : Empty}
        onScroll={handleScroll}
        onEndReached={handleEndReached}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={publicLetters}
        alwaysBounceVertical={false}
        contentContainerStyle={{paddingVertical: SAFE_AREA_TOP}}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          const {
            id,
            title,
            fromNickname,
            fromAddress,
            topics,
            personalities,
            paperColor,
            stampId,
          } = item;
          const isFirst: boolean = index === 0;
          const isLast: boolean = index === publicLetters.length - 1;
          const cardAngle = [-5, 5, 5, -5, 15, 5];
          return (
            <View
              style={[
                isFirst && {paddingTop: 110},
                isLast && {paddingBottom: 60},
              ]}>
              <PublicLetterItem
                id={id}
                title={`${title}`}
                fromNickname={fromNickname}
                fromAddress={fromAddress}
                topics={topics}
                personalities={personalities}
                paperColor={paperColor}
                stampId={stampId}
                alignType={'LEFT'}
                onOpenLetter={() => onOpenEnvelopeModal(item)}
                style={[
                  index % 2 === 0
                    ? {left: '26%', marginTop: -36}
                    : {left: '-6%', marginTop: -152},
                  {
                    transform: [
                      {
                        rotate: `${cardAngle[index % 6]}deg`,
                      },
                    ],
                  },
                ]}
              />
            </View>
          );
        }}
      />
      <View style={styles.floatArea}>
        {currentPositionY > 0 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.btn, styles.btnPrimary]}
            onPress={scrollToTop}>
            <Image source={require('@assets/top.png')} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.btn, styles.btnPrimary]}
            onPress={handleRefresh}>
            <Image
              source={require('@assets/refresh.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.btn, styles.btnSecondary]}
          onPress={goToLetterEditor}>
          <Image source={require('@assets/write.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {selectedItem && (
        <EnvelopeModal
          type="PUBLIC"
          data={selectedItem}
          isModalVisible={isEnvelopeModalVisible}
          setModalVisible={setEnvelopeModalVisible}
          onOpenLetter={() => goToLetterViewer(selectedItem.id)}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    width: '100%',
    height: 160,
  },
  headerInner: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerLeftContent: {
    flexDirection: 'row',
    position: 'absolute',
    left: 16,
    height: 52,
    alignItems: 'center',
  },
  headerTitle: {fontFamily: 'Galmuri11', fontSize: 15, color: '#0000cc'},
  headerRightContent: {
    position: 'absolute',
    right: 16,
    height: 52,
    justifyContent: 'center',
  },
  headerButton: {
    position: 'relative',
    width: 28,
    height: 28,
    justifyContent: 'center',
  },
  stampArea: {
    position: 'absolute',
    left: 9,
    bottom: -2,
    height: 16,
    paddingHorizontal: 4,
    backgroundColor: '#0000CC',
    borderRadius: 8,
  },
  stampText: {
    fontFamily: 'Galmuri11-Bold',
    fontSize: 10,
    color: 'white',
    lineHeight: 15,
  },
  floatArea: {position: 'absolute', right: 24, bottom: 100},
  btn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 24,
  },
  btnPrimary: {backgroundColor: '#0000CC'},
  btnSecondary: {
    backgroundColor: '#FFFFCC',
    borderWidth: 1,
    borderColor: '#0000CC',
  },
  triangle: {position: 'absolute', bottom: 0, width: 4, height: 5},
  icon: {width: 28, height: 28},
  emptyArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {width: 100, height: 100},
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Galmuri11',
    fontSize: 14,
    lineHeight: 25,
    color: '#0000CC',
  },
  emptyBtn: {
    overflow: 'hidden',
    height: 28,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#FF44CC',
    borderRadius: 10,
  },
  emptyBtnBg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
    paddingLeft: 12,
  },
  emptyBtnText: {
    fontFamily: 'Galmuri11',
    fontSize: 13,
    color: 'white',
    marginBottom: 2,
  },
  emptyBtnIcon: {width: 20, height: 20, marginLeft: 2},
  feedbackBtn: {
    position: 'absolute',
    width: '100%',
    zIndex: 11,
    padding: 16,
  },
});
