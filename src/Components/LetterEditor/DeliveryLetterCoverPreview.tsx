import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import useStore, {useLetterEditorStore} from '../../Store/store';
import {GRADIENT_COLORS} from '../../Constants/letter';
import {getCities, getRegions} from '../../APIs/geolocation';
import {SCREEN_WIDTH} from '../../Constants/screen';
import {showToast} from '../Toast/toast';

const SelectedStampImage = ({stampId}: {stampId: number | undefined}) => {
  const {stamps} = useStore();
  return (
    <>
      {stampId ? (
        <Image
          style={{
            width: '85%',
            height: undefined,
            aspectRatio: 94 / 116,
            backgroundColor: '#0000cc13',
          }}
          source={stamps.find(stamp => stamp.id === stampId)?.image}
        />
      ) : (
        <View
          style={{
            width: '85%',
            height: undefined,
            aspectRatio: 94 / 116,
            backgroundColor: '#0000cc13',
            borderColor: '#0000cc',
            borderStyle: 'dashed',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{height: 18, width: 18}}
            source={require('../../Assets/photo_blue.png')}
          />
        </View>
      )}
    </>
  );
};

export const DeliveryLetterCoverPreview = React.memo(() => {
  const {userInfo} = useStore();
  const {deliveryLetter, deliveryLetterTo} = useLetterEditorStore();

  const [fromAddress, setFromAddress] = useState('');

  const titleText = useMemo(
    () => deliveryLetter?.title || '무제',
    [deliveryLetter?.title],
  );

  const getFromAddress = useCallback(async () => {
    try {
      if (userInfo?.parentGeolocationId && userInfo.geolocationId) {
        const userRegion = (await getRegions()).find(
          region => region.id === userInfo.parentGeolocationId,
        );
        const userCity = (await getCities(userInfo.parentGeolocationId)).find(
          city => city.id === userInfo.geolocationId,
        );

        setFromAddress([userRegion?.name, ' ', userCity?.name].join(''));
      } else {
        return '1';
      }
    } catch (error: any) {
      console.error(error.message);
      showToast('문제가 발생했습니다');
    }
  }, [userInfo]);

  useEffect(() => {
    getFromAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={[GRADIENT_COLORS[deliveryLetter?.paperColor ?? 'PINK'], 'white']}
      style={[
        {
          width: SCREEN_WIDTH - 80,
          // height: undefined,
          // aspectRatio: 295 / 212,
          // borderColor: '#0000cc',
          // borderWidth: 1,
          // borderRadius: 10,
          // padding: 16,
        },
        styles.container,
      ]}>
      <View style={styles.topArea}>
        <View style={styles.title}>
          <Text style={styles.titleText}>⌜{titleText}⌟︎︎</Text>
          <Image source={require('../../Assets/to.png')} style={styles.To} />
          <Text style={styles.fromText}>{deliveryLetterTo?.toNickname}</Text>
          <Text style={styles.fromText}>{deliveryLetterTo?.toAddress}</Text>
          <Image
            source={require('../../Assets/From..png')}
            style={styles.From}
          />
          <Text style={styles.fromText}>{userInfo?.nickname},</Text>
          <Text style={styles.fromText}>{fromAddress}</Text>
        </View>
        <View style={{flex: 74}}>
          <ImageBackground
            source={require('../../Assets/stamp.png')}
            style={styles.stampBg}>
            <SelectedStampImage stampId={deliveryLetter.stampId} />
          </ImageBackground>
        </View>
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  container: {
    height: undefined,
    aspectRatio: 295 / 212,
    borderColor: '#0000cc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    justifyContent: 'space-between',
  },
  topArea: {
    flexDirection: 'row',
  },
  title: {flex: 173, flexWrap: 'wrap', marginRight: 16},
  titleText: {
    width: '100%',
    height: 50,
    fontSize: 13,
    fontFamily: 'Galmuri11',
    color: '#0000CC',
    lineHeight: 22.1,
  },
  To: {height: 22, width: 25, resizeMode: 'contain', marginTop: 8},
  From: {height: 22, width: 48, resizeMode: 'contain', marginTop: 4},
  fromText: {
    marginLeft: 16,
    fontSize: 12,
    fontFamily: 'Galmuri11',
    color: '#0000CC',
    lineHeight: 20,
  },
  tagList: {flexDirection: 'row', marginTop: 8},
  stampBg: {
    width: 74,
    height: undefined,
    aspectRatio: 94 / 116,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topics: {marginBottom: 8},
});
