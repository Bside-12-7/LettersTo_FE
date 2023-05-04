import React, {useMemo} from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import {PublicLetter} from '@type/types';
import {LinearGradient} from 'expo-linear-gradient';
import {GRADIENT_COLORS} from '../Constants/letter';
import {STAMP_IMAGES} from '@constants/stamp';

const stampBgImg = require('@assets/Icon/stamp/bg_stamp.png');
const fromImg = require('@assets/Icon/letter/from.png');

interface PublicLetterItemProps extends PublicLetter {
  style?: object;
  onOpenLetter: () => void;
}

export function PublicLetterItem(props: PublicLetterItemProps) {
  const {
    title,
    fromNickname,
    fromAddress,
    topics,
    personalities,
    paperColor,
    stampId,
    style,
    onOpenLetter,
  } = props;

  const letterTitle = useMemo(() => {
    if (!title) return '무제';
    if (title.length > 26) {
      return `${title.substr(0, 26)}…`;
    }
    return title;
  }, [title]);

  return (
    <Pressable style={[styles.publicLetterItem, style]} onPress={onOpenLetter}>
      <LinearGradient
        locations={[0, 0.5]}
        colors={[GRADIENT_COLORS[paperColor], 'white']}
        style={styles.background}>
        <ImageBackground source={stampBgImg} style={styles.stampArea}>
          <Image style={styles.stampImg} source={STAMP_IMAGES[stampId]} />
        </ImageBackground>
        <Text style={styles.title}>⌜{letterTitle}⌟︎︎</Text>
        <View style={styles.fromArea}>
          <Image style={styles.fromImg} source={fromImg} />
          <Text
            style={styles.fromText}>{`${fromNickname},\n${fromAddress}`}</Text>
        </View>
        <View style={styles.tagArea}>
          <View style={styles.tagList}>
            {topics
              ?.filter((el: string, idx: number) => idx < 4)
              .map((item, idx) => (
                <Text key={idx} style={styles.tagItem}>
                  {item}
                </Text>
              ))}
            {topics?.length > 4 && (
              <Text style={styles.tagItem}>{`+${topics.length - 4}`}</Text>
            )}
          </View>
          <View style={styles.tagList}>
            {personalities
              ?.filter((el: string, idx: number) => idx < 4)
              .map((item, idx) => (
                <Text key={idx} style={styles.tagItem}>
                  {item}
                </Text>
              ))}
            {personalities?.length > 4 && (
              <Text style={styles.tagItem}>{`+${
                personalities.length - 4
              }`}</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  publicLetterItem: {
    position: 'relative',
    overflow: 'hidden',
    width: '80%',
    height: 212,
    borderWidth: 1,
    borderColor: '#0000CC',
    borderRadius: 10,
    shadowColor: '#FF6ECE',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
        shadowRadius: 50,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  background: {flex: 1},
  title: {
    width: '60%',
    marginTop: 16,
    marginLeft: 16,
    fontFamily: 'Galmuri11',
    fontSize: 13,
    lineHeight: 23,
    color: '#0000CC',
  },
  fromArea: {position: 'absolute', top: 60, left: 16, width: '60%'},
  fromImg: {width: 48, height: 22, resizeMode: 'contain'},
  fromText: {
    marginLeft: 16,
    fontFamily: 'Galmuri11',
    fontSize: 12,
    lineHeight: 21.5,
    color: '#0000CC',
  },
  stampArea: {position: 'absolute', top: 16, right: 16, padding: 7},
  stampImg: {width: 60, height: 76},
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
});
