import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import type {Personality} from '@type/types';

type Props = {
  personality: Personality;
  selectedPersonalityIds?: number[];
  parent?: 'preview';
};

export function PersonalityItem({
  personality,
  selectedPersonalityIds,
  parent,
}: Props) {
  return (
    <View
      style={[
        styles.personality,
        selectedPersonalityIds?.includes(personality.id)
          ? styles.selectedPersonality
          : styles.notSelectedPersonality,
        parent === 'preview' && {
          height: 24,
          paddingHorizontal: 5,
          marginRight: 5,
        },
      ]}>
      <Text
        style={[
          styles.personalityText,
          parent === 'preview' && {fontSize: 12},
        ]}>
        {personality.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  personality: {
    height: 35,
    borderColor: '#0000cc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 13,
  },
  selectedPersonality: {
    height: 35,
    backgroundColor: '#ccccff',
  },
  notSelectedPersonality: {backgroundColor: 'white'},
  personalityText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000cc',
  },
});
