import React, {useMemo} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import useStore, {useLetterEditorStore} from '@stores/store';
import {GRADIENT_COLORS} from '@constants/letter';
import {SCREEN_WIDTH} from '@constants/screen';
import {getStamps} from '@apis/stamp';
import {useQuery} from 'react-query';
import {getImageUrl} from '@utils/image';

const SelectedStampImage = ({stampId}: {stampId: number | undefined}) => {
  const {data: stampData} = useQuery(['STAMPS'], getStamps);
  const stampUri = useMemo(
    () => stampData?.find(stamp => stamp.id === stampId)?.fileId,
    [stampData, stampId],
  );
  return (
    <>
      {stampId && stampUri ? (
        <Image
          style={{
            width: '85%',
            height: undefined,
            aspectRatio: 94 / 116,
            backgroundColor: '#0000cc13',
          }}
          source={{
            uri: getImageUrl(stampUri),
          }}
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
            source={require('@assets/photo_blue.png')}
          />
        </View>
      )}
    </>
  );
};

export const DeliveryLetterCoverPreview = React.memo(() => {
  const {cover} = useStore();
  const {deliveryLetter, deliveryLetterTo} = useLetterEditorStore();

  const titleText = useMemo(
    () => deliveryLetter?.title || '무제',
    [deliveryLetter?.title],
  );

  return (
    <LinearGradient
      colors={[GRADIENT_COLORS[deliveryLetter?.paperColor ?? 'PINK'], 'white']}
      style={[
        {
          width: SCREEN_WIDTH - 80,
        },
        styles.container,
      ]}>
      <View style={styles.topArea}>
        <View style={styles.title}>
          <Text style={styles.titleText}>⌜{titleText}⌟︎︎</Text>
          <Image source={require('@assets/to.png')} style={styles.To} />
          <Text style={styles.fromText}>{deliveryLetterTo?.toNickname}</Text>
          <Text style={styles.fromText}>{deliveryLetterTo?.toAddress}</Text>
          <Image source={require('@assets/From..png')} style={styles.From} />
          <Text style={styles.fromText}>{cover.nickname},</Text>
          <Text style={styles.fromText}>
            {[cover.address.region, ' ', cover.address.city].join('')}
          </Text>
        </View>
        <View style={{flex: 74}}>
          <ImageBackground
            source={require('@assets/stamp.png')}
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
  title: {flex: 173, marginRight: 16},
  titleText: {
    width: '100%',
    height: 50,
    fontSize: 13,
    fontFamily: 'Galmuri11',
    color: '#0000CC',
    lineHeight: 22.1,
  },
  To: {height: 22, width: 25, resizeMode: 'contain'},
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
