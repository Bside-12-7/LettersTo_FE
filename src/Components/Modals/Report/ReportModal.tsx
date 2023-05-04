import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {ModalHeader} from '@components/Headers/ModalHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import {useKeyboard} from '@hooks/Hardware/useKeyboard';
import {reportLetter} from '@apis/report';
import {ReportData} from '@type/types';
import Toast from '@components/Toast/toast';

const REPORT_ITEMS = [
  {id: 0, text: '욕설 및 비하발언 포함'},
  {id: 1, text: '음란한 내용 및 만남 유도'},
  {id: 2, text: '동일 내용 도배 및 부적절한 컨텐츠'},
  {id: 3, text: '기타'},
];

type Props = {
  letterId: number;
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ReportModal = ({
  letterId,
  isModalVisible,
  setModalVisible,
}: Props) => {
  const [selectedReportItemId, setSelectedReportItemId] = useState<number>(0);

  const [reportText, setReportText] = useState('');

  const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  const hideModal = () => {
    setModalVisible(false);
  };

  const onPressReportLetter = async () => {
    try {
      let description: string;
      if (selectedReportItemId === 3) {
        description = reportText;
      } else {
        description = REPORT_ITEMS[selectedReportItemId].text;
      }

      const reportData: ReportData = {
        letterId,
        description,
      };

      await reportLetter(reportData);
      Toast.show('신고 접수되었습니다.');
    } catch (error: any) {
      console.error(error);
      Toast.show('문제가 발생했습니다');
    } finally {
      hideModal();
    }
  };

  useEffect(() => {
    setSelectedReportItemId(0);
  }, [isModalVisible]);

  useEffect(() => {
    setReportText('');
  }, [selectedReportItemId]);

  const {keyboardHeight, keyboardVisible} = useKeyboard();

  return (
    <Modal
      statusBarTranslucent={true} // android
      animationType="slide"
      transparent={true}
      onRequestClose={hideModal}
      visible={isModalVisible}>
      <View style={styles.container}>
        <View style={[styles.modalView, {paddingBottom: SAFE_AREA_BOTTOM}]}>
          <ScrollView alwaysBounceVertical={false}>
            <ModalHeader title={'신고하기'} onPressClose={hideModal} />

            <View style={styles.titleBox}>
              <View style={styles.titleWrap}>
                <Text style={styles.titleText}>신고 이유를 선택해주세요</Text>
              </View>
            </View>

            <View>
              {REPORT_ITEMS.map(REPORT_ITEM =>
                REPORT_ITEM.id === selectedReportItemId ? (
                  <TouchableOpacity
                    key={REPORT_ITEM.id}
                    activeOpacity={0.7}
                    style={styles.reportItemButton_selected}>
                    <View style={styles.check_selected} />
                    <Text style={styles.reportItemText_selected}>
                      {REPORT_ITEM.text}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    key={REPORT_ITEM.id}
                    onPress={() => {
                      setSelectedReportItemId(REPORT_ITEM.id);
                    }}
                    activeOpacity={0.7}
                    style={styles.reportItemButton}>
                    <View style={styles.check} />
                    <Text style={styles.reportItemText}>
                      {REPORT_ITEM.text}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
            {selectedReportItemId === 3 && (
              <TextInput
                multiline
                autoFocus
                value={reportText}
                onChangeText={setReportText}
                placeholder={
                  '자세한 이유를 적어주시면 신고 접수 및 처리에 도움이 됩니다.'
                }
                style={{
                  marginHorizontal: 24,
                  height: 70,
                  borderColor: 'rgba(0,0,204,0.15)',
                  borderRadius: 10,
                  borderWidth: 1,
                  marginBottom: keyboardVisible ? keyboardHeight - 52 : 16,
                  padding: 16,
                  fontFamily: 'Galmuri11',
                  color: '#0000cc',
                  lineHeight: 20,
                }}
              />
            )}
            <BottomButton
              buttonText={'신고하기'}
              onPress={onPressReportLetter}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 10,
  },
  titleWrap: {
    marginBottom: 30,
    justifyContent: 'flex-end',
  },
  titleText: {fontSize: 18, fontFamily: 'Galmuri11', color: '#0000cc'},
  reportItemButton_selected: {
    marginHorizontal: 24,
    height: 52,
    borderColor: '#0000cc',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row',
    backgroundColor: '#0000cc',
  },
  check_selected: {
    borderColor: '#fff',
    height: 24,
    width: 24,
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 10,
  },
  reportItemText_selected: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#fff',
  },
  reportItemButton: {
    marginHorizontal: 24,
    height: 52,
    borderColor: 'rgba(0,0,204,0.15)',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row',
  },
  check: {
    borderColor: 'rgba(0,0,204,0.3)',
    height: 24,
    width: 24,
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 10,
  },
  reportItemText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: 'rgba(0,0,204,0.6)',
  },
});
