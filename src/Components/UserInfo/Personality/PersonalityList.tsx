import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import type {Personalities} from '@type/types';

type Props = {
  personalities: Personalities;
  selectPersonality: (personalityId: number) => void;
  selectedPersonalityIds: number[];
};

export const PersonalityList = React.memo(
  ({personalities, selectPersonality, selectedPersonalityIds}: Props) => {
    return (
      <View style={styles.personalityWrap}>
        {personalities.map(personality => {
          return (
            <TouchableHighlight
              key={personality.id}
              style={styles.underlayer}
              underlayColor={'#0000cc'}
              activeOpacity={0.7}
              onPress={() => selectPersonality(personality.id)}>
              <View
                style={[
                  styles.personality,
                  selectedPersonalityIds.includes(personality.id)
                    ? styles.selectedPersonality
                    : styles.notSelectedPersonality,
                ]}>
                <Text style={styles.personalityText}>{personality.name}</Text>
              </View>
            </TouchableHighlight>
          );
        })}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  personalityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
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
