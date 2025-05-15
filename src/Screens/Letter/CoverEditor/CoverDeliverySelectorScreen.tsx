import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {StackParamsList} from '@type/stackParamList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LetterCoverPreview} from '@components/LetterEditor/CoverPreview/LetterCoverPreview';
import useStore, {useLetterEditorStore} from '@stores/store';
import {DeliveryLetterCoverPreview} from '@components/LetterEditor/CoverPreview/DeliveryLetterCoverPreview';
import {Header2} from '@components/Headers/Header2';
import {LinearGradient} from 'expo-linear-gradient';
import {StepIndicator} from '@components/StepIndicator';
import {PRIVATE_COVER_EDIT_STEPS} from '@constants/user';
import {getDeliveryDate, getEstimatedDeliveryTime} from '@apis/letter';
import {DeliveryType} from '@type/types';
import {getUserInfo} from '@apis/member';
import {useQuery} from 'react-query';
import {getCities, getRegions} from '@apis/geolocation';
import Toast from '@components/Toast/toast';

const stampsImg = require('@assets/Icon/stamp/stamps_blue.png');
const stampImg = require('@assets/Icon/stamp/stamp_blue.png');
const expressTypeImg = require('@assets/Icon/delivery/Express.png');

type Props = NativeStackScreenProps<StackParamsList, 'CoverDeliverySelector'>;

export function CoverDeliverySelector({navigation, route}: Props) {
  const {top: SAFE_AREA_TOP} = useSafeAreaInsets();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('STANDARD');

  const {
    deliveryLetter,
    deliveryLetterTo,
    standardDeliveryDate,
    setStandardDeliveryDate,
  } = useLetterEditorStore();

  const {setDeliveryLetterData} = useLetterEditorStore();

  const {setCoverAddress, setCoverNickname} = useStore();

  const {data: userInfo, isSuccess} = useQuery('userInfo', getUserInfo);

  const disableNext = useMemo(() => {
    if (!userInfo) {
      return false;
    } else if (deliveryType === 'EXPRESS' && userInfo.stampQuantity < 5) {
      return true;
    } else if (deliveryType === 'STANDARD' && userInfo.stampQuantity < 1) {
      return true;
    } else {
      return false;
    }
  }, [deliveryType, userInfo]);

  const goBack = () => {
    navigation.pop();
  };

  const goNext = () => {
    setDeliveryLetterData({deliveryType: deliveryType});
    navigation.navigate('CoverStampSelector', {
      reply: route.params.reply,
      to: route.params.to,
    });
  };

  useEffect(() => {
    const getStandardDeliveryDate = async () => {
      if (deliveryLetter.letterId) {
        const {deliveryDate} = await getDeliveryDate(deliveryLetter.letterId);
        setStandardDeliveryDate(deliveryDate);
      }

      if (deliveryLetterTo?.addressId) {
        const {deliveryTime} = await getEstimatedDeliveryTime(
          'STANDARD',
          deliveryLetterTo.addressId,
        );
        setStandardDeliveryDate(deliveryTime);
      }
    };

    getStandardDeliveryDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getFromAddress = async (
      parentGeolocationId: number,
      geolocationId: number,
    ) => {
      const userRegion = (await getRegions()).find(
        (region: any) => region.id === geolocationId,
      );
      const userCity = (await getCities(geolocationId)).find(
        (city: any) => city.id === parentGeolocationId,
      );

      setCoverAddress(userRegion?.name || '', userCity?.name || '');
    };

    if (userInfo) {
      if (deliveryLetter.letterBoxType === 'DIRECT_MESSAGE')
        setCoverNickname(userInfo.safeNickname);
      else setCoverNickname(userInfo.nickname);
      try {
        getFromAddress(userInfo.geolocationId, userInfo.parentGeolocationId);
      } catch (error: any) {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      }
    }
  }, [setCoverAddress, setCoverNickname, userInfo]);

  if (!isSuccess) {
    return <></>;
  }

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
          title={'발송 방법 선택'}
          onPressBack={goBack}
          onPressNext={goNext}
          disableNext={disableNext}
        />
        <View style={styles.cover}>
          {!route.params ? (
            <LetterCoverPreview />
          ) : (
            <DeliveryLetterCoverPreview />
          )}
        </View>
        <StepIndicator
          current={PRIVATE_COVER_EDIT_STEPS.DELIVERY}
          of={PRIVATE_COVER_EDIT_STEPS.total}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderTopColor: '#0000cc',
          borderTopWidth: 1,
        }}>
        <View style={styles.titleBox}>
          <View style={styles.titleWrap}>
            <Text style={styles.titleText}>발송 방법을</Text>
            <Text style={styles.titleText}>선택해주세요</Text>
          </View>
          <View style={styles.counterWrap}>
            <Text style={styles.counter}>보유 우표</Text>
            <Image source={stampsImg} style={{height: 24, width: 24}} />
            <Text style={styles.counter}>X {userInfo.stampQuantity}</Text>
          </View>
        </View>
        <ScrollView>
          <View style={{flex: 1, padding: 24}}>
            <TouchableOpacity
              onPress={() => {
                if (userInfo.stampQuantity >= 1) {
                  setDeliveryType('STANDARD');
                }
              }}
              style={[
                {
                  width: '100%',
                  height: undefined,
                  aspectRatio: 327 / 132,
                  marginBottom: 20,
                  padding: 10,
                },
                deliveryType === 'STANDARD'
                  ? {
                      borderWidth: 1,
                      borderColor: '#0000cc',
                      borderRadius: 10,
                    }
                  : {
                      borderWidth: 1,
                      borderColor: '#7e7e7e',
                      borderRadius: 10,
                    },
              ]}>
              <View
                style={[
                  {flex: 1, padding: 10},
                  deliveryType === 'STANDARD' && {
                    backgroundColor: 'rgb(239,239,251)',
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Galmuri11-Bold',
                      fontSize: 15,
                      color: '#0000cc',
                    }}>
                    Standard
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={stampImg}
                      style={{
                        height: 20,
                        width: 20,
                        marginRight: 5,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: 'Galmuri11',
                        fontSize: 13,
                        color: '#0000cc',
                      }}>
                      X 1
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontFamily: 'Galmuri11',
                    fontSize: 15,
                    color: '#0000cc',
                  }}>
                  {standardDeliveryDate}후에 도착해요
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (userInfo.stampQuantity >= 5) {
                  setDeliveryType('EXPRESS');
                }
              }}
              style={[
                {
                  width: '100%',
                  height: undefined,
                  aspectRatio: 327 / 132,
                  padding: 10,
                },
                deliveryType === 'EXPRESS'
                  ? {
                      borderWidth: 1,
                      borderColor: '#0000cc',
                      borderRadius: 10,
                    }
                  : {
                      borderWidth: 1,
                      borderColor: '#cccccc',
                      borderRadius: 10,
                    },
              ]}>
              <LinearGradient
                colors={
                  deliveryType === 'EXPRESS'
                    ? [
                        '#FF47C119',
                        '#FFFF0019',
                        '#89F50019',
                        '#44EFFF19',
                        '#FF47C119',
                      ]
                    : ['white', 'white']
                }
                style={[{flex: 1, padding: 10}]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                  <Image
                    source={expressTypeImg}
                    style={{
                      height: 28,
                      width: 75,
                      resizeMode: 'contain',
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={stampImg}
                      style={{
                        height: 20,
                        width: 20,
                        marginRight: 5,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: 'Galmuri11',
                        fontSize: 13,
                        color: '#0000cc',
                      }}>
                      X 5
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontFamily: 'Galmuri11',
                    fontSize: 15,
                    color: '#0000cc',
                  }}>
                  바로 도착해요!
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coverContainer: {
    backgroundColor: '#ffccee',
  },
  cover: {paddingTop: 12, paddingHorizontal: 40},
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
});
