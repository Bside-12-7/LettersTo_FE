import React from 'react';
import {StyleSheet, Text, ScrollView, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {Header2} from '@components/Headers/Header2';

type Props = NativeStackScreenProps<StackParamsList, 'ChatServiceGuide'>;

// 카피 미확정 — 헤딩만 placeholder 로 노출
const SECTIONS = ['이용 룰 안내', '건전한 채팅', '신고 방법', '신고 적용 등등'];

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
        {SECTIONS.map(section => (
          <Text key={section} style={styles.sectionTitle}>
            {section}
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
  sectionTitle: {
    fontFamily: 'Galmuri11',
    fontSize: 16,
    color: '#0000CC',
    marginBottom: 12,
  },
});
