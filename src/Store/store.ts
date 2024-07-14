import create from 'zustand';
import {
  // Stamps,
  PaperColor,
  PaperStyle,
  DeliveryLetterWriteRequest,
  DeliveryLetterWriteRequestV2,
} from '@type/types';
import {subDate} from '@utils/dateFormatter';

interface Store {
  letter:
    | {
        title: string;
        text: string;
        paperStyle: PaperStyle;
        paperColor: PaperColor;
        alignType: 'LEFT' | 'CENTER' | 'RIGHT';
        images?: string[];
      }
    | undefined;

  setLetter: (letterData: {
    title: string;
    text: string;
    paperStyle: PaperStyle;
    paperColor: PaperColor;
    alignType: 'LEFT' | 'CENTER' | 'RIGHT';
    images?: string[];
  }) => void;

  cover: {
    topicIds: number[];
    personalityIds: number[];
    stamp: number | undefined;
    nickname: string;
    address: {
      region: string;
      city: string;
    };
  };
  setCoverTopicIds: (topicIds: number[]) => void;
  setCoverPersonalityIds: (personalityIds: number[]) => void;
  setCoverStampId: (stampId: number | undefined) => void;
  setCoverNickname: (nickname: string) => void;
  setCoverAddress: (region: string, city: string) => void;

  // stamps: Stamps;
  // setStamps: (value: Stamps) => void;
}

const useStore = create<Store>(set => ({
  letter: undefined,

  setLetter: letterData => set(() => ({letter: {...letterData}})),

  cover: {
    topicIds: [],
    personalityIds: [],
    stamp: undefined,
    nickname: '',
    address: {
      region: '',
      city: '',
    },
  },

  setCoverTopicIds: topicIds =>
    set(state => ({cover: {...state.cover, topicIds: topicIds}})),

  setCoverPersonalityIds: personalityIds =>
    set(state => ({cover: {...state.cover, personalityIds: personalityIds}})),

  setCoverStampId: stampId =>
    set(state => ({cover: {...state.cover, stamp: stampId}})),

  setCoverNickname: nickname =>
    set(state => ({cover: {...state.cover, nickname}})),

  setCoverAddress: (region, city) =>
    set(state => ({cover: {...state.cover, address: {region, city}}})),

  // stamps: [
  //   {id: 1, image: require('@assets/Image/stamp/1.png')},
  //   {id: 2, image: require('@assets/Image/stamp/2.png')},
  //   {id: 3, image: require('@assets/Image/stamp/3.png')},
  //   {id: 4, image: require('@assets/Image/stamp/4.png')},
  //   {id: 5, image: require('@assets/Image/stamp/5.png')},
  //   // {id: 6, image: require('@assets/Image/stamp/6.png')},
  //   {id: 7, image: require('@assets/Image/stamp/7.png')},
  //   // {id: 8, image: require('@assets/Image/stamp/8.png')},
  //   {id: 9, image: require('@assets/Image/stamp/9.png')},
  //   {id: 10, image: require('@assets/Image/stamp/10.png')},
  //   {id: 11, image: require('@assets/Image/stamp/11.png')},
  //   {id: 12, image: require('@assets/Image/stamp/12.png')},
  //   {id: 13, image: require('@assets/Image/stamp/13.png')},
  //   {id: 14, image: require('@assets/Image/stamp/14.png')},
  // ],

  // setStamps: value => set(() => ({stamps: [...value]})),
}));

export default useStore;

interface LetterEditorStore {
  deliveryLetter: DeliveryLetterWriteRequest | DeliveryLetterWriteRequestV2;

  deliveryLetterTo:
    | {
        toNickname: string;
        toAddress: string;
      }
    | undefined;

  standardDeliveryDate: string;

  setDeliveryLetterData: (
    value: DeliveryLetterWriteRequest | DeliveryLetterWriteRequestV2,
  ) => void;

  setDeliverLetterTo: (value: {toNickname: string; toAddress: string}) => void;

  setStandardDeliveryDate: (value: string) => void;

  initializeDeliverLetter: () => void;

  isDeliveryLetterSetComplete: () => boolean;
}

export const useLetterEditorStore = create<LetterEditorStore>((set, get) => ({
  deliveryLetter: {
    letterId: undefined,
    letterBoxType: undefined,
    opponentMemberId: undefined,
    id: undefined,
    title: undefined,
    content: undefined,
    paperType: undefined,
    paperColor: undefined,
    alignType: undefined,
    stampId: undefined,
    files: [],
    deliveryType: undefined,
  },

  deliveryLetterTo: undefined,

  standardDeliveryDate: '',

  setDeliverLetterTo: (value: {toNickname: string; toAddress: string}) =>
    set(() => ({deliveryLetterTo: value})),

  setDeliveryLetterData: (value: DeliveryLetterWriteRequest) =>
    set(state => ({deliveryLetter: {...state.deliveryLetter, ...value}})),

  setStandardDeliveryDate: (deliveryDate: string) => {
    const {days, hours, minutes} = subDate(new Date(deliveryDate), new Date());

    let dateString = '';
    if (days > 0) dateString = days + '일 ';
    if (hours > 0) dateString += hours + '시간 ';
    if (minutes > 0) dateString += minutes + '분 ';

    set(() => ({standardDeliveryDate: dateString}));
  },

  initializeDeliverLetter: () =>
    set(() => ({
      deliveryLetter: {
        letterId: undefined,
        letterBoxType: undefined,
        opponentMemberId: undefined,
        id: undefined,
        title: undefined,
        content: undefined,
        paperType: undefined,
        paperColor: undefined,
        alignType: undefined,
        stampId: undefined,
        files: [],
        deliveryType: undefined,
      },
    })),

  isDeliveryLetterSetComplete: () => {
    const letter = get().deliveryLetter;

    return !Object.values(letter).includes(undefined);
  },
}));
