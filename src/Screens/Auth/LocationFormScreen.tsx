import React, {useCallback, useEffect, useMemo, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, Text, StyleSheet, SafeAreaView, Platform} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {LinearGradient} from 'expo-linear-gradient';
import {SCREEN_HEIGHT} from '@constants/screen';
import {useLocation} from '@hooks/UserInfo/useLocation';
import {NextButton} from '@components/Button/Bottom/NextButton';
import {useAuthAction} from '@stores/auth';
import {Header2} from '@components/Headers/Header2';
import {NoticeBalloon} from '@components/UserInfo/Notice/NoticeBalloon';
import {NoticeButton} from '@components/UserInfo/Notice/NoticeButton';
import type {StackParamsList} from '@type/stackParamList';

type Props = NativeStackScreenProps<StackParamsList, 'LocationForm'>;

export function LocationForm({navigation}: Props) {
  const [openRegion, setOpenRegion] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const {
    regions,
    selectedRegionId,
    setSelectedRegionId,
    cities,
    selectedCityId,
    setSelectedCityId,
    noticeOpacity,
    onStartNotice,
  } = useLocation();

  const {setGeolocationIdInRegisterInfo} = useAuthAction();

  const disableNext = useMemo(
    () => !selectedCityId || !selectedRegionId,
    [selectedCityId, selectedRegionId],
  );

  useEffect(() => {
    if (selectedRegionId && selectedCityId) {
      setGeolocationIdInRegisterInfo(selectedCityId);
    }
  }, [selectedRegionId, selectedCityId, setGeolocationIdInRegisterInfo]);

  const onPressNext = useCallback(() => {
    navigation.navigate('Policy');
  }, [navigation]);

  const onPressBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <LinearGradient colors={['#ffccee', 'white', 'white', 'white', '#ffffcc']}>
      <SafeAreaView
        style={
          Platform.OS === 'android'
            ? styles.container_android
            : styles.container_ios
        }>
        <Header2 onPressBack={onPressBack} />

        <View style={styles.titleBox}>
          <View style={styles.titleWrap}>
            <Text style={styles.titleText}>편지를 받을 지역을</Text>
            <View style={styles.counterWrap}>
              <Text style={styles.titleText}>선택해주세요</Text>
              <NoticeButton onPress={onStartNotice} />
            </View>
          </View>
          <NoticeBalloon noticeOpacity={noticeOpacity} />
        </View>

        <View style={styles.locationWrap}>
          <View style={styles.regionBox}>
            <DropDownPicker
              open={openRegion}
              value={selectedRegionId}
              items={regions}
              setOpen={setOpenRegion}
              setValue={setSelectedRegionId}
              autoScroll={true}
              placeholder={'시 · 도 선택'}
              zIndex={2}
              style={styles.picker}
              textStyle={styles.pickerText}
            />
          </View>
          {((Platform.OS === 'ios' && !openRegion) ||
            Platform.OS === 'android') && (
            <View>
              <DropDownPicker
                disabled={!selectedRegionId}
                open={openCity}
                value={selectedCityId}
                items={cities}
                setOpen={setOpenCity}
                setValue={setSelectedCityId}
                autoScroll={true}
                placeholder={'군 · 구 선택'}
                zIndex={1}
                style={styles.picker}
                textStyle={styles.pickerText}
              />
            </View>
          )}
        </View>
        <NextButton disable={disableNext} onPress={onPressNext} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container_ios: {height: SCREEN_HEIGHT},
  container_android: {height: SCREEN_HEIGHT, paddingVertical: 15},
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    position: 'relative',
  },
  titleWrap: {
    height: 100,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginTop: 8,
  },
  counterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationWrap: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 15,
  },
  regionBox: {
    marginBottom: 12,
  },
  picker: {
    borderRadius: 10,
    borderColor: '#0000cc',
  },
  pickerText: {
    fontFamily: 'Galmuri11',
    color: '#0000cc',
  },
});
