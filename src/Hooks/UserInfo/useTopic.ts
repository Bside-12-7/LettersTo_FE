import {useCallback, useMemo, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {useQuery} from 'react-query';
import {getTopics} from '@apis/topic';
import {MAX_TOPIC_LIMIT} from '@constants/user';

export const useTopic = (currentTopics: number[] = []) => {
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);

  const counter = useMemo(() => selectedTopicIds.length, [selectedTopicIds]);

  const alertOpacity = useRef(new Animated.Value(0)).current;

  const alert = Animated.sequence([
    Animated.timing(alertOpacity, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }),
    Animated.timing(alertOpacity, {
      toValue: 0,
      delay: 2000,
      useNativeDriver: true,
    }),
  ]);

  const resetAlert = useCallback(() => {
    alert.reset();
  }, [alert]);

  const selectTopic = useCallback(
    (topicId: number) => {
      alert.reset();
      if (
        counter < MAX_TOPIC_LIMIT &&
        selectedTopicIds.includes(topicId) === false
      ) {
        setSelectedTopicIds([...selectedTopicIds, topicId]);
      } else if (selectedTopicIds.includes(topicId) === true) {
        setSelectedTopicIds([...selectedTopicIds].filter(e => e !== topicId));
      } else {
        alert.start();
      }
    },
    [alert, counter, selectedTopicIds, setSelectedTopicIds],
  );

  const reset = useCallback(() => {
    setSelectedTopicIds(currentTopics);
  }, [setSelectedTopicIds, currentTopics]);

  const {data: topics} = useQuery('topics', getTopics);

  return {
    topics: topics || [],
    selectedTopicIds,
    selectTopic,
    initUserTopicIds: setSelectedTopicIds,
    alertOpacity,
    counter,
    reset,
    resetAlert,
  };
};
