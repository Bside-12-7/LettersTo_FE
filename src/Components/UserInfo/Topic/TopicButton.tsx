import React from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';

import type {Topic} from '@type/types';
import {TopicItem} from './TopicItem';

type Props = {
  topic: Topic;
  selectTopic: (topicId: number) => void;
  selectedTopicIds: number[];
};

export function TopicButton({topic, selectTopic, selectedTopicIds}: Props) {
  return (
    <TouchableHighlight
      key={topic.id}
      style={styles.underlayer}
      underlayColor={'#0000cc'}
      activeOpacity={0.7}
      onPress={() => selectTopic(topic.id)}>
      <TopicItem topic={topic} selectedTopicIds={selectedTopicIds} />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  underlayer: {
    marginBottom: 12,
    marginRight: 12,
  },
  topic: {
    height: 35,
    borderColor: '#0000cc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTopic: {
    height: 35,
    backgroundColor: '#ccccff',
  },
  notSelectedTopic: {backgroundColor: 'white'},
  topicText: {
    marginHorizontal: 13,
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000cc',
  },
});
