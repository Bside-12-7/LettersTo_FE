import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {TexticonSelector} from '@components/LetterEditor/Bottom/TexticonSelector';
import type {TexticonCategory} from '@type/types';

interface Props {
  onSelectTexticon: (texticon: string) => void;
  onClose: () => void;
}

export const ChatTexticonSelector = React.memo(
  ({onSelectTexticon, onClose}: Props) => {
    const [selectedCategory, setSelectedCategory] =
      useState<TexticonCategory>('happy');

    return (
      <View style={styles.container}>
        {/* 배경 터치 시 닫기 */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* 텍스티콘 선택기 */}
        <View style={styles.selectorContainer}>
          <TexticonSelector
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectTexticon={onSelectTexticon}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  selectorContainer: {
    backgroundColor: 'white',
  },
});
