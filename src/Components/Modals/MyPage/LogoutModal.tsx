import React from 'react';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import {AlertModal} from '../AlertModal';

type Props = {
  isVisible: boolean;
  onPressClose: () => void;
  onPressLogout: () => void;
};

export const LogoutModal = ({
  isVisible,
  onPressClose,
  onPressLogout,
}: Props) => {
  return (
    <AlertModal
      visible={isVisible}
      hideModal={onPressClose}
      text={'로그아웃하시겠어요?'}>
      <BottomButton
        buttonText={'네, 로그아웃할께요.'}
        onPress={onPressLogout}
      />
    </AlertModal>
  );
};
