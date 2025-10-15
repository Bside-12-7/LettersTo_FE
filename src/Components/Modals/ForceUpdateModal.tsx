import React from 'react';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import {AlertModal} from './AlertModal';

type Props = {
  isVisible: boolean;
  onPressUpdate: () => void;
};

export const ForceUpdateModal = ({isVisible, onPressUpdate}: Props) => {
  return (
    <AlertModal
      visible={isVisible}
      text={'최신 버전으로 업데이트 하고\n새로운 기능을 이용해보세요 :)'}>
      <BottomButton
        buttonText={'최신 버전 업데이트 하기'}
        onPress={onPressUpdate}
      />
    </AlertModal>
  );
};
