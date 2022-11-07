import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {PAPER_STYLES} from '../../../Constants/letter';
import {PaperStyleButton} from './PaperStyleButton';

type Props = {
  setPaperStyle: React.Dispatch<
    React.SetStateAction<typeof PAPER_STYLES[number]>
  >;
  paperStyle: typeof PAPER_STYLES[number];
};

export const PaperStyleSelector = React.memo(
  ({paperStyle, setPaperStyle}: Props) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.paperStyleSelector}>
        {PAPER_STYLES.map((style, index) => {
          return (
            <PaperStyleButton
              key={index}
              style={style}
              paperStyle={paperStyle}
              setPaperStyle={setPaperStyle}
            />
          );
        })}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  paperStyleSelector: {marginHorizontal: 16},
});