import * as React from 'react';
import {BottomButton} from '@components/Button/Bottom/BottomButton';

interface Props {
  disable: boolean;
  onPress: () => void;
}

export const SignUpButton = React.memo(({disable, onPress}: Props) => {
  return (
    <BottomButton buttonText="가입 완료!" disable={disable} onPress={onPress} />
  );
});
