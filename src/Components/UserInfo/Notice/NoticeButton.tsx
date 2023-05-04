import React from 'react';
import {TouchableWithoutFeedback, Image, StyleSheet} from 'react-native';

const noticeImage = require('@assets/Icon/notice/notice.png');

type Params = {
  onPress: () => void;
};

export const NoticeButton = React.memo(({onPress}: Params) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Image style={styles.noticeButtonImage} source={noticeImage} />
  </TouchableWithoutFeedback>
));

const styles = StyleSheet.create({
  noticeButtonImage: {
    marginLeft: 3,
    marginTop: 5,
    height: 20,
    width: 20,
  },
});
