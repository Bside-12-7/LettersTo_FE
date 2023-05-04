import React, {useCallback, useMemo} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {SCREEN_HEIGHT} from '@constants/screen';
import {NextButton} from '@components/Button/Bottom/NextButton';
import {ResetButton} from '@components/Button/Reset/ResetButton';
import {TopicList} from '@components/UserInfo/Topic/TopicList';
import {useTopic} from '@hooks/UserInfo/useTopic';
import {MAX_TOPIC_LIMIT} from '@constants/user';
import {Counter} from '@components/UserInfo/CounterText';
import {MaximumAlert} from '@components/UserInfo/Alert/MaximumAlert';
import {Title} from '@components/UserInfo/TitleText';
import {Header2} from '@components/Headers/Header2';
import {useAuthAction} from '@stores/auth';
import type {StackParamsList} from '@type/stackParamList';

type Props = NativeStackScreenProps<StackParamsList, 'TopicsForm'>;

export const TopicsForm = ({navigation}: Props) => {
  const {topics, selectedTopicIds, selectTopic, alertOpacity, counter, reset} =
    useTopic();

  const {setTopicIdsInRegisterInfo} = useAuthAction();

  const disableNext = useMemo(
    () => selectedTopicIds.length === 0,
    [selectedTopicIds],
  );

  const goToPersonalityForm = useCallback(() => {
    setTopicIdsInRegisterInfo(selectedTopicIds);
    navigation.navigate('PersonalityForm');
  }, [navigation, selectedTopicIds, setTopicIdsInRegisterInfo]);

  const onPressBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <LinearGradient colors={['#ffccee', 'white', 'white', 'white', '#ffffcc']}>
      <SafeAreaView
        style={
          Platform.OS === 'android'
            ? styles.container_android
            : styles.container_ios
        }>
        <Header2 onPressBack={onPressBack} />
        <View style={styles.titleBox}>
          <Title title={'나의 관심사를\n모두 선택해주세요'} />
          <View style={styles.counterWrap}>
            <ResetButton reset={reset} />
            <Counter value={counter} max={MAX_TOPIC_LIMIT} />
          </View>
        </View>
        <ScrollView alwaysBounceVertical={false} style={styles.topicBox}>
          <TopicList
            topics={topics}
            selectTopic={selectTopic}
            selectedTopicIds={selectedTopicIds}
          />
        </ScrollView>
        <MaximumAlert alertOpacity={alertOpacity} max={MAX_TOPIC_LIMIT} />
        <NextButton disable={disableNext} onPress={goToPersonalityForm} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container_ios: {height: SCREEN_HEIGHT},
  container_android: {height: SCREEN_HEIGHT, paddingVertical: 15},
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  counterWrap: {alignItems: 'center', flexDirection: 'row'},
  topicBox: {
    flex: 1,
    marginHorizontal: 24,
  },
});
