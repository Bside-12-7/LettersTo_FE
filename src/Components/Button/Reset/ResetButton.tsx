import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const resetButtonImage = require('@assets/Icon/reset/reset.png');

type Params = {
  reset: () => void;
};

export const ResetButton = React.memo(({reset}: Params) => {
  return (
    <TouchableWithoutFeedback onPress={reset}>
      <View style={styles.resetButton}>
        <Text style={styles.resetButtonText}>초기화</Text>
        <Image style={styles.resetButtonImage} source={resetButtonImage} />
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  resetButton: {
    width: 74,
    height: 22,
    flexDirection: 'row',
    backgroundColor: '#ffffcc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    borderRadius: 11,
    borderColor: '#0000cc',
    borderWidth: 1,
  },
  resetButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
  },
  resetButtonImage: {width: 20, height: 20},
});
