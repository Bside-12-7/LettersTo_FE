import React, {PropsWithChildren} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {deleteAccount} from '../../../APIs/member';
import Toast from '../../Toast/toast';
import {useMutation} from 'react-query';
import {useAuthAction} from '@stores/auth';
import {withButtonClickEventLogger} from '@components/Button/withButtonClickEventLogger';
import {CLICK_BUTTON_EVENT_PARAMS} from '@constants/analytics';

type Props = {
  hideModal: () => void;
  isModalVisible: boolean;
};

const OKButton = ({
  onPress,
  ...props
}: {onPress: () => void} & PropsWithChildren) => (
  <Pressable style={styles.buttonYes} onPress={onPress}>
    <Text style={styles.buttonTextYes}>{props.children}</Text>
  </Pressable>
);

const CancelButtonWithoutLogger = ({
  onPress,
  ...props
}: {onPress: () => void} & PropsWithChildren) => (
  <Pressable style={styles.buttonNo} onPress={onPress}>
    <Text style={styles.buttonTextNo}>{props.children}</Text>
  </Pressable>
);

const CancelButton = withButtonClickEventLogger(CancelButtonWithoutLogger);

export function AccountDeleteModal({hideModal, isModalVisible}: Props) {
  const {logout} = useAuthAction();

  const {mutate: signOut} = useMutation(
    ['signOut'],
    async () => await deleteAccount(),
    {
      onSuccess: async () => {
        hideModal();
        await AsyncStorage.clear();
        logout();
      },
      onError: (error: any) => {
        Toast.show(error.response.data.message);
      },
    },
  );

  return (
    <Modal
      statusBarTranslucent={true} // android
      transparent={true}
      onRequestClose={hideModal}
      visible={isModalVisible}>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.textWrap}>
            <Text style={styles.texticon}>(´•̥ ᵔ •̥`)</Text>
            <Text style={styles.confirmText}>【정말 탈퇴하시겠어요?】</Text>
            <Text style={styles.confirmDesc}>
              만족을 드리지 못해 죄송해요.{'\n'}다시 만나뵙도록 노력할게요!
            </Text>
          </View>
          <View style={styles.buttonWrap}>
            <OKButton onPress={() => signOut()}>탈퇴할께요</OKButton>
            <CancelButton
              clickButtonEvent={CLICK_BUTTON_EVENT_PARAMS.CANCEL_SIGN_OUT_POPUP}
              onPress={hideModal}>
              취소할께요
            </CancelButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {
    borderRadius: 10,
    backgroundColor: 'white',
    height: 300,
    width: '80%',
    padding: 24,
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texticon: {
    fontFamily: 'Galmuri11',
    fontSize: 18,
    color: '#0000cc',
  },
  confirmText: {
    fontFamily: 'Galmuri11',
    fontSize: 18,
    color: '#0000cc',
    marginBottom: 12,
  },
  confirmDesc: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
  },
  buttonWrap: {
    height: 42,
    flexDirection: 'row',
  },
  buttonYes: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0000cc',
    borderWidth: 1,
    marginRight: 12,
  },
  buttonTextYes: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000cc',
  },
  buttonNo: {
    flex: 1,
    backgroundColor: '#0000cc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0000cc',
    borderWidth: 1,
  },
  buttonTextNo: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: 'white',
  },
});
