import React from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';

import type {Personality} from '@type/types';
import {PersonalityItem} from '@components/UserInfo/Personality/PersonalityItem';

type Props = {
  personality: Personality;
  selectPersonality: (personalityId: number) => void;
  selectedPersonalityIds: number[];
};

export function PersonalityButton({
  personality,
  selectPersonality,
  selectedPersonalityIds,
}: Props) {
  return (
    <TouchableHighlight
      key={personality.id}
      style={styles.underlayer}
      underlayColor={'#0000cc'}
      activeOpacity={0.7}
      onPress={() => selectPersonality(personality.id)}>
      <PersonalityItem
        personality={personality}
        selectedPersonalityIds={selectedPersonalityIds}
      />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  underlayer: {
    marginBottom: 12,
    marginRight: 12,
  },
  personality: {
    height: 35,
    borderColor: '#0000cc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPersonality: {
    height: 35,
    backgroundColor: '#ccccff',
  },
  notSelectedPersonality: {backgroundColor: 'white'},
  personalityText: {
    marginHorizontal: 13,
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000cc',
  },
});
