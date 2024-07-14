import React, {useCallback, useMemo} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Alert,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useEffect, useState} from 'react';
import {getDeliveryLetterContent, getPublicLetterContent} from '@apis/letter';
import {DeliveryLetterContent, PublicLetterContent} from '@type/types';
import {PaperBackgroud} from '@components/Letter/PaperBackground/PaperBackgroud';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import {dateFormatter} from '@utils/dateFormatter';
import {ImagePicker} from '@components/LetterEditor/ImagePicker';
import {ImageModal} from '@components/Modals/Image/ImageModal';
import {ModalBlur} from '@components/Modals/ModalBlur';
import {Header2} from '@components/Headers/Header2';
import {useLetterEditorStore} from '@stores/store';
import {ReportModal} from '@components/Modals/Report/ReportModal';
import Toast from '@components/Toast/toast';
import {getUserInfo} from '@apis/member';
import {useQuery} from 'react-query';

const TEXT_ALIGN = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
} as const;

type Props = NativeStackScreenProps<StackParamsList, 'LetterViewer'>;

export function LetterViewer({route, navigation}: Props) {
  const [letterContent, setLetterContent] = useState<
    PublicLetterContent | DeliveryLetterContent
  >();
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const {data: userInfo} = useQuery('userInfo', getUserInfo);
  const {setDeliverLetterTo} = useLetterEditorStore();

  const paperColor = useMemo(
    () => letterContent?.paperColor ?? 'PINK',
    [letterContent],
  );

  const paperStyle = useMemo(() => {
    if (letterContent && letterContent.paperType !== 'LINE') {
      return letterContent.paperType;
    } else {
      return 'PLAIN';
    }
  }, [letterContent]);

  const alignType = useMemo(() => {
    if (letterContent) {
      return TEXT_ALIGN[letterContent.alignType];
    }
    return 'left';
  }, [letterContent]);

  const headerTitle = useMemo(
    () => letterContent && letterContent.fromNickname + '의 편지',
    [letterContent],
  );

  const fromText = useMemo(() => {
    if (letterContent) {
      const fromDate = dateFormatter('yyyy.mm.dd', letterContent.createdDate);
      const fromNickname = letterContent.fromNickname;

      return '\n' + fromDate + ' ' + fromNickname;
    } else {
      return null;
    }
  }, [letterContent]);

  const attachedImages = letterContent?.files ?? [];

  useEffect(() => {
    const getPublicLetter = async (id: number) => {
      try {
        const data = await getPublicLetterContent(id);
        setLetterContent(data);
      } catch (error: any) {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      }
    };

    const getDeliveryLetter = async (id: number) => {
      try {
        const data = await getDeliveryLetterContent(id);
        setLetterContent(data);
      } catch (error: any) {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      }
    };

    if (route.params.to === 'PUBLIC') {
      getPublicLetter(route.params.id);
    } else if (route.params.to === 'DELIVERY') {
      getDeliveryLetter(route.params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onShowImageModal = useCallback(() => {
    setImageModalVisible(true);
  }, [setImageModalVisible]);

  const goBack = useCallback(() => navigation.pop(), [navigation]);

  const alertButtonOK = useMemo(
    () => [{text: '확인', onPress: () => navigation.pop()}],
    [navigation],
  );

  const onPressReply = useCallback(() => {
    if (letterContent) {
      if (userInfo && letterContent.fromNickname === userInfo.nickname) {
        return Alert.alert(
          '내가 작성한 편지에요. 다른 편지에 답장해 보세요.',
          undefined,
          alertButtonOK,
        );
      } else if (letterContent.replied === true) {
        return Alert.alert(
          '이미 답장한 편지에요. 다른 편지들을 보러갈까요?',
          undefined,
          alertButtonOK,
        );
      } else if (letterContent.canReply === false) {
        return Alert.alert(
          '답장할 수 없는 편지입니다.',
          undefined,
          alertButtonOK,
        );
      }

      setDeliverLetterTo({
        toNickname: letterContent.fromNickname,
        toAddress: letterContent.fromAddress,
      });
      navigation.navigate('LetterEditor', {
        reply: route.params.id,
        to: route.params.to,
        type: letterContent.letterBoxType,
        fromMemberId:
          route.params.to === 'DELIVERY'
            ? route.params.fromMemberId
            : undefined,
      });
    }
  }, [
    alertButtonOK,
    letterContent,
    navigation,
    route.params,
    setDeliverLetterTo,
    userInfo,
  ]);

  return (
    <PaperBackgroud paperColor={paperColor} paperStyle={paperStyle}>
      <>
        <StatusBar barStyle={'dark-content'} />
        <SafeAreaView style={styles.container}>
          <Header2
            title={headerTitle}
            onPressBack={goBack}
            onPressReport={() => {
              setReportModalVisible(true);
            }}
          />
          <ScrollView
            alwaysBounceVertical={false}
            style={{
              paddingHorizontal: 24,
            }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                lineHeight: 40,
                fontSize: 14,
                fontFamily: 'Galmuri11',
                color: '#0000cc',
                paddingTop: 30,
                textAlign: alignType,
              }}>
              ⌜{letterContent?.title}⌟︎
            </Text>
            <Text
              style={{
                flex: 1,
                lineHeight: 40,
                fontSize: 14,
                fontFamily: 'Galmuri11',
                color: '#0000cc',
                textAlign: alignType,
              }}>
              {letterContent?.content}
            </Text>
            <Text
              style={{
                textAlign: 'right',
                fontSize: 14,
                fontFamily: 'Galmuri11',
                color: '#0000cc',
                marginBottom: 30,
              }}>
              {fromText}
            </Text>
          </ScrollView>
          {attachedImages.length > 0 && (
            <View style={{position: 'relative', paddingBottom: 10}}>
              <ImagePicker
                images={attachedImages}
                loading={false}
                onShowImageModal={onShowImageModal}
              />
            </View>
          )}
          <BottomButton
            disable={false}
            buttonText={'답장하기'}
            onPress={onPressReply}
          />
        </SafeAreaView>
        {(isImageModalVisible || isReportModalVisible) && <ModalBlur />}
        <ImageModal
          isImageModalVisible={isImageModalVisible}
          setImageModalVisible={setImageModalVisible}
          images={attachedImages}
        />
        <ReportModal
          letterId={route.params.id}
          isModalVisible={isReportModalVisible}
          setModalVisible={setReportModalVisible}
        />
      </>
    </PaperBackgroud>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
