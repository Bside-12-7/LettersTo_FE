import {useCallback, useMemo, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {useQuery} from 'react-query';
import {getPersonalities} from '@apis/personality';
import Toast from '@components/Toast/toast';
import {MAX_PERSONALITY_LIMIT} from '@constants/user';

export const usePersonality = (currentPersonalities: number[] = []) => {
  // const [selectedPersonalityIds, setSelectedPersonalityIds] = useAuthStore(
  //   state => [
  //     state.registerInfo.personalityIds,
  //     state.action.setPersonalityIdsInRegisterInfo,
  //   ],
  // );

  const [selectedPersonalityIds, setSelectedPersonalityIds] = useState<
    number[]
  >([]);

  const counter = useMemo(
    () => selectedPersonalityIds.length,
    [selectedPersonalityIds],
  );

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

  const selectPersonality = useCallback(
    (personalityId: number) => {
      alert.reset();
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
        alert.start();
      }
    },
    [alert, counter, selectedPersonalityIds, setSelectedPersonalityIds],
  );

  const reset = useCallback(() => {
    setSelectedPersonalityIds(currentPersonalities);
  }, [setSelectedPersonalityIds, currentPersonalities]);

  const {data: personalities} = useQuery('personalities', getPersonalities, {
    onError: () => Toast.show('문제가 발생했습니다'),
  });

  return {
    personalities: personalities || [],
    selectedPersonalityIds,
    selectPersonality,
    alertOpacity,
    initUserPersonalityIds: setSelectedPersonalityIds,
    counter,
    reset,
    resetAlert,
  };
};
