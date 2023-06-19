import React from 'react';
import {Image, View} from 'react-native';

const RewardRemainingIcon = () => (
  <Image
    style={{height: 28, width: 28}}
    source={require('@assets/Icon/reward/reward_remain.png')}
  />
);

const RewardReceivedIcon = () => (
  <Image
    style={{height: 28, width: 28}}
    source={require('@assets/Icon/reward/reward_received.png')}
  />
);

export const RemainingDailyRewardsCounter = React.memo(
  ({remainCnt}: {remainCnt: number}) => {
    const renderRemainingRewardCounter = () => {
      const result = [1, 1, 1, 1, 1].map((_, index) => {
        return index < 5 - remainCnt ? (
          <RewardReceivedIcon key={index} />
        ) : (
          <RewardRemainingIcon key={index} />
        );
      });
      return result;
    };

    return (
      <View style={{flexDirection: 'row'}}>
        {renderRemainingRewardCounter()}
      </View>
    );
  },
);
