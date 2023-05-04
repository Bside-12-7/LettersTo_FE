import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {HyperLink} from '@components/HyperLink/HyperLinkText';

type Params = {
  onPressPrivacyPolicy: () => void;
  onPressTermsOfService: () => void;
};

export const PolicyNotice = React.memo(
  ({onPressPrivacyPolicy, onPressTermsOfService}: Params) => (
    <View style={styles.policyWrap}>
      <Text style={styles.policyText}>
        회원가입 시{' '}
        <HyperLink onPress={onPressPrivacyPolicy}>개인정보처리방침</HyperLink>을
        읽었으며
      </Text>
      <Text style={styles.policyText}>
        <HyperLink onPress={onPressTermsOfService}>서비스이용약관</HyperLink>에
        동의하신 것으로 간주합니다
      </Text>
    </View>
  ),
);

const styles = StyleSheet.create({
  policyWrap: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  policyText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: 'white',
    lineHeight: 17,
  },
});
