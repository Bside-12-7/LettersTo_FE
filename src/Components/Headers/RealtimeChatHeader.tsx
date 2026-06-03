import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

const back_white = require('@assets/back_white.png');
const home_white = require('@assets/Icon/Home/home_white.png');
const warning_white = require('@assets/warning_white.png');

interface Props {
  stampQuantity: number;
  onPressBack: () => void;
  onPressHome: () => void;
  onPressStamp: () => void;
  onPressNotice: () => void;
}

export const RealtimeChatHeader = ({
  stampQuantity,
  onPressBack,
  onPressHome,
  onPressStamp,
  onPressNotice,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={[styles.iconButton, {marginRight: 8}]}
          activeOpacity={0.7}
          onPress={onPressBack}>
          <Image source={back_white} style={{height: 28, width: 28}} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={onPressHome}>
          <Image source={home_white} style={{height: 28, width: 28}} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>실시간통신 포털</Text>

      <View style={styles.rightSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressNotice}
          style={styles.noticeButton}>
          <Image source={warning_white} style={styles.noticeIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressStamp}
          style={styles.stampButton}>
          <Image
            source={require('@assets/Icon/stamp/stamps_white.png')}
            style={styles.stampIcon}
          />
          <View style={styles.stampCountContainer}>
            <Text style={styles.stampCountText}>
              {stampQuantity > 99 ? '99+' : stampQuantity}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
  },
  iconText: {
    fontSize: 16,
    color: 'white',
  },
  title: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    color: 'white',
    letterSpacing: 0.3,
    lineHeight: 24.75,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  noticeButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  noticeIcon: {
    width: 24,
    height: 24,
  },
  stampButton: {
    width: 40,
    height: 28,
    position: 'relative',
  },
  stampIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  stampCountContainer: {
    position: 'absolute',
    right: 5,
    bottom: 0,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 22,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampCountText: {
    fontFamily: 'Galmuri11',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0000cc',
    textAlign: 'center',
  },
});
