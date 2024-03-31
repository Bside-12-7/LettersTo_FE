import * as React from 'react';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import {withButtonClickEventLogger} from '@components/Button/withButtonClickEventLogger';

interface Props {
  disable: boolean;
  onPress: () => void;
}

const SignUpButtonWithoutLogger = React.memo(({disable, onPress}: Props) => {
  return (
    <BottomButton buttonText="가입 완료!" disable={disable} onPress={onPress} />
  );
});

export const SignUpButton = withButtonClickEventLogger(SignUpButtonWithoutLogger);
