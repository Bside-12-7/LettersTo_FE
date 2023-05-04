import React from 'react';
import {Pressable, Text, View, Modal, StyleSheet, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  hideModal: () => void;
  title?: string;
  text: string;
  children: JSX.Element;
};

export const AlertModal = ({
  visible,
  hideModal,
  title = '',
  text,
  children,
}: Props) => {
  const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  return (
    <Modal
      statusBarTranslucent={true} // android
      animationType="slide"
      transparent={true}
      onRequestClose={hideModal}
      visible={visible}>
      <View style={styles.container}>
        <View style={[styles.modalView, {paddingBottom: SAFE_AREA_BOTTOM}]}>
          <View style={styles.header}>
            <Pressable onPress={hideModal}>
              <Image
                source={require('@assets/Icon/close/close_blue.png')}
                style={styles.closeButton}
              />
            </Pressable>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.headerBlank} />
          </View>
          <View
            style={{
              paddingVertical: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontFamily: 'Galmuri11', color: '#0000cc'}}>
              {text}
            </Text>
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
};
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
  headerBlank: {width: 28},
  nickname: {
    marginBottom: 10,
    marginHorizontal: 24,
  },
  nicknameInput: {
    padding: 17,
    height: 54,
    borderWidth: 1,
    borderColor: '#0000cc',
    borderRadius: 10,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
  },
  alert: {
    marginTop: 10,
  },
  alertSuccess: {
    fontFamily: 'Galmuri11',
    color: '#44ccff',
  },
  alertFail: {
    fontFamily: 'Galmuri11',
    color: '#ff44cc',
  },
  changeButton: {
    marginHorizontal: 16,
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButtonText: {fontFamily: 'Galmuri11', color: 'white'},
});
