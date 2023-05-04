import React from 'react';
import {BottomButton} from './BottomButton';

type Props = {
  disable: boolean;
  onPressUpdate: () => void;
};

export const UpdateButton = React.memo(({disable, onPressUpdate}: Props) => (
  <BottomButton
    disable={disable}
    buttonText="변경하기"
    onPress={onPressUpdate}
  />
));
