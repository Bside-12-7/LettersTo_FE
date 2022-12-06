import React from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL_TEST} from '../Constants/common';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../Constants/screen';

type Props = {
  isImageModalVisible: boolean;
  setImageModalVisible: (isImageModalVisible: boolean) => void;
  images: string[];
};

export const ImageModal = React.memo(
  ({isImageModalVisible, setImageModalVisible, images}: Props) => {
    const hideModal = () => {
      setImageModalVisible(false);
    };

    return (
      <Modal
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        onRequestClose={hideModal}
        visible={isImageModalVisible}>
        <SafeAreaView style={styles.container}>
          <View style={styles.close}>
            <TouchableOpacity onPress={hideModal}>
              <Image
                source={require('../Assets/close_white.png')}
                style={styles.closeButton}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            pagingEnabled
            snapToInterval={SCREEN_WIDTH - 100}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={styles.imageWrap}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{
                  uri: BASE_URL_TEST + `/files/${image}`,
                }}
                style={styles.image}
              />
            ))}
          </ScrollView>
          <View style={styles.paddingBottom} />
        </SafeAreaView>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {paddingTop: 12, paddingLeft: 16},
  closeButton: {height: 28, width: 28},
  imageWrap: {
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 48,
  },
  image: {
    width: SCREEN_WIDTH - 100,
    minHeight: SCREEN_HEIGHT - 300,
    resizeMode: 'contain',
    marginRight: 0,
  },
  paddingBottom: {marginBottom: 40},
});
