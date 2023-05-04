import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {PAPER_COLORS} from '@constants/letter';
import {PaperColor} from '@type/types';
import {PaperColorButton} from './PaperColorButton';

type Props = {
  setPaperColor: React.Dispatch<React.SetStateAction<PaperColor>>;
  paperColor: PaperColor;
};

export const PaperColorSelector = React.memo(
  ({paperColor, setPaperColor}: Props) => {
    return (
      <View style={{height: 70}}>
        <ScrollView
          horizontal
          alwaysBounceHorizontal={false}
          showsHorizontalScrollIndicator={false}
          style={styles.paperColorSelector}>
          {(Object.keys(PAPER_COLORS) as PaperColor[]).map((color, index) => (
            <PaperColorButton
              key={index}
              color={color}
              paperColor={paperColor}
              setPaperColor={setPaperColor}
            />
          ))}
        </ScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  paperColorSelector: {
    paddingVertical: 16,
    marginHorizontal: 16,
  },
});
