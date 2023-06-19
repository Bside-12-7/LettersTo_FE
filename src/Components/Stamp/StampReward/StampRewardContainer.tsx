import {
  getRewardStatus,
  requestDailyReward,
  requestShareReward,
} from '@apis/reward';
import React, {useCallback, useState, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {RemainingDailyRewardsCounter} from './RemainingDailyRewardsCounter';
import {RewardInformationButton} from './RewardInformationButton';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import KakaoLink from 'react-native-kakao-share-link';
import {RewardTimer} from './RewardTimer';
import {useInterval} from '@hooks/useInterval';
import {KAKAO_LINK_INVITATION_DATA} from '@constants/share';
import Toast from '@components/Toast/toast';

type Props = {
  toggleRewardInformationModal: () => void;
  toggleRewardSuccessModal: () => void;
};

export const StampReward = React.memo(
  ({toggleRewardInformationModal, toggleRewardSuccessModal}: Props) => {
    const [timer, setTimer] = useState(0);

    const queryClient = useQueryClient();

    const clearStampHistoriesQueryCache = () => {
      queryClient.invalidateQueries('reward');
      queryClient.invalidateQueries('stampHistories');
      queryClient.invalidateQueries('userInfo');
    };

    const rewardQuery = useQuery('reward', getRewardStatus, {
      refetchOnMount: true,
      onSuccess(data) {
        setTimer(new Date(data.nextDailyDate).getTime() - new Date().getTime());
      },
    });

    const dailyRewardMutation = useMutation(
      ['reward', 'daily'],
      requestDailyReward,
      {
        onSuccess: clearStampHistoriesQueryCache,
      },
    );

    const shareRewardMutation = useMutation(
      ['reward', 'share'],
      requestShareReward,
      {
        onSuccess: clearStampHistoriesQueryCache,
      },
    );

    const openRewardInformationModal = useCallback(
      () => toggleRewardInformationModal(),
      [toggleRewardInformationModal],
    );

    const openRewardSuccessModal = useCallback(
      () => toggleRewardSuccessModal(),
      [toggleRewardSuccessModal],
    );

    const onPressShareAndGetReward = async () => {
      try {
        await KakaoLink.sendFeed(KAKAO_LINK_INVITATION_DATA);
        shareRewardMutation.mutate();
      } catch (error: any) {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      }
    };

    const isDailyRewardReady = useMemo(() => timer <= 0, [timer]);

    const formattedTimer = useMemo(() => {
      const minutes = Math.floor(timer / (1000 * 60));
      const seconds = Math.floor((timer % (1000 * 60)) / 1000);

      return (
        (minutes < 10 ? '0' + minutes : minutes) +
        ' : ' +
        (seconds < 10 ? '0' + seconds : seconds)
      );
    }, [timer]);

    useInterval(() => {
      if (!rewardQuery.isSuccess) {
        return setTimer(0);
      }
      setTimer(
        new Date(rewardQuery.data.nextDailyDate).getTime() -
          new Date().getTime(),
      );
    }, 1000);

    if (!rewardQuery.isSuccess) {
      return <View style={styles.rewardBox} />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.rewardBox}>
          <RemainingDailyRewardsCounter
            remainCnt={rewardQuery.data.remainingDailyCount}
          />
          <RewardInformationButton onPress={openRewardInformationModal} />
          {isDailyRewardReady ? (
            <RewardTimer.Done
              onPressReward={() => {
                dailyRewardMutation.mutate();
                openRewardSuccessModal();
              }}
            />
          ) : (
            <RewardTimer.Progressing timer={formattedTimer} />
          )}
        </View>
        <View>
          <BottomButton
            buttonText={'친구 초대하고 바로 받기!'}
            onPress={onPressShareAndGetReward}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rewardBox: {
    flex: 1,
    height: 300,
    backgroundColor: '#FFECFA',
    borderRadius: 20,
    padding: 12,
  },
});
