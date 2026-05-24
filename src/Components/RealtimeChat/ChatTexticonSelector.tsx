import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TexticonSelector} from '@components/LetterEditor/Bottom/TexticonSelector';
import type {TexticonCategory} from '@type/types';

interface Props {
  onSelectTexticon: (texticon: string) => void;
}

export const ChatTexticonSelector = React.memo(({onSelectTexticon}: Props) => {
  const [selectedCategory, setSelectedCategory] =
    useState<TexticonCategory>('happy');

  return (
    <View style={styles.container}>
      <TexticonSelector
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSelectTexticon={onSelectTexticon}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0000CC',
  },
});
