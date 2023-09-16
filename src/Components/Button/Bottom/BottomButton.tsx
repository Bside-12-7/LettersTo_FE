import {LinearGradient} from 'expo-linear-gradient';
import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  disable?: boolean;
  buttonText: string;
  onPress: () => any | Promise<any>;
  white?: true;
};

export const BottomButton = React.memo(
  ({buttonText, onPress, disable, white}: Props) => {
    const [pressed, setPressed] = useState(false);

    const onPressButton = useCallback(async () => {
      setPressed(true);
      await onPress();
      setPressed(false);
    }, [onPress]);

    const GradientButton = () => (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disable || pressed}
        onPress={onPressButton}>
        {disable === true ? (
          <View style={[styles.button]}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </View>
        ) : (
          <LinearGradient
            colors={['#FF6ECE', '#FF3DBD']}
            style={[styles.button]}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    );

    const WhiteButton = () => (
      <TouchableOpacity activeOpacity={0.7} onPress={onPressButton}>
        <View style={[styles.whiteButton]}>
          <Text style={styles.whiteButtonText}>{buttonText}</Text>
        </View>
      </TouchableOpacity>
    );

    // return white ? <WhiteButton /> : <GradientButton />;
    return (
      <View style={{paddingBottom: 10}}>
        {white ? <WhiteButton /> : <GradientButton />}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16,
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC7F0',
  },
  buttonText: {fontFamily: 'Galmuri11', color: 'white'},
  whiteButton: {
    marginHorizontal: 16,
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#0000cc',
    borderWidth: 1,
  },
  whiteButtonText: {fontFamily: 'Galmuri11', color: '#0000cc'},
});
