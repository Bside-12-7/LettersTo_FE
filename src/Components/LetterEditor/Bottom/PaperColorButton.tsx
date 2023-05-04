import React, {useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {PAPER_COLORS} from '@constants/letter';
import {PaperColor} from '@type/types';

const checkMark = require('@assets/check.png');

type Props = {
  color: PaperColor;
  paperColor: PaperColor;
  setPaperColor: React.Dispatch<React.SetStateAction<PaperColor>>;
};

export const PaperColorButton = React.memo(
  ({color, setPaperColor, paperColor}: Props) => {
    const isSelectedColor = useMemo(
      () => color === paperColor,
      [color, paperColor],
    );

    return (
      <TouchableOpacity
        onPress={() => {
          setPaperColor(color);
        }}
        activeOpacity={0.7}
        style={[
          styles.paperColorButton,
          {
            backgroundColor: PAPER_COLORS[color],
          },
        ]}>
        {isSelectedColor && (
          <Image style={styles.checkMarkImage} source={checkMark} />
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  paperColorButton: {
    marginRight: 12,
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkImage: {height: 16, width: 16},
});
