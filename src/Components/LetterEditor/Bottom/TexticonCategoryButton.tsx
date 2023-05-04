import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {TEXTICONS} from '@constants/letter';
import type {TexticonCategory} from '@type/types';

type Props = {
  category: TexticonCategory;
  setSelectedCategory: React.Dispatch<React.SetStateAction<TexticonCategory>>;
  selectedCategory: TexticonCategory;
};

export const TexticonCategoryButton = React.memo(
  ({category, selectedCategory, setSelectedCategory}: Props) => {
    const isSelectedCategory = useMemo(
      () => category === selectedCategory,
      [category, selectedCategory],
    );

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setSelectedCategory(category);
        }}
        style={[
          styles.texticonCategoryButton,
          {
            backgroundColor: isSelectedCategory ? '#FF6ECE' : 'white',
          },
        ]}>
        <Text
          style={[
            styles.texticonCategory,
            {
              color: category === selectedCategory ? 'white' : '#0000cc',
            },
          ]}>
          {TEXTICONS[category].key}
        </Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  texticonCategoryButton: {
    marginRight: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texticonCategory: {
    fontFamily: 'Galmuri11',
    fontSize: 13,
  },
});
