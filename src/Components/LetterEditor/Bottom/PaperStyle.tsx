import React from 'react';
import {View} from 'react-native';
import {PaperStyle as _PaperStyle} from '@type/types';
import {Dotted} from '../../Letter/PaperStyle/Dotted';
import {Grid} from '../../Letter/PaperStyle/Grid';

interface Props {
  lineColor: string;
  paperStyle: _PaperStyle;
}

export const PaperStyle = React.memo(({lineColor, paperStyle}: Props) => {
  return (
    <View>
      {paperStyle === 'GRID' && <Grid lineColor={lineColor} />}
      {paperStyle === 'DOT' && <Dotted lineColor={lineColor} />}
    </View>
  );
});
