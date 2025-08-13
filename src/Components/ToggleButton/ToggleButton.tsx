import {Image, Pressable} from 'react-native';

const toggleButtonImage = {
  inner: require('@assets/ToggleButton/toggle_button_inner.png'),
  outer: require('@assets/ToggleButton/toggle_button_outer.png'),
};

export function ToggleButton({
  value,
  onPress,
}: {
  value: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={{position: 'relative'}} onPress={onPress}>
      <Image
        source={toggleButtonImage.outer}
        style={{width: 30, height: 20}}
        resizeMode="contain"
      />
      <Image
        source={toggleButtonImage.inner}
        style={{
          position: 'absolute',
          top: 4,
          [value ? 'right' : 'left']: 4,
          width: 12,
          height: 12,
        }}
        resizeMode="contain"
      />
    </Pressable>
  );
}
