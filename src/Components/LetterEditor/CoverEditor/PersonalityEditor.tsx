import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {ResetButton} from '@components/Button/Reset/ResetButton';
import {Title} from '@components/UserInfo/TitleText';
import {Personalities} from '@type/types';
import {Counter} from '@components/UserInfo/CounterText';
import {MAX_PERSONALITY_LIMIT} from '@constants/user';
import {PersonalityList} from '@components/UserInfo/Personality/PersonalityList';

type Props = {
  personalities: Personalities;
  selectedPersonalityIds: number[];
  selectPersonality: (personalityId: number) => void;
  counter: number;
  reset: () => void;
};

export function PersonalityEditor({
  personalities,
  selectedPersonalityIds,
  selectPersonality,
  counter,
  reset,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Title title={'나의 성향을\n모두 선택해주세요'} />
        <View style={styles.counterWrap}>
          <ResetButton reset={reset} />
          <Counter value={counter} max={MAX_PERSONALITY_LIMIT} />
        </View>
      </View>
      <ScrollView alwaysBounceVertical={false} style={styles.personalityBox}>
        <PersonalityList
          personalities={personalities}
          selectPersonality={selectPersonality}
          selectedPersonalityIds={selectedPersonalityIds}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopColor: '#0000cc',
    borderTopWidth: 1,
  },
  titleBox: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  counterWrap: {alignItems: 'center', flexDirection: 'row'},
  counter: {
    width: 48,
    fontSize: 13,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginHorizontal: 8,
    textAlign: 'right',
  },
  personalityBox: {
    marginHorizontal: 24,
  },
});
