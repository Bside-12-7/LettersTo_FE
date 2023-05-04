import {LinearGradient} from 'expo-linear-gradient';
import React, {useMemo} from 'react';
import {GRADIENT_COLORS, PAPER_COLORS} from '@constants/letter';
import type {PaperColor, PaperStyle as _PaperStyle} from '@type/types';
import {PaperStyle} from '../../LetterEditor/Bottom/PaperStyle';

type Props = {
  children: JSX.Element;
  paperColor: PaperColor;
  paperStyle: _PaperStyle;
};

export const PaperBackgroud = ({children, paperColor, paperStyle}: Props) => {
  const lineColor = useMemo(() => {
    if (['PINK', 'ORANGE', 'BLUE', 'PURPLE'].includes(paperColor)) {
      return PAPER_COLORS[paperColor] + '19';
    } else if (['MINT', 'SKY_BLUE'].includes(paperColor)) {
      return PAPER_COLORS[paperColor] + '26';
    } else {
      return PAPER_COLORS[paperColor] + '33';
    }
  }, [paperColor]);

  const gradientColor = useMemo(
    () => GRADIENT_COLORS[paperColor],
    [paperColor],
  );

  return (
    <LinearGradient
      colors={[gradientColor, 'white']}
      locations={[0, 0.2]}
      style={{flex: 1}}>
      <PaperStyle lineColor={lineColor} paperStyle={paperStyle} />
      {children}
    </LinearGradient>
  );
};
