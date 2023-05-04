import React from 'react';
import {View} from 'react-native';
import {SCREEN_HEIGHT} from '@constants/screen';
import type {TexticonCategory} from '@type/types';
import {TexticonCategorySelector} from './TexticonCategorySelector';
import {TexticonItemSelector} from './TexticonItemSelector';

type Props = {
  setSelectedCategory: React.Dispatch<React.SetStateAction<TexticonCategory>>;
  selectedCategory: TexticonCategory;
  onSelectTexticon: (t: string) => void;
};

export const TexticonSelector = React.memo(
  ({setSelectedCategory, selectedCategory, onSelectTexticon}: Props) => {
    return (
      <View
        style={{
          height: SCREEN_HEIGHT * 0.4,
        }}>
        <TexticonCategorySelector
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <TexticonItemSelector
          selectedCategory={selectedCategory}
          onSelectTexticon={onSelectTexticon}
        />
      </View>
    );
  },
);
