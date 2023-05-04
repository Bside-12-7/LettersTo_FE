import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SCREEN_HEIGHT} from '@constants/screen';
import {PaperColor, PaperStyle} from '@type/types';
import {PaperColorSelector} from './PaperColorSelector';
import {PaperStyleSelector} from './PaperStyleSelector';

type Props = {
  setPaperColor: React.Dispatch<React.SetStateAction<PaperColor>>;
  paperColor: PaperColor;
  setPaperStyle: React.Dispatch<React.SetStateAction<PaperStyle>>;
  paperStyle: PaperStyle;
};

export const PaperSelector = React.memo(
  ({setPaperColor, paperColor, setPaperStyle, paperStyle}: Props) => {
    return (
      <View style={styles.paperSelector}>
        <PaperColorSelector
          paperColor={paperColor}
          setPaperColor={setPaperColor}
        />
        <PaperStyleSelector
          paperStyle={paperStyle}
          setPaperStyle={setPaperStyle}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  paperSelector: {
    height: SCREEN_HEIGHT * 0.4,
  },
});
