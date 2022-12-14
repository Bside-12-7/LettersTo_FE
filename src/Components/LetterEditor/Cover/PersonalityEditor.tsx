import React, {useCallback, useEffect, useMemo} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {ResetButton} from '../../ResetButton';
import useStore from '../../../Store/store';
import {SCREEN_HEIGHT} from '../../../Constants/screen';
import {PersonalityList} from '../../PersonalityList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MAX_PERSONALITY_LIMIT} from '../../../Constants/user';

type Props = {
  selectedPersonalityIds: number[];
  setSelectedPersonalityIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export function PersonalityEditor({
  selectedPersonalityIds,
  setSelectedPersonalityIds,
}: Props) {
  const {userInfo, personalities} = useStore();

  const {bottom} = useSafeAreaInsets();

  const counter = useMemo(
    () => selectedPersonalityIds.length,
    [selectedPersonalityIds],
  );

  const selectPersonality = useCallback(
    (personalityId: number) => {
      // alert.reset();
      if (
        counter < MAX_PERSONALITY_LIMIT &&
        selectedPersonalityIds.includes(personalityId) === false
      ) {
        setSelectedPersonalityIds([...selectedPersonalityIds, personalityId]);
      } else if (selectedPersonalityIds.includes(personalityId) === true) {
        setSelectedPersonalityIds(
          [...selectedPersonalityIds].filter(e => e !== personalityId),
        );
      } else {
        // alert.start();
      }
    },
    [counter, selectedPersonalityIds, setSelectedPersonalityIds],
  );

  const reset = () => {
    if (userInfo) {
      setSelectedPersonalityIds([...userInfo.personalityIds]);
    }
  };

  useEffect(() => {
    const getUserPersonalities = () => {
      if (userInfo) {
        setSelectedPersonalityIds([...userInfo.personalityIds]);
      }
    };

    getUserPersonalities();
  }, [setSelectedPersonalityIds, userInfo]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        borderTopColor: '#0000cc',
        borderTopWidth: 1,
      }}>
      <View style={styles.titleBox}>
        <View style={styles.titleWrap}>
          <Text style={styles.titleText}>?????? ?????????</Text>
          <Text style={styles.titleText}>?????? ??????????????????</Text>
        </View>
        <View style={styles.counterWrap}>
          <ResetButton reset={reset} />
          <Text style={styles.counter}>
            {counter} / {MAX_PERSONALITY_LIMIT}
          </Text>
        </View>
      </View>

      <ScrollView alwaysBounceVertical={false} style={styles.personalityBox}>
        <View style={{paddingTop: 16, paddingBottom: bottom}}>
          <PersonalityList
            personalities={personalities}
            selectPersonality={selectPersonality}
            selectedPersonalityIds={selectedPersonalityIds}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBox: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  titleWrap: {
    // marginBottom: 30,
    justifyContent: 'flex-end',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginTop: 8,
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
    height: SCREEN_HEIGHT * 0.6,
  },
});
