import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {BottomTab} from '@components/BottomTab/BottomTab';

interface Props {
  navigation: NativeStackNavigationProp<StackParamsList>;
}

export const RealtimeChat = ({navigation}: Props) => {
  const goToHome = useCallback(() => {
    navigation.navigate('Main');
  }, [navigation]);

  const goToLetterBox = useCallback(() => {
    navigation.navigate('Main');
  }, [navigation]);

  const goToRealtimeChat = useCallback(() => {
    // Already on RealtimeChat
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>실시간 통신</Text>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              실시간 통신 기능이 곧 추가됩니다
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomTab
        currentScreen="RealtimeChat"
        onPressHome={goToHome}
        onPressLetterBox={goToLetterBox}
        onPressRealtimeChat={goToRealtimeChat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerText: {
    fontFamily: 'Galmuri11',
    fontSize: 18,
    color: '#0000CC',
  },
  content: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  placeholderText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#999999',
  },
});
