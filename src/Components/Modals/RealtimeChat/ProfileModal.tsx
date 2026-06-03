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
import {LinearGradient} from 'expo-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {getChatMemberProfile} from '@apis/chatMessage';
import {useLetterEditorStore} from '@stores/store';
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
    const navigation =
      useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const {setDeliverLetterTo} = useLetterEditorStore();

    const {data: profile, isLoading} = useQuery(
      ['chatMemberProfile', memberId],
      () => getChatMemberProfile(memberId!),
      {
        enabled: visible && memberId !== null,
      },
    );

    const onPressWriteLetter = () => {
      if (!profile) return;
      setDeliverLetterTo({
        toNickname: profile.nickname,
        toAddress: profile.geolocation.fullname,
        addressId: profile.geolocation.id,
      });
      onClose();
      navigation.navigate('LetterEditor', {
        to: 'DELIVERY',
        type: 'DIRECT_MESSAGE',
        fromMemberId: profile.id,
      });
    };

    // 프로필 조회 실패/미수신 시 모달 자체를 띄우지 않음
    if (!isLoading && !profile) return null;

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
            <View
              style={[styles.sheet, {paddingBottom: SAFE_AREA_BOTTOM + 16}]}>
              {/* 헤더: X 좌, 타이틀 중앙 */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  activeOpacity={0.7}
                  onPress={onClose}>
                  <Image style={styles.closeBtnImg} source={closeBtn} />
                </TouchableOpacity>
                <Text style={styles.title}>프로필</Text>
              </View>

              {/* 프로필 내용 */}
              {isLoading ? (
                <View style={styles.loadingWrap}>
                  <ActivityIndicator size="large" color="#0000CC" />
                </View>
              ) : profile ? (
                <View style={styles.contents}>
                  {/* 닉네임 + 지역 (인라인, 좌측 정렬) */}
                  <View style={styles.identityRow}>
                    <Text style={styles.nickname}>{profile.nickname}</Text>
                    {!!profile.geolocation?.fullname && (
                      <Text style={styles.region}>
                        {profile.geolocation.fullname}
                      </Text>
                    )}
                  </View>

                  {/* 관심사 */}
                  {profile.topics && profile.topics.length > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>관심사</Text>
                      <View style={styles.tagWrap}>
                        {profile.topics.map(topic => (
                          <View key={topic.id} style={styles.tag}>
                            <Text style={styles.tagText}>{topic.name}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* 성향 */}
                  {profile.personalities && profile.personalities.length > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>성향</Text>
                      <View style={styles.tagWrap}>
                        {profile.personalities.map(p => (
                          <View key={p.id} style={styles.tag}>
                            <Text style={styles.tagText}>{p.name}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* 편지 쓰기 버튼 */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onPressWriteLetter}>
                    <LinearGradient
                      colors={['#ff6ece', '#ff3dbd']}
                      style={styles.writeButton}>
                      <Text style={styles.writeButtonText}>편지 쓰기</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : null}
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
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 52,
  },
  closeBtn: {
    position: 'absolute',
    left: 16,
    padding: 4,
  },
  closeBtnImg: {
    height: 28,
    width: 28,
  },
  title: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    color: '#0000CC',
  },
  loadingWrap: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  contents: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  nickname: {
    fontFamily: 'Galmuri11-Bold',
    fontSize: 14,
    color: '#0000CC',
  },
  region: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000CC',
    width: 52,
    marginRight: 16,
  },
  tagWrap: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  tag: {
    borderWidth: 1,
    borderColor: '#0000CC',
    padding: 6,
    backgroundColor: '##0000CC0D',
    marginRight: 4,
  },
  tagText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000CC',
  },
  writeButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 16,
    color: 'white',
  },
});
