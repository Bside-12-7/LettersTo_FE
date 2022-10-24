import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Header} from '../../Components/Header';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants';
import {StackParamsList} from '../../types';

type Props = NativeStackScreenProps<StackParamsList, 'Multiline'>;

function Grid() {
  const renderHorizontal = () => {
    const result = [];
    for (let i = 0; i * 24 < SCREEN_HEIGHT; i++) {
      result.push(
        <View
          style={{
            height: 24,
            width: SCREEN_WIDTH,
            borderTopWidth: 1,
            borderColor: '#ff44cc0f',
          }}
        />,
      );
    }
    return result;
  };

  const renderVertical = () => {
    const result = [];
    for (let i = 0; i * 24 < SCREEN_HEIGHT; i++) {
      result.push(
        <View
          style={{
            height: SCREEN_HEIGHT,
            width: 24,
            borderRightWidth: 1,
            borderColor: '#ff44cc0f',
          }}
        />,
      );
    }
    return result;
  };

  return (
    <>
      <View style={{position: 'absolute'}}>
        <>{renderHorizontal()}</>
      </View>
      <View style={{position: 'absolute', flexDirection: 'row'}}>
        <>{renderVertical()}</>
      </View>
    </>
  );
}

export function Multiline({navigation}: Props) {
  const [title, setTitle] = useState('⌜오늘 서울은 하루종일 맑음⌟︎');
  const [text, setText] = useState(
    `밤새 켜뒀던 tv소리가 들린다 
햇살 아래는 늘 행복한 ㄱ. . . 
넌 지금 뭘하고 있을까 . . .
밤새 켜뒀던 tv소리가 들린다 
햇살 아래는 늘 행복한 ㄱ. . . 
넌 지금 뭘하고 있을까 . . .
밤새 켜뒀던 tv소리가 들린다 
햇살 아래는 늘 행복한 ㄱ. . . 
넌 지금 뭘하고 있을까 . . .
밤새 켜뒀던 tv소리가 들린다 
햇살 아래는 늘 행복한 ㄱ. . . 
넌 지금 뭘하고 있을까 . . .`,
  );
  return (
    <LinearGradient
      colors={['#ffccee', 'white', 'white', 'white', '#ffffcc']}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation} title={'편지 작성'} />

        <View style={{flex: 1, position: 'relative'}}>
          <Grid />
          <ScrollView>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={{
                height: 40,
                fontSize: 14,
                fontFamily: 'Galmuri11',
                paddingHorizontal: 24,
                color: '#0000cc',
                // backgroundColor: '#ff004466',
              }}
            />

            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              scrollEnabled={false}
              style={{
                lineHeight: 40,
                fontSize: 14,
                fontFamily: 'Galmuri11',
                paddingHorizontal: 24,
                color: '#0000cc',
                // backgroundColor: '#ff004466',
              }}
            />
          </ScrollView>
        </View>

        <View
          style={{
            height: 50,
            backgroundColor: '#0000cc',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <View>
            <Pressable>
              <Image
                source={require('../../Assets/paper.png')}
                style={{height: 24, width: 24}}
              />
            </Pressable>
          </View>
          <Pressable>
            <Image
              source={require('../../Assets/paper.png')}
              style={{height: 24, width: 24}}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
