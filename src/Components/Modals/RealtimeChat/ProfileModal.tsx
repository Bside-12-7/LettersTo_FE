import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from 'react-query';
import {getChatMemberProfile} from '@apis/chatMessage';
import {ModalBlur} from '../ModalBlur';

const closeBtn = require('@assets/Icon/close/close_blue.png');

interface Props {
  visible: boolean;
  memberId: number | null;
  onClose: () => void;
}

export const ProfileModal = React.memo(
  ({visible, memberId, onClose}: Props) => {
    const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

    const {data: profile, isLoading} = useQuery(
      ['chatMemberProfile', memberId],
      () => getChatMemberProfile(memberId!),
      {
        enabled: visible && memberId !== null,
      },
    );

    return (
      <>
        {visible && <ModalBlur />}
        <Modal
          statusBarTranslucent={true}
          animationType="slide"
          transparent={true}
          onRequestClose={onClose}
          visible={visible}>
          <View style={styles.container}>
            <View style={[styles.modal, {paddingBottom: SAFE_AREA_BOTTOM}]}>
              {/* 닫기 버튼 */}
              <TouchableOpacity
                style={styles.closeBtn}
                activeOpacity={0.7}
                onPress={onClose}>
                <Image style={styles.closeBtnImg} source={closeBtn} />
              </TouchableOpacity>

              {/* 프로필 내용 */}
              <View style={styles.contents}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#0000CC" />
                ) : profile ? (
                  <>
                    {/* 닉네임 */}
                    <Text style={styles.nickname}>{profile.nickname}</Text>

                    {/* 지역 */}
                    <Text style={styles.region}>{profile.region}</Text>

                    {/* 관심사 */}
                    {profile.topics && profile.topics.length > 0 && (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>관심사</Text>
                        <View style={styles.tagContainer}>
                          {profile.topics.map(topic => (
                            <View key={topic.id} style={styles.tag}>
                              <Text style={styles.tagText}>{topic.name}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={styles.errorText}>
                    프로필을 불러올 수 없습니다
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    paddingTop: 16,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 16,
  },
  closeBtnImg: {
    height: 28,
    width: 28,
  },
  contents: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    minHeight: 200,
    justifyContent: 'center',
  },
  nickname: {
    fontFamily: 'Galmuri11',
    fontSize: 20,
    color: '#0000CC',
    textAlign: 'center',
    marginBottom: 8,
  },
  region: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontFamily: 'Galmuri11',
    fontSize: 13,
    color: '#0000CC',
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F0FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
  },
  errorText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
