import React from 'react';
import {StyleSheet, Text, ScrollView, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {Header2} from '@components/Headers/Header2';

type Props = NativeStackScreenProps<StackParamsList, 'ChatServiceGuide'>;

const RULES = [
  '서로를 존중하는 대화를 나눠주세요. 욕설, 비하, 혐오 표현은 금지됩니다.',
  '광고, 홍보, 영리 목적의 활동은 할 수 없어요.',
  '성별, 연락처 등 타인의 개인정보를 요구하지 마세요.',
  '오프라인 만남을 유도하는 행위는 금지됩니다.',
  '음란물, 폭력적인 내용, 불법 콘텐츠 공유는 금지됩니다.',
  '특정 유저를 반복적으로 괴롭히거나 불편하게 하는 행위는 제재 대상입니다.',
];

export const ChatServiceGuideScreen = ({navigation}: Props) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <Header2
        title="채팅서비스 이용 안내"
        color="blue"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {RULES.map(rule => (
          <Text key={rule} style={styles.ruleText}>
            {'· '}
            {rule}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  ruleText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 12,
  },
});
