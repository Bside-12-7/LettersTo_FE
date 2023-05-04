import React, {useMemo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PaperStyle} from '@type/types';

const paperGrid = require('@assets/Image/paper/paper_grid.png');
const paperDotted = require('@assets/Image/paper/paper_dotted.png');
const paperPlain = require('@assets/Image/paper/paper_plane.png');

const checkMark = require('@assets/check.png');

type Props = {
  style: PaperStyle;
  setPaperStyle: React.Dispatch<React.SetStateAction<PaperStyle>>;
  paperStyle: PaperStyle;
};

export const PaperStyleButton = React.memo(
  ({style, paperStyle, setPaperStyle}: Props) => {
    let source: any;
    let name: string = '';

    switch (style) {
      case 'GRID':
        source = paperGrid;
        name = '모눈노트';
        break;
      case 'DOT':
        source = paperDotted;
        name = '도트노트';
        break;
      case 'PLAIN':
        source = paperPlain;
        name = '플레인노트';
        break;
    }

    const isSelectedStyle = useMemo(
      () => style === paperStyle,
      [paperStyle, style],
    );

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.paperStyleButton}
        onPress={() => {
          setPaperStyle(style);
        }}>
        <Image source={source} style={styles.paperStyleImage} />
        {isSelectedStyle ? (
          <View style={styles.checked}>
            <Image source={checkMark} style={styles.checkMarkImageSmall} />
          </View>
        ) : (
          <View style={styles.unchecked} />
        )}
        <Text style={styles.paperStyleName}>{name}</Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  paperStyleButton: {marginRight: 16, position: 'relative'},
  paperStyleImage: {
    height: 160,
    width: 118,
  },
  checkMarkImageSmall: {height: 15, width: 15},
  checked: {
    backgroundColor: '#ff6ece',
    position: 'absolute',
    right: 5,
    top: 5,
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unchecked: {
    backgroundColor: '#ffc7f0',
    position: 'absolute',
    right: 5,
    top: 5,
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#fff',
  },
  paperStyleName: {
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: 'white',
  },
});
