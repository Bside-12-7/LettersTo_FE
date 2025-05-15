import React, {useEffect, useMemo, useState} from 'react';
import {Text, View, Modal, StyleSheet, Platform} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useQueryClient} from 'react-query';
import {patchUserInfo} from '@apis/member';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import {ModalHeader} from '@components/Headers/ModalHeader';
import Toast from '@components/Toast/toast';
import {SCREEN_HEIGHT} from '@constants/screen';
import {useLocation} from '@hooks/UserInfo/useLocation';

type Props = {
  currentLocation: {
    parentGeolocationId: number;
    geolocationId: number;
  };
  isModalVisible: boolean;
  onPressClose: () => void;
};

export function LocationModal({
  currentLocation,
  isModalVisible,
  onPressClose,
}: Props) {
  const {
    regions,
    selectedRegionId,
    setSelectedRegionId,
    cities,
    selectedCityId,
    setSelectedCityId,
    reset,
  } = useLocation(currentLocation);

  const [openRegion, setOpenRegion] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const disableUpdate = useMemo(
    () =>
      !selectedCityId ||
      !selectedRegionId ||
      (selectedRegionId === currentLocation.parentGeolocationId &&
        selectedCityId === currentLocation.geolocationId),
    [
      currentLocation.geolocationId,
      currentLocation.parentGeolocationId,
      selectedCityId,
      selectedRegionId,
    ],
  );

  const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  const hideModal = () => {
    onPressClose();
  };

  const queryClient = useQueryClient();

  const {mutate: updateLocation} = useMutation(
    ['topics', selectedCityId],
    async () => await patchUserInfo({geolocationId: selectedCityId}),
    {
      onSuccess: () => {
        Toast.show('성공적으로 변경되었어요!');
        queryClient.invalidateQueries('userInfo');
        hideModal();
      },
      onError: (error: any) => {
        hideModal();
        Toast.show(error.response.data.message);
      },
    },
  );

  useEffect(() => {
    if (isModalVisible) {
      reset();
    }
  }, [isModalVisible, reset]);

  return (
    <Modal
      statusBarTranslucent={true} // android
      animationType="slide"
      transparent={true}
      onRequestClose={hideModal}
      visible={isModalVisible}>
      <View style={styles.container}>
        <View
          style={[
            styles.modalView,
            {
              paddingBottom: SAFE_AREA_BOTTOM,
            },
          ]}>
          <ModalHeader title={'위치 정보 관리'} onPressClose={hideModal} />

          <View style={styles.titleBox}>
            <View style={styles.titleWrap}>
              <Text style={styles.titleText}>편지를 받을 지역을</Text>
              <View style={styles.counterWrap}>
                <Text style={styles.titleText}>선택해주세요</Text>
              </View>
            </View>
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
                placeholder="시 · 도 선택"
                zIndex={2}
                style={styles.picker}
                textStyle={styles.pickerText}
              />
            </View>
            {/*
              ios와 android의 zindex가 다름
              android에서는 하위 드롭다운을 없어지게 처리
            */}
            {((Platform.OS === 'ios' && !openRegion) ||
              Platform.OS === 'android') && (
              <View>
                <DropDownPicker
                  open={openCity}
                  value={selectedCityId}
                  items={cities}
                  setOpen={setOpenCity}
                  setValue={setSelectedCityId}
                  autoScroll={true}
                  placeholder="군 · 구 선택"
                  zIndex={1}
                  style={styles.picker}
                  textStyle={styles.pickerText}
                />
              </View>
            )}
          </View>

          <BottomButton
            disable={disableUpdate}
            buttonText="변경하기"
            onPress={updateLocation}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {height: 28, width: 28},
  title: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    color: '#0000cc',
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  titleWrap: {
    marginBottom: 30,
    justifyContent: 'flex-end',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginTop: 8,
  },
  counterWrap: {flexDirection: 'row', alignItems: 'center'},
  noticeButtonImage: {marginLeft: 3, height: 20, width: 20},
  notice: {
    position: 'absolute',
    top: 100,
    left: 27,
    width: 288,
    height: 35,
  },
  noticeBGImage: {
    width: 288,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
  },
  locationWrap: {
    height: SCREEN_HEIGHT * 0.6,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  regionBox: {
    marginBottom: 12,
  },
  cityBox: {},
  picker: {
    borderRadius: 10,
    borderColor: '#0000cc',
  },
  pickerText: {
    fontFamily: 'Galmuri11',
    color: '#0000cc',
  },
});
