import React, {useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Modal,
  Image,
  ImageBackground,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGesture} from '../Hooks/Hardware/useGesture';
import {GRADIENT_COLORS} from '../Constants/letter';
import {PublicLetter, DeliveryLetter, PaperColor} from '../types/types';
import {dateFormatter} from '../Utils/dateFormatter';

interface EnvelopeModalProps {
  type: 'PUBLIC' | 'DELIVERY';
  data: PublicLetter | DeliveryLetter;
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenLetter: (id: number) => void;
}

export const EnvelopeModal = ({
  type,
  data,
  isModalVisible,
  setModalVisible,
  onOpenLetter,
}: EnvelopeModalProps) => {
  const {
    id,
    title,
    me,
    deliveryType,
    deliveryDate,
    toNickname,
    toAddress,
    fromAddress,
    fromNickname,
    topics,
    personalities,
    paperColor = 'PINK' as PaperColor,
    stampId,
  } = data;

  const {top: SAFE_AREA_TOP} = useSafeAreaInsets();

  type StampType = {
    [key: number]: any;
  };
  const STAMPS: StampType = {
    1: require('../Assets/stamp/1.png'),
    2: require('../Assets/stamp/2.png'),
    3: require('../Assets/stamp/3.png'),
    4: require('../Assets/stamp/4.png'),
    5: require('../Assets/stamp/5.png'),
    6: require('../Assets/stamp/6.png'),
  };

  // 애니메이션
  const moveAnim = useRef(new Animated.ValueXY()).current;
  const moveUp = Animated.timing(moveAnim, {
    toValue: {x: 0, y: -9},
    duration: 1000,
    useNativeDriver: true,
    easing: Easing.elastic(2),
  });

  // 뜯어서 편지 열어보기
  const openLetter = () => {
    moveUp.start(() => {
      onOpenLetter(id);
      setTimeout(hideModal, 0);
    });
  };

  const {onSwipeXStart, onSwipteXEnd} = useGesture();

  // 모달 닫기
  const hideModal = () => {
    setModalVisible(false);
    moveUp.reset();
  };

  useEffect(() => {
    moveUp.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const letterTitle = useMemo(() => {
    if (!title) return '무제';
    if (title.length > 26) {
      return `${title.substr(0, 26)}…`;
    }
    return title;
  }, [title]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={hideModal}>
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(0, 0, 204, 0)', 'rgba(0, 0, 204, 0.5)']}
          style={styles.modalBg}>
          {/* 모달 닫기 버튼 */}
          <Pressable
            style={[styles.closeButton, {marginTop: SAFE_AREA_TOP}]}
            onPress={hideModal}>
            <Image
              source={require('../Assets/close_white.png')}
              style={styles.closeIcon}
            />
          </Pressable>
          {/* 뜯어서 편지 열어보기 */}
          <Pressable style={styles.openArea} onPress={openLetter}>
            <Text style={styles.openText}>뜯어서 편지 열어보기</Text>
            <Image
              source={require('../Assets/arrow_long.png')}
              style={styles.openArrow}
              resizeMode="contain"
            />
          </Pressable>
          <View style={styles.envelope}>
            <Animated.View
              style={[styles.cardTop, {transform: [{translateY: moveAnim.y}]}]}>
              <View
                style={{flex: 1, backgroundColor: GRADIENT_COLORS[paperColor]}}
              />
              <View style={styles.dashBot} />
            </Animated.View>
            <View style={[styles.cardItem]}>
              <View style={[styles.dashTop]} />
              <LinearGradient
                locations={[0, 0.5]}
                colors={[GRADIENT_COLORS[paperColor], 'white']}
                style={{flex: 1}}>
                {/* 우표 */}
                {deliveryType === 'STANDARD' ? (
                  <View style={styles.stampArea}>
                    <ImageBackground
                      source={require('../Assets/bg_stamp.png')}
                      style={styles.stampBg}>
                      <Image style={styles.stampImg} source={STAMPS[stampId]} />
                      <Image
                        style={styles.stampType}
                        source={require('../Assets/stamp_standard.png')}
                      />
                    </ImageBackground>
                  </View>
                ) : deliveryType === 'EXPRESS' ? (
                  <View style={styles.stampArea}>
                    <ImageBackground
                      source={require('../Assets/bg_stamp.png')}
                      style={[
                        styles.stampBg,
                        {position: 'absolute', transform: [{rotate: '10deg'}]},
                      ]}
                    />
                    <ImageBackground
                      source={require('../Assets/bg_stamp.png')}
                      style={[
                        styles.stampBg,
                        {position: 'absolute', transform: [{rotate: '-5deg'}]},
                      ]}
                    />
                    <ImageBackground
                      source={require('../Assets/bg_stamp.png')}
                      style={styles.stampBg}>
                      <Image style={styles.stampImg} source={STAMPS[stampId]} />
                      <Image
                        style={styles.stampType}
                        source={require('../Assets/stamp_express.png')}
                      />
                    </ImageBackground>
                  </View>
                ) : (
                  <View style={styles.stampArea}>
                    <ImageBackground
                      source={require('../Assets/bg_stamp.png')}
                      style={styles.stampBg}>
                      <Image style={styles.stampImg} source={STAMPS[stampId]} />
                    </ImageBackground>
                  </View>
                )}
                <Text style={styles.title}>⌜{letterTitle}⌟︎︎</Text>
                <View style={styles.fromArea}>
                  {me ? (
                    <>
                      <Image
                        style={[styles.fromImg, {width: 25}]}
                        source={require('../Assets/to.png')}
                      />
                      <Text
                        style={
                          styles.fromText
                        }>{`${toNickname},\n${toAddress}`}</Text>
                    </>
                  ) : (
                    <>
                      <Image
                        style={[styles.fromImg, {width: 48}]}
                        source={require('../Assets/from.png')}
                      />
                      <Text
                        style={
                          styles.fromText
                        }>{`${fromNickname},\n${fromAddress}`}</Text>
                    </>
                  )}
                </View>
                {type === 'PUBLIC' && (
                  <View style={styles.tagArea}>
                    <ScrollView
                      horizontal
                      alwaysBounceHorizontal={false}
                      showsHorizontalScrollIndicator={false}
                      style={styles.tagList}>
                      {topics?.map((item: string, idx: number) => (
                        <Text key={idx} style={styles.tagItem}>
                          {item}
                        </Text>
                      ))}
                    </ScrollView>
                    <ScrollView
                      horizontal
                      alwaysBounceHorizontal={false}
                      showsHorizontalScrollIndicator={false}
                      style={styles.tagList}>
                      {personalities?.map((item: string, idx: number) => (
                        <Text key={idx} style={styles.tagItem}>
                          {item}
                        </Text>
                      ))}
                    </ScrollView>
                  </View>
                )}
                {type === 'DELIVERY' && (
                  <View style={styles.deliveryInfo}>
                    <View style={styles.deliveryAddress}>
                      <Text style={styles.deliveryAddressText}>
                        {fromAddress}
                      </Text>
                      <Image
                        style={styles.arrow}
                        resizeMode="contain"
                        source={require('../Assets/arrow.png')}
                      />
                      <Text style={styles.deliveryAddressText}>
                        {toAddress}
                      </Text>
                    </View>
                    <Text style={styles.deliveryDate}>
                      {dateFormatter('yyyy.mm.dd', deliveryDate)}
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </View>
            <View
              style={styles.swipeArea}
              onStartShouldSetResponder={() => true}
              onResponderStart={event => {
                onSwipeXStart(
                  event.nativeEvent.locationX,
                  event.nativeEvent.timestamp,
                );
              }}
              onResponderEnd={event => {
                onSwipteXEnd(
                  event.nativeEvent.locationX,
                  event.nativeEvent.timestamp,
                  150,
                  1000,
                  openLetter,
                );
              }}
            />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'rgba(0, 0, 204, 0.7)'},
  modalBg: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  closeButton: {position: 'absolute', top: 12, left: 16},
  closeIcon: {width: 28, height: 28},
  openArea: {position: 'absolute', bottom: '64%', alignItems: 'center'},
  openText: {fontFamily: 'Galmuri11', fontSize: 15, color: 'white'},
  openArrow: {width: 144, height: 10, marginTop: 16},
  envelope: {position: 'absolute', top: '40%', width: '80%'},
  swipeArea: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  dashBot: {
    position: 'absolute',
    bottom: -1,
    width: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#0000CC',
  },
  dashTop: {
    position: 'absolute',
    top: -1,
    width: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#0000CC',
  },
  cardTop: {
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
    height: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#0000CC',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  cardItem: {
    position: 'relative',
    overflow: 'hidden',
    height: 206,
    backgroundColor: 'white',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#0000CC',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  title: {
    position: 'absolute',
    bottom: 150,
    left: 16,
    width: '60%',
    height: 44,
    marginTop: 10,
    fontFamily: 'Galmuri11',
    fontSize: 13,
    lineHeight: 23,
    color: '#0000CC',
  },
  fromArea: {position: 'absolute', top: 50, left: 16, width: '60%'},
  fromImg: {height: 22, resizeMode: 'contain'},
  fromText: {
    marginLeft: 16,
    fontFamily: 'Galmuri11',
    fontSize: 12,
    lineHeight: 21.5,
    color: '#0000CC',
  },
  stampArea: {position: 'absolute', bottom: 106, right: 16},
  stampBg: {width: 74, height: 90, padding: 7},
  stampImg: {width: 60, height: 76},
  stampType: {width: 46, height: 17, position: 'absolute', top: 7, left: 7},
  tagArea: {position: 'absolute', bottom: 16, right: 16, left: 16},
  tagList: {flexDirection: 'row', marginTop: 8},
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
  deliveryInfo: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    left: 16,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 204, 0.05)',
  },
  deliveryAddress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryAddressText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
  },
  arrow: {width: 31, height: 7, marginHorizontal: 8, marginTop: 2},
  deliveryDate: {
    fontFamily: 'Galmuri11',
    fontSize: 11,
    color: '#0000CC',
    marginTop: 3,
  },
});
