import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const triangleImg = require('@assets/Icon/tool/bottomTabButtonEdge.png');

interface Params {
  currentScreen: 'Home' | 'LetterBox';
  onPressHome: () => void;
  onPressLetterBox: () => void;
}

export const BottomTab = ({
  currentScreen,
  onPressHome,
  onPressLetterBox,
}: Params) => {
  const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  return (
    <View style={[styles.tabBottom, {height: SAFE_AREA_BOTTOM || 12}]}>
      <View style={styles.tabArea}>
        {currentScreen === 'Home' ? (
          <Pressable disabled>
            <View style={styles.tabActive}>
              <Image
                source={triangleImg}
                style={[styles.triangle, {right: '100%'}]}
              />
              <Text style={styles.tabActiveText}>편지탐색</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={onPressHome}>
            <View style={styles.tabInactive}>
              <Text style={styles.tabInactiveText}>편지탐색</Text>
              <Image
                source={triangleImg}
                style={[styles.triangle, {right: 0}]}
              />
            </View>
          </Pressable>
        )}
        {currentScreen === 'LetterBox' ? (
          <Pressable disabled>
            <View style={styles.tabActive}>
              <Image
                source={triangleImg}
                style={[
                  styles.triangle,
                  {right: -4, transform: [{scaleX: -1}]},
                ]}
              />
              <Text style={styles.tabActiveText}>내 사서함</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={onPressLetterBox}>
            <View style={styles.tabInactive}>
              <Image
                source={triangleImg}
                style={[styles.triangle, {left: 0, transform: [{scaleX: -1}]}]}
              />
              <Text style={styles.tabInactiveText}>내 사서함</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    left: 0,
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
