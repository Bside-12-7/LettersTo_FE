import React from 'react';
import {
  Animated,
  Platform,
  ImageBackground,
  Text,
  StyleSheet,
} from 'react-native';

const noticeBalloonImage = require('@assets/Icon/notice/noticeBalloon.png');

type Params = {
  noticeOpacity: Animated.Value;
};

export const NoticeBalloon = React.memo(({noticeOpacity}: Params) => (
  <Animated.View
    style={[
      Platform.OS === 'ios' ? styles.notice_ios : styles.notice_android,
      {
        opacity: noticeOpacity,
      },
    ]}>
    <ImageBackground
      style={styles.noticeBalloonImage}
      source={noticeBalloonImage}>
      <Text style={styles.noticeText}>
        편지를 배달하는 시간을 계산하기 위해 사용돼요!
      </Text>
    </ImageBackground>
  </Animated.View>
));

const styles = StyleSheet.create({
  notice_ios: {
    position: 'absolute',
    bottom: -12,
    left: 27,
    width: 288,
    height: 35,
    zIndex: 100,
  },
  notice_android: {
    position: 'absolute',
    bottom: -12,
    left: 18,
    width: 288,
    height: 35,
    zIndex: 100,
  },
  noticeBalloonImage: {
    width: 288,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
  },
});
