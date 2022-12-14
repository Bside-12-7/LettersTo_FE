import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {StackParamsList} from '../../../types/stackParamList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StampSelector} from '../../../Components/LetterEditor/Cover/StampSelector';
import {LetterCoverPreview} from '../../../Components/LetterEditor/LetterCoverPreview';
import useStore, {useLetterEditorStore} from '../../../Store/store';
import {DeliveryLetterCoverPreview} from '../../../Components/LetterEditor/DeliveryLetterCoverPreview';
import {Header2} from '../../../Components/Headers/Header2';
import {StepIndicator} from '../../../Components/StepIndicator';

type Props = NativeStackScreenProps<StackParamsList, 'CoverStampSelector'>;

export function CoverStampSelector({navigation, route}: Props) {
  const [selectedStampId, setSelectedStampId] = useState<number>();

  const {
    setCoverStampId,
    cover: {stamp},
    userInfo,
  } = useStore();

  const stampQuantity = userInfo?.stampQuantity ?? 0;

  const {setDeliveryLetterData} = useLetterEditorStore();

  const {top: SAFE_AREA_TOP} = useSafeAreaInsets();

  const disableNext = useMemo(() => !selectedStampId, [selectedStampId]);

  const goBack = () => {
    navigation.pop();
  };

  const goNext = () => {
    if (disableNext) return;

    if (route.params) {
      setDeliveryLetterData({stampId: selectedStampId});

      navigation.navigate('LetterComplete', {
        reply: route.params.reply,
        to: route.params.to,
      });
    } else {
      navigation.navigate('LetterComplete');
    }
  };

  useEffect(() => {
    if (stamp) {
      setSelectedStampId(stamp);
    }
  }, [stamp]);

  useEffect(() => {
    if (!route.params?.reply) {
      setCoverStampId(selectedStampId);
    } else {
      setDeliveryLetterData({stampId: selectedStampId});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDeliveryLetterData, selectedStampId, setCoverStampId]);

  const step = useMemo(() => {
    if (!route.params?.reply) {
      return 3;
    }
    return 2;
  }, [route.params?.reply]);

  return (
    <View style={{flex: 1}}>
      <View
        style={[
          styles.coverContainer,
          {
            height: 332 + SAFE_AREA_TOP,
            paddingTop: SAFE_AREA_TOP,
          },
        ]}>
        <Header2
          title="?????? ??????"
          onPressBack={goBack}
          onPressNext={goNext}
          disableNext={disableNext}
        />
        <View style={styles.cover}>
          {!route.params?.reply ? (
            <LetterCoverPreview />
          ) : (
            <DeliveryLetterCoverPreview />
          )}
        </View>
        <StepIndicator current={step} of={step} />
      </View>
      <StampSelector
        stampQuantity={stampQuantity}
        selectedStampId={selectedStampId}
        setSelectedStampId={setSelectedStampId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  coverContainer: {
    backgroundColor: '#ffccee',
  },
  cover: {paddingTop: 12, paddingHorizontal: 40},
});
