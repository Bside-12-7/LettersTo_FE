import React, {useRef} from 'react';
import {
  PanResponder,
  Animated,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

type Props = {
  scrollViewRef: React.RefObject<ScrollView>;
  children?: React.ReactNode;
};

const THRESHOLD = 100;

export const ListItemWithSwipeAction = ({scrollViewRef, children}: Props) => {
  const release = (distance: number) => {
    Animated.spring(pan, {
      toValue: {x: distance, y: 0},
      useNativeDriver: false,
    }).start();
  };

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          scrollViewRef.current?.setNativeProps({scrollEnabled: false});
        }
        if (gestureState.dx < -THRESHOLD) {
          const newX = -THRESHOLD - Math.sqrt(-THRESHOLD - gestureState.dx);
          pan.setValue({x: newX, y: 0});
        } else if (gestureState.dx < 0) {
          pan.setValue({x: gestureState.dx, y: 0});
        }
      },
      onPanResponderRelease: (_event, gestureState) => {
        if (gestureState.dx < -THRESHOLD / 2) {
          release(-THRESHOLD);
        } else {
          release(0);
        }
        scrollViewRef.current?.setNativeProps({scrollEnabled: true});
      },
    }),
  ).current;

  const backgroundColor = pan.x.interpolate({
    inputRange: [-THRESHOLD, 0],
    outputRange: ['#FF5500', '#ffffff'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Background container */}
      <Animated.View style={[styles.background, {backgroundColor}]} />
      <TouchableOpacity
        activeOpacity={0.7}
        style={{backgroundColor: '#FF5500'}}
        onPress={() => Alert.alert('Archive')}>
        <View style={[styles.iconContainer, styles.iconContainerRight]}>
          <Text style={styles.actionText}>삭제</Text>
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.item,
          {transform: [{translateX: pan.x}, {translateY: pan.y}]},
        ]}
        {...panResponder.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 100,
    justifyContent: 'center',
    width: '100%',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  item: {
    height: 100,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 16,
    flexDirection: 'row',
    borderBottomColor: '#0000CC40',
    borderBottomWidth: 1,
  },
  actionText: {
    fontFamily: 'Galmuri11',
    fontSize: 13,
    color: '#FFFFFF',
  },
  text: {
    color: '#0000CC',
    fontSize: 20,
    marginLeft: 30,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 100,
    height: 100,
  },
  iconContainerLeft: {
    left: 0,
  },
  iconContainerRight: {
    right: 0,
  },
});
