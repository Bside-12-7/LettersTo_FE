import React, {useState, useEffect} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header2} from '@components/Headers/Header2';
import {getStampHistories} from '@apis/stamp';
import {StampHistories} from '@type/types';
import {dateFormatter} from '@utils/dateFormatter';
import Toast from '@components/Toast/toast';
import {useQuery} from 'react-query';
import {getUserInfo} from '@apis/member';

const nextImg = require('@assets/Icon/next/next_blue.png');

type Props = NativeStackScreenProps<StackParamsList, 'StampHistory'>;

export const StampHistory = ({navigation}: Props) => {
  const {top: SAFE_AREA_TOP, bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();
  // const {userInfo} = useStore();

  const onPressBack = () => {
    navigation.pop();
  };

  const [stampHistories, setStampHistories] = useState<StampHistories>();
  useEffect(() => {
    // 우표 지급 내역 조회
    try {
      getStampHistories().then(data => {
        setStampHistories(data);
      });
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다');
    }
  }, []);

  const {data: userInfo} = useQuery('userInfo', getUserInfo);

  return (
    <View style={[styles.container, {paddingTop: SAFE_AREA_TOP}]}>
      <StatusBar barStyle={'light-content'} />
      <Header2 title="우표 지급 내역" color="white" onPressBack={onPressBack} />

      <View style={styles.totalArea}>
        <Image
          source={require('@assets/numberStamps_white.png')}
          style={{width: 24, height: 24}}
        />
        <Text style={[styles.totalText, {marginLeft: 2}]}>나의 보유 우표</Text>
        <Text style={[styles.totalText, {marginLeft: 'auto'}]}>
          {userInfo?.stampQuantity.toLocaleString()}개
        </Text>
        <View style={[styles.tooltipArea, {display: 'none'}]}>
          <Text style={styles.tooltipText}>
            매일 앱에 접속하고 우표 받아가세요!
          </Text>
          <Image
            style={styles.tooltipTail}
            source={require('@assets/tooltip.png')}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={{paddingBottom: SAFE_AREA_BOTTOM}}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.item,
              {backgroundColor: '#F2F2FC', display: 'none'},
            ]}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.event}>EVENT</Text>
              <Text style={styles.eventText}>
                앱 리뷰 남기고 추가 우표 받기
              </Text>
              <Image style={{width: 20, height: 20}} source={nextImg} />
            </View>
          </TouchableOpacity>
          {stampHistories?.map((item: any, idx: number) => {
            return (
              <View key={idx} style={styles.item}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.quantity}>+{item.quantity}개</Text>
                </View>
                <Text style={styles.createdDate}>
                  {dateFormatter('yyyy.mm.dd', item.createdDate)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000CC',
  },
  contentContainer: {flex: 1, backgroundColor: 'white', marginTop: 5},
  totalArea: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  totalText: {fontFamily: 'Galmuri11', fontSize: 15, color: 'white'},
  tooltipArea: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 24,
    height: 32,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFCC',
    borderWidth: 1,
    borderColor: '#0000CC',
    borderRadius: 5,
  },
  tooltipText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
    lineHeight: 28,
  },
  tooltipTail: {
    position: 'absolute',
    top: -3.5,
    left: 22,
    transform: [{scaleY: -1}],
    width: 5,
    height: 4,
  },
  item: {
    minHeight: 100,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 204, 0.2)',
  },
  event: {
    marginRight: 8,
    paddingRight: 8,
    paddingLeft: 10,
    fontFamily: 'Galmuri11-Bold',
    fontSize: 11,
    lineHeight: 24,
    color: 'white',
    backgroundColor: '#FF47C1',
    borderRadius: 10,
  },
  eventText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000CC',
    marginRight: 'auto',
  },
  description: {fontFamily: 'Galmuri11', fontSize: 14, color: '#0000CC'},
  quantity: {fontFamily: 'Galmuri11', fontSize: 14, color: '#44CCFF'},
  createdDate: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
    opacity: 0.5,
  },
});
