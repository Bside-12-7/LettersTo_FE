import {TextStyle} from 'react-native';
import Toast from 'react-native-root-toast';

interface Preset {
  duration: number;
  position: number;
  shadow: boolean;
  animation: boolean;
  hideOnPress: boolean;
  delay: number;
  textStyle: TextStyle;
}

class StyledToast {
  preset: Preset;

  constructor(props: Preset) {
    this.preset = {...props};
  }

  show: (text: string) => void = text => Toast.show(text, {...this.preset});
}

export default new StyledToast({
  duration: 2000,
  position: -100,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 0,
  textStyle: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    lineHeight: 24,
  },
});
