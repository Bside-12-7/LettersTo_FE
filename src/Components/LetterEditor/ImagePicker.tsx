import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Animated,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {SCREEN_WIDTH} from '@constants/screen';
import {getImageUrl} from '@utils/image';
const closeImg = require('@assets/Icon/close/close_blue.png');

const foldButton = require('@assets/fold.png');
const unfoldButton = require('@assets/unfold.png');

export const ImagePicker = React.memo(
  ({
    images,
    loading,
    deleteImage,
    onShowImageModal,
  }: {
    images: string[];
    loading: boolean;
    deleteImage?: (id: string) => void;
    onShowImageModal: (id: string) => void;
  }) => {
    const [visible, setVisible] = useState(false);
    // const [borderColor, setBorderColor] = useState('white');
    const [loadingVisible, setLoadingVisible] = useState(false);

    const height = useRef(new Animated.Value(1)).current;

    const foldHeight = Animated.timing(height, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    });

    const unfoldHeight = Animated.timing(height, {
      toValue: 76,
      duration: 300,
      useNativeDriver: false,
    });

    const fold = () => {
      setLoadingVisible(false);
      foldHeight.start(() => {
        setVisible(false);
        // setBorderColor('#0000cc');
      });
    };

    const unfold = useCallback(() => {
      setVisible(true);
      // setBorderColor('white');
      unfoldHeight.start(() => {
        setLoadingVisible(true);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPressFold = () => {
      if (visible) {
        fold();
      } else {
        unfold();
      }
    };

    useEffect(() => {
      if (loading) {
        unfold();
      }
    }, [loading, unfold]);

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: Animated.multiply(height, new Animated.Value(-1)),
          left: 0,
          height: height,
          width: SCREEN_WIDTH,
        }}>
        <Pressable
          onPress={onPressFold}
          style={{
            position: 'absolute',
            top: -37,
            left: 12,
            zIndex: 2,
            borderBottomWidth: 1,
            borderBottomColor: 'white',
          }}>
          <Image
            source={visible ? foldButton : unfoldButton}
            style={{
              width: 126,
              height: 37,
            }}
          />
        </Pressable>
        {loading ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              backgroundColor: 'white',
              borderTopColor: '#0000cc',
              borderTopWidth: 1,
            }}>
            {loadingVisible && (
              <ActivityIndicator size="small" color="#0000cc" />
            )}
          </View>
        ) : (
          <ScrollView
            horizontal
            alwaysBounceHorizontal={false}
            style={{
              paddingHorizontal: 16,
              backgroundColor: 'white',
              borderTopColor: '#0000cc',
              borderTopWidth: 1,
            }}>
            {images &&
              images.map((image, index) => (
                <Pressable
                  onPress={() => {
                    onShowImageModal(image);
                  }}
                  key={index}
                  style={{
                    position: 'relative',
                    backgroundColor: 'black',
                    marginRight: 16,
                    marginVertical: 10,
                  }}>
                  <Image
                    source={{
                      uri: getImageUrl(image),
                    }}
                    style={{
                      width: 55,
                      height: 55,
                    }}
                  />
                  {deleteImage && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => deleteImage(image)}
                      style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                      }}>
                      <Image
                        source={closeImg}
                        style={{
                          height: 16,
                          width: 16,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </Pressable>
              ))}
          </ScrollView>
        )}
      </Animated.View>
    );
  },
);
