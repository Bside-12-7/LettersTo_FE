import {useCallback, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {useQuery} from 'react-query';
import {getCities, getRegions} from '@apis/geolocation';

type Props = {
  parentGeolocationId: number | null;
  geolocationId: number;
};

export const useLocation = (
  currentLocation: Props = {
    geolocationId: 0,
    parentGeolocationId: null,
  },
) => {
  const [selectedRegionId, setSelectedRegionId] = useState<null | number>(0);
  const [selectedCityId, setSelectedCityId] = useState<number>(0);

  const noticeOpacity = useRef(new Animated.Value(0)).current;

  const alert = Animated.sequence([
    Animated.timing(noticeOpacity, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }),
    Animated.timing(noticeOpacity, {
      toValue: 0,
      delay: 2000,
      useNativeDriver: true,
    }),
  ]);

  const onStartNotice = useCallback(() => {
    alert.reset();
    alert.start();
  }, [alert]);

  const reset = useCallback(() => {
    setSelectedRegionId(currentLocation.parentGeolocationId);
    setTimeout(() => {
      setSelectedCityId(currentLocation.geolocationId);
    }, 0);
  }, [setSelectedCityId, setSelectedRegionId, currentLocation]);

  const {data: regions} = useQuery(
    'regions',
    useCallback(
      async () =>
        (await getRegions()).map(({id, name}) => {
          return {value: id, label: name};
        }),
      [],
    ),
  );

  const {data: cities} = useQuery(
    ['cities', selectedRegionId],
    useCallback(async () => {
      setSelectedCityId(0);
      if (selectedRegionId) {
        return (await getCities(selectedRegionId))
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map(({id, name}) => {
            return {value: id, label: name};
          });
      }
    }, [selectedRegionId]),
  );

  return {
    regions: regions || [],
    selectedRegionId,
    setSelectedRegionId,
    cities: cities || [],
    selectedCityId,
    setSelectedCityId,
    noticeOpacity,
    onStartNotice,
    reset,
  };
};
