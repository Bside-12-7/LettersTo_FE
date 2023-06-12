import React from 'react';
import type {
  GestureResponderEvent,
  TouchableWithoutFeedbackProps,
  TouchableOpacityProps,
  PressableProps,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {EVENT_TYPES} from '@constants/analytics';

export const withButtonClickEventLogger = <P extends object>(
  InnerComponent: React.ComponentType<P>,
) => {
  return ({
    clickButtonEvent,
    ...props
  }: ButtonProps & RNTouchableComponentsProps & P) => {
    const onPress = (event: GestureResponderEvent) => {
      analytics().logEvent(EVENT_TYPES.CLICK_BUTTON, clickButtonEvent);
      props.onPress?.(event);
    };
    return <InnerComponent {...(props as P)} onPress={onPress} />;
  };
};

type RNTouchableComponentsProps = TouchableWithoutFeedbackProps &
  TouchableOpacityProps &
  PressableProps;

interface ButtonProps {
  clickButtonEvent: {
    button_class: string;
    button_name: string;
  };
}
