import React, {useState, useEffect} from 'react';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LinearGradient} from 'expo-linear-gradient';
import {SCREEN_HEIGHT} from '@constants/screen';
import {LetterBoxes, PaperColor} from '@type/types';
import {getLetterBoxes} from '@apis/letterBox';
import {GRADIENT_COLORS} from '@constants/letter';
import Toast from '@components/Toast/toast';
import {getUserInfo} from '@apis/member';
import {useQuery} from 'react-query';
import {useFeedbackStore} from '@stores/feedback';
import {FeedbackButton} from '@components/Feedback/FeedbackButton';

type Props = {
  navigation: NativeStackNavigationProp<StackParamsList, 'Main', undefined>;
  onPressHome: () => void;
};

export function LetterBoxList({navigation, onPressHome}: Props) {
  const {top: SAFE_AREA_TOP} = useSafeAreaInsets();
  // const {userInfo} = useStore();

  // 내 사서함 목록
  const [letterBoxes, setLetterBoxes] = useState<LetterBoxes>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {isFeedbackButtonShown} = useFeedbackStore();

  const getLetterBoxesInit = () => {
    try {
      getLetterBoxes().then(data => {
        setLetterBoxes(data);
        setLoading(false);
      });
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다');
    }
  };

  useEffect(() => {
    setLoading(true);
    getLetterBoxesInit();
  }, []);

  const {data: userInfo} = useQuery('userInfo', getUserInfo);

  // 내 사서함 상세
  const goToDetail = (id: number, fromMemberId: number, color: PaperColor) => {
    navigation.push('LetterBoxDetail', {id, fromMemberId, color});
  };

  const goToNotification = () => {
    navigation.navigate('Notifications');
  };

  const goToStampHistory = () => {
    navigation.navigate('StampHistory');
  };

  const goToMyPage = () => {
    navigation.navigate('MyPage');
  };

  // cold case
  const Empty = () => (
    <View style={styles.emptyArea}>
      <Image
        source={require('@assets/no_data.png')}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>
        아직 주고받은 편지가 없어요!{'\n'}답장할 편지를 찾아볼까요?
      </Text>
      <Pressable style={styles.emptyBtn} onPress={onPressHome}>
        <LinearGradient
          colors={['#FF6ECE', '#FF3DBD']}
          style={styles.emptyBtnBg}>
          <Text style={styles.emptyBtnText}>공개편지 보러가기</Text>
        </LinearGradient>
      </Pressable>
    </View>
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
      locations={[0, 0.1, 0.8, 1]}
      colors={['#FFCCEE', 'white', 'white', '#FFFFCC']}
      style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={[styles.header, {marginTop: SAFE_AREA_TOP}]}>
        <View style={[styles.headerInner]}>
          <View style={{position: 'absolute', left: 16, flexDirection: 'row'}}>
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
                  <Text
                    style={styles.stampText}
                    numberOfLines={1}
                    ellipsizeMode="clip">
                    {userInfo.stampQuantity > 999
                      ? '999+'
                      : userInfo.stampQuantity}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.pageTitle}>내 사서함</Text>
          <View style={{position: 'absolute', right: 16, flexDirection: 'row'}}>
            <TouchableOpacity activeOpacity={0.7} onPress={goToMyPage}>
              <Image source={require('@assets/menu.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isFeedbackButtonShown.LetterBox || (
        <View style={[styles.feedbackBtn, {top: SAFE_AREA_TOP + 50}]}>
          <FeedbackButton screenName={'LETTERBOX'} />
        </View>
      )}
      <FlatList
        ListEmptyComponent={loading ? Loading : Empty}
        contentContainerStyle={{marginTop: SAFE_AREA_TOP}}
        data={letterBoxes}
        renderItem={({item, index}) => {
          const isFirst: boolean = index === 0;
          const isLast: boolean = index === letterBoxes.length - 1;
          const color = [
            'PINK',
            'ORANGE',
            'YELLOW',
            'GREEN',
            'MINT',
            'SKY_BLUE',
            'BLUE',
            'PURPLE',
            'LAVENDER',
          ] as const;
          return (
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.listItem,
                isFirst && {marginTop: 50},
                isLast && {marginBottom: 100},
              ]}
              onPress={() =>
                goToDetail(item.id, item.fromMemberId, color[index % 9])
              }>
              <View
                style={[
                  styles.listItemIcon,
                  {backgroundColor: GRADIENT_COLORS[color[index % 9]]},
                ]}>
                <Text style={styles.listItemIconText}>
                  {item.fromMemberNickname[0]}
                </Text>
              </View>
              <Text style={styles.listItemTitle}>
                {item.fromMemberNickname}와(과)의 사서함
              </Text>
              <View style={styles.letterArea}>
                <Image
                  source={require('@assets/letter_blank.png')}
                  resizeMode="contain"
                  style={[styles.letterBlank]}
                />
                {item.new && (
                  <>
                    <View style={styles.dot} />
                    <Image
                      source={require('@assets/letter_new.png')}
                      resizeMode="contain"
                      style={[styles.letterNew]}
                    />
                  </>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {position: 'absolute', zIndex: 10, top: 0, left: 0, width: '100%'},
  headerInner: {
    position: 'relative',
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  pageTitle: {fontFamily: 'Galmuri11', fontSize: 15, color: '#0000CC'},
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    paddingRight: 24,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0000CC',
  },
  listItemIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#0000CC',
    borderRadius: 18,
  },
  listItemIconText: {
    fontFamily: 'Galmuri11-Bold',
    fontSize: 13,
    color: '#0000CC',
  },
  listItemTitle: {
    width: '50%',
    fontFamily: 'Galmuri11',
    fontSize: 14,
    lineHeight: 24,
    color: '#0000CC',
  },
  letterArea: {marginLeft: 'auto'},
  letterBlank: {width: 100, height: 10},
  letterNew: {position: 'absolute', top: 1, right: 8, width: 79, height: 16},
  dot: {
    position: 'absolute',
    top: -8,
    right: 0,
    width: 4,
    height: 4,
    backgroundColor: '#FF44CC',
    borderRadius: 2,
  },
  icon: {width: 28, height: 28},
  emptyArea: {
    height: SCREEN_HEIGHT,
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
    paddingRight: 10,
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
