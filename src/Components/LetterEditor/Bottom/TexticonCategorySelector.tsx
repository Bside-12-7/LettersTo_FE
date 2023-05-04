import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {TEXTICONS} from '@constants/letter';
import type {TexticonCategory} from '@type/types';
import {TexticonCategoryButton} from './TexticonCategoryButton';

type Props = {
  setSelectedCategory: React.Dispatch<React.SetStateAction<TexticonCategory>>;
  selectedCategory: TexticonCategory;
};

export const TexticonCategorySelector = React.memo(
  ({selectedCategory, setSelectedCategory}: Props) => {
    return (
      <ScrollView
        horizontal
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
        style={styles.texticonCategorySelector}>
        {(Object.keys(TEXTICONS) as TexticonCategory[]).map(
          (category, index) => {
            return (
              <TexticonCategoryButton
                key={index}
                category={category}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            );
          },
        )}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  texticonCategorySelector: {height: 68, paddingTop: 16, marginHorizontal: 16},
});
