import React from 'react';
import {
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  TouchableOpacity as RNTouchableOpacity,
} from 'react-native';
import type {
  GestureResponderEvent,
  TouchableWithoutFeedbackProps,
  TouchableOpacityProps,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {EVENT_TYPES} from '@constants/analytics';

export const withLogginButtonClickEvent = <
  P extends RNTouchableComponentsProps,
>(
  InnerComponent: React.ComponentType<P>,
) => {
  return ({clickButtonEvent, ...props}: LoggingButtonClickEventProps) => {
    const onPress = (event: GestureResponderEvent) => {
      analytics().logEvent(EVENT_TYPES.CLICK_BUTTON, clickButtonEvent);
      props.onPress?.(event);
    };
    return <InnerComponent {...(props as P)} onPress={onPress} />;
  };
};

export const TouchableWithoutFeedback = withLogginButtonClickEvent(
  RNTouchableWithoutFeedback,
);

export const TouchableOpacity = withLogginButtonClickEvent(RNTouchableOpacity);

type RNTouchableComponentsProps = TouchableWithoutFeedbackProps &
  TouchableOpacityProps;

interface LoggingButtonClickEventProps extends RNTouchableComponentsProps {
  clickButtonEvent: {
    button_class: string;
    button_name: string;
  };
}
