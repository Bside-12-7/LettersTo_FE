import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const textBalloonImg = require('@assets/Icon/reward/reward_balloon.png');
const timerProgressingImg = require('@assets/Icon/reward/reward_timer.png');
const timerDoneImg = require('@assets/Icon/reward/reward_timer_done.png');

type DoneProps = {
  onPressReward: () => void;
};

type ProgressingProps = {
  timer: string;
};

export const RewardTimer = {
  Progressing: ({timer}: ProgressingProps) => (
    <View style={styles.container}>
      <View style={styles.textBalloon}>
        <ImageBackground style={styles.textBalloonImg} source={textBalloonImg}>
          <Text style={styles.textBalloonText}>
            {'다음 우표 받기까지 남은 시간!'}
          </Text>
        </ImageBackground>
      </View>

      <ImageBackground style={styles.timerImg} source={timerProgressingImg}>
        <Text style={styles.timerText}>{timer}</Text>
      </ImageBackground>
    </View>
  ),
  Done: ({onPressReward}: DoneProps) => (
    <View style={styles.container}>
      <View style={styles.textBalloon}>
        <ImageBackground style={styles.textBalloonImg} source={textBalloonImg}>
          <Text style={styles.textBalloonText}>
            {'지금 우표를 받을 수 있어요!'}
          </Text>
        </ImageBackground>
      </View>

      <TouchableOpacity onPress={onPressReward} activeOpacity={0.7}>
        <ImageBackground style={styles.timerImg} source={timerDoneImg} />
      </TouchableOpacity>
    </View>
  ),
  End: () => <></>,
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  textBalloon: {marginBottom: 12},
  textBalloonImg: {
    height: 35,
    width: 224,
    paddingBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBalloonText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
  },
  timerImg: {
    height: 120,
    width: 128,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontFamily: 'Galmuri11-Bold',
    fontSize: 18,
    color: '#FF44CC',
  },
});
