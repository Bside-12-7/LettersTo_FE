import React, {useState, useEffect, useMemo, useCallback} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  LetterBoxInfo,
  DeliveryLetter,
  DeliveryLetters,
  PaperColor,
} from '@type/types';
import {getLetterBoxInfo, getDeliveryLettersV2} from '@apis/letterBox';
import {Header2} from '@components/Headers/Header2';
import {dateFormatter} from '@utils/dateFormatter';
import {LetterItem} from './LetterItem';
import {EnvelopeModal} from '@components/Modals/Letter/EnvelopeModal';
import Toast from '@components/Toast/toast';
import {getRandomColor} from '@utils/deeplink';

const triangleImg = require('@assets/Icon/tool/bottomTabButtonEdge.png');

type Props = NativeStackScreenProps<StackParamsList, 'LetterBoxDetail'>;

export function LetterBoxDetail({route, navigation}: Props) {
  const {top: SAFE_AREA_TOP, bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  // 메인 (편지탐색)
  const goHome = () => {
    navigation.push('Main');
  };

  // 사서함 정보
  const [info, setInfo] = useState<LetterBoxInfo>();

  // 주고받은 편지 목록
  const [deliveryLetters, setDeliveryLetters] = useState<DeliveryLetters | []>(
    [],
  );
  const [currentCursor, setCurrentCursor] = useState<number>();
  const [avatarColor, setAvatarColor] = useState<PaperColor>();

  const getPublicLettersInitV2 = useCallback((id: number) => {
    try {
      getDeliveryLettersV2({letterBoxId: id}).then(data => {
        const {content, cursor} = data;
        setDeliveryLetters(content);
        setCurrentCursor(cursor);
      });
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다');
    }
  }, []);

  useEffect(() => {
    const {id, color} = route.params;
    setAvatarColor((color ?? getRandomColor()) as PaperColor);

    // 사서함 정보 조회
    try {
      getLetterBoxInfo(id).then(data => {
        setInfo(data);
      });
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다');
    }

    // 주고받은 편지 목록 조회
    getPublicLettersInitV2(id);
  }, [getPublicLettersInitV2, route]);

  // 무한 스크롤
  const handleEndReached = useCallback(() => {
    if (currentCursor && route.params.id) {
      try {
        getDeliveryLettersV2({
          cursor: currentCursor,
          letterBoxId: route.params.id,
        }).then(data => {
          const {content, cursor} = data;
          if (content.length === 0) return setCurrentCursor(undefined); // 임시
          const updatedArray = [...deliveryLetters].concat(content);
          setDeliveryLetters(updatedArray);
          setCurrentCursor(cursor);
        });
      } catch (error: any) {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      }
    }
  }, [currentCursor, deliveryLetters, route.params.id]);

  // n일째 인연
  const fromPeriod = useMemo(() => {
    if (info) {
      const startDate = new Date(info.startDate);
      const today = new Date();
      const distance = today.getTime() - startDate.getTime();
      const days = Math.floor(distance / (1000 * 60 * 60 * 24)) + 1;
      return days;
    }
  }, [info]);

  // 편지 시작일
  const fromDate = useMemo(() => {
    if (info) {
      const date = dateFormatter('yyyy.mm.dd', info.startDate);
      return date;
    }
  }, [info]);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const toggleTooltip = () => setTooltipVisible(!tooltipVisible);

  // 봉투 열기
  const [selectedItem, setSelectedItem] = useState<DeliveryLetter>();
  const [isEnvelopeModalVisible, setEnvelopeModalVisible] = useState(false);

  const onOpenEnvelopeModal = (item: DeliveryLetter) => {
    setSelectedItem(item);
    setEnvelopeModalVisible(true);
  };

  // 편지 조회
  const goToLetterViewer = useCallback(
    (id: number) => {
      navigation.navigate('LetterViewer', {
        id,
        to: 'DELIVERY',
        type: route.params.type,
      });
    },
    [navigation, route.params.type],
  );

  const goBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={{paddingTop: SAFE_AREA_TOP, backgroundColor: '#0000cc'}}>
        <Header2
          title={`${info?.fromNickname}와의 사서함`}
          color={'white'}
          onPressBack={goBack}
        />
      </View>
      <View style={styles.infoArea}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoNickname}>{info?.fromNickname}</Text>
          <Text style={styles.infoAddress}>{info?.fromAddress}</Text>
          {fromPeriod && (
            <>
              <TouchableWithoutFeedback onPress={toggleTooltip}>
                <View style={styles.infoDate}>
                  <Text style={styles.infoDateText}>{fromPeriod}일째 인연</Text>
                  <Image
                    style={styles.iconQuestion}
                    source={require('@assets/question.png')}
                  />
                </View>
              </TouchableWithoutFeedback>
              {tooltipVisible && (
                <View style={styles.tooltipArea}>
                  <Text style={styles.tooltipText}>편지 시작일 {fromDate}</Text>
                  <Image
                    style={styles.tooltipTail}
                    source={require('@assets/tooltip.png')}
                  />
                </View>
              )}
            </>
          )}
        </View>
        <View style={styles.tagArea}>
          <Text style={styles.tagTitle}>관심사</Text>
          <ScrollView
            horizontal
            alwaysBounceHorizontal={false}
            showsHorizontalScrollIndicator={false}>
            {info?.topics.map((item: string, idx: number) => {
              const isLast: boolean = idx === info.topics.length - 1;
              return (
                <Text
                  key={idx}
                  style={[styles.tagItem, isLast && {marginRight: 16}]}>
                  {item}
                </Text>
              );
            })}
          </ScrollView>
        </View>
        <View style={[styles.tagArea, {marginTop: 8}]}>
          <Text style={styles.tagTitle}>성향</Text>
          <ScrollView
            horizontal
            alwaysBounceHorizontal={false}
            showsHorizontalScrollIndicator={false}>
            {info?.personalities.map((item: string, idx: number) => {
              const isLast: boolean = idx === info.personalities.length - 1;
              return (
                <Text
                  key={idx}
                  style={[styles.tagItem, isLast && {marginRight: 16}]}>
                  {item}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <FlatList
        data={deliveryLetters}
        onEndReached={handleEndReached}
        keyExtractor={item => String(item.id)}
        renderItem={({item, index}) => {
          const isFirst: boolean = index === 0;
          const isLast: boolean = index === deliveryLetters.length - 1;
          return (
            <LetterItem
              data={item}
              color={avatarColor}
              onOpenLetter={() =>
                item.read
                  ? goToLetterViewer(item.id)
                  : onOpenEnvelopeModal(item)
              }
              style={[
                {marginTop: isFirst ? 24 : 16},
                isLast && {marginBottom: 80},
              ]}
            />
          );
        }}
      />
      <View style={[styles.tabBottom, {height: SAFE_AREA_BOTTOM || 12}]}>
        <View style={styles.tabArea}>
          <Pressable onPress={goHome}>
            <View style={styles.tabInactive}>
              <Text style={styles.tabInactiveText}>편지탐색</Text>
              <Image
                source={triangleImg}
                style={[styles.triangle, {right: 0}]}
              />
            </View>
          </Pressable>
          <Pressable disabled>
            <View style={styles.tabActive}>
              <Image
                source={triangleImg}
                style={[
                  styles.triangle,
                  {left: '100%', transform: [{scaleX: -1}]},
                ]}
              />
              <Text style={styles.tabActiveText}>내 사서함</Text>
            </View>
          </Pressable>
        </View>
      </View>
      {selectedItem && (
        <EnvelopeModal
          type="DELIVERY"
          data={selectedItem}
          isModalVisible={isEnvelopeModalVisible}
          setModalVisible={setEnvelopeModalVisible}
          onOpenLetter={() => goToLetterViewer(selectedItem.id)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  infoArea: {
    paddingBottom: 24,
    backgroundColor: '#FFCCEE',
    borderBottomWidth: 1,
    borderBottomColor: '#0000CC',
  },
  infoHeader: {
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 24,
  },
  infoNickname: {fontFamily: 'Galmuri11-Bold', fontSize: 14, color: '#0000CC'},
  infoAddress: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
    marginLeft: 8,
  },
  infoDate: {flexDirection: 'row', alignItems: 'center', marginLeft: 'auto'},
  infoDateText: {fontFamily: 'Galmuri11', fontSize: 12, color: '#0000CC'},
  iconQuestion: {width: 20, height: 20, top: 1, marginLeft: 2},
  tooltipArea: {
    position: 'absolute',
    top: 45,
    right: 12,
    height: 32,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFCC',
    borderWidth: 1,
    borderColor: '#0000CC',
    borderRadius: 5,
  },
  tooltipText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
    lineHeight: 28,
  },
  tooltipTail: {
    position: 'absolute',
    top: -3.5,
    right: 12,
    transform: [{scaleY: -1}],
    width: 5,
    height: 4,
  },
  tagArea: {flexDirection: 'row', alignItems: 'center'},
  tagTitle: {
    width: 84,
    paddingLeft: 16,
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000CC',
  },
  tagItem: {
    height: 24,
    lineHeight: 24,
    paddingRight: 3,
    paddingLeft: 6,
    marginRight: 4,
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
    backgroundColor: 'rgba(0, 0, 204, 0.05)',
    borderWidth: 1,
    borderColor: '#0000CC',
  },
  tabBottom: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#0000CC',
  },
  tabArea: {
    position: 'absolute',
    left: 0,
    bottom: '100%',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  tabActive: {
    position: 'relative',
    right: 1,
    width: 164,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000CC',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabInactive: {
    width: 164,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#0000CC',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabActiveText: {fontFamily: 'Galmuri11', fontSize: 15, color: 'white'},
  tabInactiveText: {fontFamily: 'Galmuri11', fontSize: 15, color: '#0000CC'},
  triangle: {position: 'absolute', bottom: 0, width: 4, height: 5},
});
