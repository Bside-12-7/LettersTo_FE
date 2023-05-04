import {Linking} from 'react-native';

export const onPressPrivacyPolicy = async () => {
  Linking.openURL(
    'https://alert-athlete-d7c.notion.site/00de9a73e19a4e119e09312c1e6577a9',
  );
};

export const onPressTermsOfService = async () => {
  Linking.openURL(
    'https://alert-athlete-d7c.notion.site/36b5d2ff6eb74d9490c178a6d9faf6d3',
  );
};

export const onPressFeedback = async () => {
  Linking.openURL('https://forms.gle/ZfTxDW2TSWWV2Wph7');
};
