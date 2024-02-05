import React, {useCallback} from 'react';
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import {SCREEN_HEIGHT} from '@constants/screen';
import {StampsList} from '@components/Stamp/StampsList';
import useStore from '@stores/store';
import {Title} from '@components/UserInfo/TitleText';

const stampImg = require('@assets/Icon/stamp/stamps_blue.png');

type Props = {
  stampQuantity: number;
  selectedStampId: number | undefined;
  selectStamp: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export function StampSelector({
  stampQuantity,
  selectedStampId,
  selectStamp,
}: Props) {
  const {stamps} = useStore();

  const onPressStamp = useCallback(
    (id: number) => {
      if (selectedStampId !== id) {
        if (stampQuantity > 0) {
          selectStamp(id);
        }
      } else {
        selectStamp(undefined);
      }
    },
    [selectedStampId, stampQuantity, selectStamp],
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <View style={styles.titleWrap}>
          <Title title={'우표를\n선택해주세요'} />
        </View>
        <View style={styles.counterWrap}>
          <Text style={styles.counter}>보유 우표</Text>
          <Image source={stampImg} style={{height: 24, width: 24}} />
          <Text style={styles.counter}>X {stampQuantity}</Text>
        </View>
      </View>

      <ScrollView alwaysBounceVertical={false} style={styles.personalityBox}>
        <StampsList
          stamps={stamps}
          selectedStampId={selectedStampId}
          onPressStamp={onPressStamp}
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
    fontSize: 13,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginHorizontal: 8,
    textAlign: 'right',
  },
  personalityBox: {
    paddingHorizontal: 14,
    height: SCREEN_HEIGHT * 0.6,
  },
});
