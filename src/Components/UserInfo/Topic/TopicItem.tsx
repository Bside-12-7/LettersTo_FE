import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import type {Topic} from '@type/types';

type Props = {
  topic: Topic;
  selectedTopicIds?: number[];
  parent?: 'preview';
};

export function TopicItem({topic, selectedTopicIds, parent}: Props) {
  return (
    <View
      style={[
        styles.topic,
        selectedTopicIds?.includes(topic.id)
          ? styles.selectedTopic
          : styles.notSelectedTopic,
        parent === 'preview' && {
          height: 24,
          paddingHorizontal: 5,
          marginRight: 5,
        },
      ]}>
      <Text style={[styles.topicText, parent === 'preview' && {fontSize: 12}]}>
        {topic.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topic: {
    height: 35,
    borderColor: '#0000cc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 13,
  },
  selectedTopic: {
    height: 35,
    backgroundColor: '#ccccff',
  },
  notSelectedTopic: {backgroundColor: 'white'},
  topicText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000cc',
  },
});
