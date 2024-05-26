import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ModalHeader} from '@components/Headers/ModalHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useInterval} from '@hooks/useInterval';
import {useMutation, useQuery} from 'react-query';
import {generateInvitationCode, getInvitationCode} from '@apis/invitation';
import {Share} from 'react-native';
import {InvitationCodeInputModal} from './InvitationCodeInputModal';

type Props = {
  receivedCode?: string;
  deleteReceivedCode?: () => void;
  isModalVisible: boolean;
  onPressClose: () => void;
};

export const InvitationModal = ({
  receivedCode,
  deleteReceivedCode,
  isModalVisible,
  onPressClose,
}: Props) => {
  const {top: SAFE_AREA_TOP, bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();
  const [remainingTime, setRemainingTime] = useState(1000 * 60 * 30);
  const [isCodeModalVisible, setCodeModalVisible] = useState(!!receivedCode);

  const {mutate} = useMutation(generateInvitationCode);
  const {data: codeData, refetch} = useQuery('INVITATION_CODE', () =>
    getInvitationCode(),
  );

  const resetCode = () => {
    mutate(undefined, {
      onSuccess() {
        refetch();
      },
    });
  };

  const hideModal = () => {
    deleteReceivedCode && deleteReceivedCode();
    onPressClose();
  };

  const handlePressClose = () => {
    deleteReceivedCode && deleteReceivedCode();
    setCodeModalVisible(false);
  };

  useInterval(() => {
    setRemainingTime(prev => prev - 1000);
  }, 1000);

  useEffect(() => {
    if (codeData) {
      const expirationDate = new Date(codeData.expirationDate).getTime();
      setRemainingTime(expirationDate - new Date().getTime());
    }
  }, [codeData]);

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
              marginTop: SAFE_AREA_TOP,
              paddingBottom: SAFE_AREA_BOTTOM,
            },
          ]}>
          <ModalHeader title={'위치 정보 관리'} onPressClose={hideModal} />
          <View style={styles.topWrapper}>
            <Text style={styles.invitationCodeText}>
              {codeData?.invitationCode}
            </Text>
            <Text style={styles.remainingTimeText}>
              {remainingTime > 0
                ? `${Math.floor(remainingTime / (60 * 1000))}분 ${Math.floor(
                    (remainingTime % (60 * 1000)) / 1000,
                  )}초 후 만료됩니다!`
                : '만료된 코드입니다, 재생성 해주세요!'}
            </Text>
            <TouchableOpacity
              onPress={resetCode}
              activeOpacity={0.7}
              style={styles.resetButton}>
              <Text style={styles.resetButtonText}>재생성</Text>
              <Image
                source={require('@assets/refresh_blue.png')}
                style={styles.resetButtonImage}
              />
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal: 16}}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[styles.invitationButton, {marginBottom: 16}]}
              onPress={() => {
                Share.share({
                  title: '[Letters to] 우리 편지 주고받아요!',
                  message: `링크를 누르거나 앱에서 친구코드[${codeData?.invitationCode}]를 입력해주세요.
                    \nhttps://lettersto.onelink.me/DSlL/ilxarcdy?code=${codeData?.invitationCode}`,
                });
              }}>
              <Text style={styles.invitationButtonText}>
                친구에게 내 코드 보내기
              </Text>
              <Image
                source={require('@assets/Icon/next/next_blue.png')}
                style={styles.invitationButtonImage}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.invitationButton}
              onPress={() => setCodeModalVisible(true)}>
              <Text style={styles.invitationButtonText}>
                친구의 코드 직접 입력하기
              </Text>
              <Image
                source={require('@assets/Icon/next/next_blue.png')}
                style={styles.invitationButtonImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isCodeModalVisible && (
        <InvitationCodeInputModal
          receivedCode={receivedCode}
          isModalVisible={isCodeModalVisible}
          onPressClose={handlePressClose}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    flex: 1,
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
  topWrapper: {
    padding: 40,
    alignItems: 'center',
  },
  invitationCodeText: {
    fontFamily: 'Galmuri11',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 42.67,
    marginBottom: 4,
    color: '#0000CC',
  },
  remainingTimeText: {
    fontFamily: 'Galmuri11',
    fontSize: 11,
    fontWeight: '400',
    marginBottom: 12,
    color: '#FF5500',
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffcc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderColor: '#0000CC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  resetButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 13,
    color: '#0000CC',
  },
  resetButtonImage: {width: 20, height: 20, marginLeft: 2},
  invitationButton: {
    padding: 16,
    borderColor: '#0000CC',
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invitationButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000CC',
  },
  invitationButtonImage: {
    width: 20,
    height: 20,
  },
});
