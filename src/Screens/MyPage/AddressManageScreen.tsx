import {Header2} from '@components/Headers/Header2';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackParamsList} from '@type/stackParamList';
import React, {useCallback} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<StackParamsList, 'AddressManage'>;

export function AddressManage({navigation}: Props) {
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle={'light-content'} />
      <Header2 title={'주소록 관리'} color={'white'} onPressBack={goBack} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0000cc'},
});
