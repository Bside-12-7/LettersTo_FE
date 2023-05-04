import React from 'react';
import {Image, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import useStore, {useLetterEditorStore} from '@stores/store';
import {GRADIENT_COLORS} from '@constants/letter';
import {SCREEN_WIDTH} from '@constants/screen';

export const DeliveryLetterCoverBackPreview = React.memo(() => {
  const {deliveryLetter, deliveryLetterTo, standardDeliveryDate} =
    useLetterEditorStore();
  const {cover} = useStore();

  return (
    <LinearGradient
      colors={[GRADIENT_COLORS[deliveryLetter?.paperColor ?? 'PINK'], 'white']}
      style={{
        width: SCREEN_WIDTH - 80,
        height: undefined,
        aspectRatio: 295 / 212,
        borderColor: '#0000cc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 16,
      }}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {deliveryLetter.deliveryType === 'STANDARD' ? (
          <>
            <Image
              source={require('@assets/StandardBox.png')}
              style={{width: 63, height: 21, margin: 10}}
            />
            <View
              style={{
                paddingVertical: 20,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#0000cc13',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Galmuri11-Bold',
                    fontSize: 13,
                    color: '#0000cc',
                  }}>
                  {cover.address.city}
                </Text>
                <Image
                  source={require('@assets/arrow.png')}
                  style={{
                    width: 31,
                    resizeMode: 'contain',
                    marginHorizontal: 24,
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'Galmuri11-Bold',
                    fontSize: 13,
                    color: '#0000cc',
                  }}>
                  {deliveryLetterTo?.toAddress.split(' ')[1]}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Galmuri11',
                  fontSize: 13,
                  color: '#0000cc',
                  marginTop: 10,
                }}>
                {standardDeliveryDate}후 도착
              </Text>
            </View>
          </>
        ) : (
          <>
            <Image
              source={require('@assets/ExpressBox.png')}
              style={{width: 63, height: 21, margin: 10}}
            />

            <LinearGradient
              colors={[
                '#FF47C119',
                '#FFFF0019',
                '#89F50019',
                '#44EFFF19',
                '#FF47C119',
              ]}
              style={{
                paddingVertical: 20,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Galmuri11-Bold',
                    fontSize: 13,
                    color: '#0000cc',
                  }}>
                  {cover.address.city}
                </Text>
                <Image
                  source={require('@assets/arrow.png')}
                  style={{
                    width: 31,
                    resizeMode: 'contain',
                    marginHorizontal: 24,
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'Galmuri11-Bold',
                    fontSize: 13,
                    color: '#0000cc',
                  }}>
                  {deliveryLetterTo?.toAddress.split(' ')[1]}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Galmuri11',
                  fontSize: 13,
                  color: '#0000cc',
                  marginTop: 10,
                }}>
                바로 도착해요!
              </Text>
            </LinearGradient>
          </>
        )}
      </View>
    </LinearGradient>
  );
});
