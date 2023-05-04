import * as React from 'react';
import {BottomButton} from './BottomButton';

interface Props {
  disable: boolean;
  onPress: () => void;
}

export const NextButton = React.memo(({disable, onPress}: Props) => {
  return <BottomButton buttonText="다음" disable={disable} onPress={onPress} />;
});
