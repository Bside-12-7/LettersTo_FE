import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

const reportButton = require('@assets/Icon/report/report.png');

type Props = {
  onPress: () => void;
};

export const ReportButton = React.memo(({onPress}: Props) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={styles.reportButton}>
    <Image style={styles.report} source={reportButton} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  reportButton: {
    marginLeft: 22,
  },
  report: {
    width: 28,
    height: 28,
  },
});
