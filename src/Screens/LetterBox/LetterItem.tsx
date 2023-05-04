import React, {useEffect, useMemo, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {DeliveryLetter, PaperColor} from '@type/types';
import {LinearGradient} from 'expo-linear-gradient';
import {GRADIENT_COLORS} from '@constants/letter';
import {dateFormatter} from '@utils/dateFormatter';
import {SCREEN_WIDTH} from '@constants/screen';
import {STAMP_IMAGES} from '@constants/stamp';
const stampBgImg = require('@assets/Icon/stamp/bg_stamp.png');
const fromImg = require('@assets/Icon/letter/from.png');

interface LetterItemProps {
  data: DeliveryLetter;
  color?: PaperColor;
  style?: object;
  onOpenLetter?: () => void;
}

export function LetterItem(props: LetterItemProps) {
  const {data, color, style, onOpenLetter} = props;
  const {
    paperColor,
    stampId,
    read,
    me,
    title,
    deliveryType,
    deliveryDate,
    toNickname,
    toAddress,
    fromNickname,
    fromAddress,
  } = data;

  // 애니메이션
  const moveAnim = useRef(
    new Animated.ValueXY({x: SCREEN_WIDTH, y: 0}),
  ).current;
  const moveX = Animated.timing(moveAnim, {
    toValue: {x: 0, y: 0},
    duration: 1000,
    useNativeDriver: true,
    easing: Easing.elastic(1),
  });

  useEffect(() => {
    moveX.reset();
    moveX.start();
  }, [moveX]);

  const IsArrived = useMemo(() => {
    const arrivalDate = new Date(deliveryDate);
    const today = new Date();
    const result: boolean = today.getTime() > arrivalDate.getTime();
    return result;
  }, [deliveryDate]);

  const DdayText = useMemo(() => {
    const arrivalDate = new Date(deliveryDate);
    const today = new Date();
    const distance = arrivalDate.getTime() - today.getTime();
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let result = '';
    if (days) {
      result += `${days}일 `;
    }
    if (hours) {
      result += `${hours}시간 `;
    }
    if (minutes) {
      result += `${minutes}분 `;
    }
    result += '후 도착';
    return result;
  }, [deliveryDate]);

  const letterTitle = useMemo(() => {
    if (!title) {
      return '무제';
    }
    if (title.length > 26) {
      return `${title.substr(0, 26)}…`;
    }
    return title;
  }, [title]);

  const ArrivedLetter = () => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.letterItem]}
      onPress={onOpenLetter}>
      <View
        style={{
          flex: 1,
        }}>
        <LinearGradient
          locations={[0, 0.5]}
          colors={[GRADIENT_COLORS[paperColor], 'white']}
          style={[styles.background]}>
          {/* 우표 */}
          {deliveryType === 'STANDARD' ? (
            <View style={styles.stampArea}>
              <ImageBackground source={stampBgImg} style={styles.stampBg}>
                <Image style={styles.stampImg} source={STAMP_IMAGES[stampId]} />
                <Image
                  style={styles.stampType}
                  source={require('@assets/stamp_standard.png')}
                />
              </ImageBackground>
            </View>
          ) : deliveryType === 'EXPRESS' ? (
            <View style={styles.stampArea}>
              <ImageBackground
                source={stampBgImg}
                style={[
                  styles.stampBg,
                  {position: 'absolute', transform: [{rotate: '10deg'}]},
                ]}
              />
              <ImageBackground
                source={stampBgImg}
                style={[
                  styles.stampBg,
                  {position: 'absolute', transform: [{rotate: '-5deg'}]},
                ]}
              />
              <ImageBackground source={stampBgImg} style={styles.stampBg}>
                <Image style={styles.stampImg} source={STAMP_IMAGES[stampId]} />
                <Image
                  style={styles.stampType}
                  source={require('@assets/stamp_express.png')}
                />
              </ImageBackground>
            </View>
          ) : (
            <View style={styles.stampArea}>
              <ImageBackground source={stampBgImg} style={styles.stampBg}>
                <Image style={styles.stampImg} source={STAMP_IMAGES[stampId]} />
              </ImageBackground>
            </View>
          )}
          <Text style={styles.title}>⌜{letterTitle}⌟︎︎</Text>
          <View style={styles.fromArea}>
            {me ? (
              <>
                <Image
                  style={[styles.fromImg, {width: 25}]}
                  source={require('@assets/to.png')}
                />
                <Text
                  style={
                    styles.fromText
                  }>{`${toNickname},\n${toAddress}`}</Text>
              </>
            ) : (
              <>
                <Image style={[styles.fromImg, {width: 48}]} source={fromImg} />
                <Text
                  style={
                    styles.fromText
                  }>{`${fromNickname},\n${fromAddress}`}</Text>
              </>
            )}
          </View>
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryAddress}>
              <Text style={styles.deliveryAddressText}>{fromAddress}</Text>
              <Image
                style={styles.arrow}
                resizeMode="contain"
                source={require('@assets/arrow.png')}
              />
              <Text style={styles.deliveryAddressText}>{toAddress}</Text>
            </View>
            <Text style={styles.deliveryDate}>
              {dateFormatter('yyyy.mm.dd', deliveryDate)}
            </Text>
          </View>
        </LinearGradient>
      </View>
      {read && (
        <Image source={require('@assets/read_white.png')} style={styles.read} />
      )}
    </TouchableOpacity>
  );

  const PendingLetter = () => (
    <View style={[styles.letterItem]}>
      <LinearGradient
        locations={[0, 0.5]}
        colors={[GRADIENT_COLORS[paperColor], 'white']}
        style={[styles.background, {alignItems: 'center'}]}>
        <View style={styles.tooltipArea}>
          <Text style={styles.tooltipText}>
            {me
              ? `${toAddress}(으)로 편지가 가고 있어요!`
              : `${fromAddress}에서 편지가 오고 있어요!`}
          </Text>
          <Image
            style={styles.tooltipTail}
            source={require('@assets/tooltip.png')}
          />
        </View>
        <Image
          style={styles.pendingImg}
          source={require('@assets/pending.png')}
        />
        <Text style={styles.pendingText}>{DdayText}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <Animated.View
      style={[
        me ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'},
        {marginHorizontal: 16, justifyContent: 'space-between'},
        style,
        !read && {transform: [{translateX: moveAnim.getLayout().left}]},
      ]}>
      <View
        style={[
          {justifyContent: 'space-between', alignItems: 'center'},
          me ? {marginLeft: 12} : {marginRight: 12},
        ]}>
        <Text
          style={[
            styles.avatar,
            {
              backgroundColor: me
                ? '#CCCCFF'
                : GRADIENT_COLORS[color || 'PINK'],
            },
          ]}>
          {me ? '나' : fromNickname[0]}
        </Text>
        <View>
          <Text style={styles.readText}>{read ? '읽음' : '안읽음'}</Text>
          {!read && !me && <View style={styles.dot} />}
        </View>
      </View>
      {IsArrived ? <ArrivedLetter /> : <PendingLetter />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  letterItem: {flex: 1, height: 214},
  read: {position: 'absolute', top: 0, left: 0, width: '100%', height: 11},
  background: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0000CC',
    borderRadius: 10,
  },
  title: {
    width: '60%',
    marginTop: 16,
    marginLeft: 16,
    fontFamily: 'Galmuri11',
    fontSize: 13,
    lineHeight: 23,
    color: '#0000CC',
  },
  stampArea: {position: 'absolute', bottom: 106, right: 16},
  stampBg: {width: 74, height: 90, padding: 7},
  stampImg: {width: 60, height: 76},
  stampType: {width: 46, height: 17, position: 'absolute', top: 7, left: 7},
  tooltipArea: {
    height: 32,
    marginTop: 47,
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
    top: '100%',
    left: '50%',
    width: 5,
    height: 4,
    marginLeft: -25,
  },
  fromArea: {position: 'absolute', bottom: 90, left: 16},
  fromImg: {height: 22, resizeMode: 'contain'},
  fromText: {
    marginLeft: 16,
    fontFamily: 'Galmuri11',
    fontSize: 12,
    lineHeight: 21.5,
    color: '#0000CC',
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
  pendingImg: {width: 118, height: 24, marginTop: 16},
  pendingText: {
    marginTop: 8,
    fontFamily: 'Galmuri11',
    fontSize: 11,
    color: '#0000CC',
  },
  avatar: {
    overflow: 'hidden',
    width: 36,
    height: 36,
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: 'Galmuri11-Bold',
    fontSize: 13,
    color: '#0000CC',
    borderWidth: 1,
    borderColor: '#0000CC',
    borderRadius: 18,
  },
  readText: {fontFamily: 'Galmuri11', fontSize: 11, color: '#0000CC'},
  dot: {
    position: 'absolute',
    top: 3,
    right: -2,
    width: 2,
    height: 2,
    backgroundColor: '#FF44CC',
  },
});
