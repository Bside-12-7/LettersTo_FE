import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useKeyboard} from '@hooks/Hardware/useKeyboard';

const photoButton = require('@assets/photo.png');
const paperButton = require('@assets/paper.png');
const texticonButton = require('@assets/texticon.png');
const keyboardButton = require('@assets/keyboardDismiss.png');

const textAlign = {
  left: require('@assets/textAlignLeft.png'),
  center: require('@assets/textAlignCenter.png'),
  right: require('@assets/textAlignRight.png'),
};

type Props = {
  paddingOn: boolean;
  align: 'left' | 'center' | 'right';
  selectedFunc?: 'PAPER' | 'TEXTICON';
  onToggleTextAlign: () => void;
  onShowPaper: () => void;
  onShowTexticon: () => void;
  pickImage: () => void;
};

export const BottomBar = React.memo(
  ({
    paddingOn,
    align,
    selectedFunc,
    onToggleTextAlign,
    onShowPaper,
    onShowTexticon,
    pickImage,
  }: Props) => {
    const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

    const {keyboardVisible, dismissKeyboard} = useKeyboard();

    return (
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: paddingOn ? SAFE_AREA_BOTTOM : 0,
          },
        ]}>
        <View style={styles.bottomBarButtonWrap}>
          <Pressable onPress={pickImage} style={styles.bottomBarButton}>
            <Image source={photoButton} style={styles.buttonImage} />
          </Pressable>
          <Pressable onPress={onShowPaper} style={styles.bottomBarButton}>
            <Image source={paperButton} style={styles.buttonImage} />
          </Pressable>

          <Pressable onPress={onToggleTextAlign} style={styles.bottomBarButton}>
            <Image source={textAlign[align]} style={styles.buttonImage} />
          </Pressable>

          <Pressable onPress={onShowTexticon} style={styles.bottomBarButton}>
            <Image source={texticonButton} style={styles.texticonButtonImage} />
          </Pressable>
        </View>
        {keyboardVisible && (
          <Pressable onPress={dismissKeyboard}>
            <Image source={keyboardButton} style={styles.buttonImage} />
          </Pressable>
        )}
        {selectedFunc && (
          <Pressable
            onPress={() => {
              if (selectedFunc === 'PAPER') onShowPaper();
              else if (selectedFunc === 'TEXTICON') onShowTexticon();
            }}>
            <Text style={styles.completeFuncButtonText}>선택완료</Text>
          </Pressable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bottomBarButtonWrap: {
    marginVertical: 14,
    flexDirection: 'row',
  },
  bottomBarButton: {marginRight: 16},
  buttonImage: {height: 24, width: 24},
  texticonButtonImage: {height: 24, width: 60},
  completeFuncButtonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Galmuri11',
  },
});
