import {useCallback, useEffect, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {existsNickname} from '@apis/member';

type NicknameValidationKey =
  | 'CURRENT_NICKNAME'
  | 'ALREADY_USED'
  | 'FORM_INCORRECT'
  | 'PASS';

type NicknameValidationResultMap = {
  [key in NicknameValidationKey]: NicknameValidationResult;
};

export type NicknameValidationResult = {
  valid: boolean;
  message: string;
};

const NICKNAME_VALIDATION_RESULT_MAP: NicknameValidationResultMap = {
  CURRENT_NICKNAME: {
    valid: false,
    message: '이미 사용중인 별명이에요.',
  },
  ALREADY_USED: {
    valid: false,
    message: '이미 사용중인 별명이에요.',
  },
  FORM_INCORRECT: {
    valid: false,
    message:
      '닉네임은 한글 1자 이상, 영문 2자 이상, 숫자 2자 이상 또는 영문과 숫자를 합쳐 2자 이상이어야 하며, 15자 이내여야 합니다. 사용할 수 있는 문자는 한글(완성형), 영문, 숫자만 가능하고, 공백, 특수문자, 이모지, 단독 자음·모음(예: ㄱ, ㅏ 등)은 사용할 수 없습니다.',
  },
  PASS: {
    valid: true,
    message: '사용 가능한 별명이에요.',
  },
};

export const useNickname = (curruntNickname?: string) => {
  const [tempNickname, setTempNickname] = useState('');
  const [disable, setDisable] = useState(true);

  const [nickname, setNickname] = useState<string>('');

  const [nicknameValidationResult, setNicknameValidationResult] = useState<
    NicknameValidationResult | undefined
  >();

  const alterOpacity = useRef(new Animated.Value(0)).current;

  const alert = Animated.timing(alterOpacity, {
    toValue: 1,
    duration: 0,
    useNativeDriver: true,
  });

  const onChangeNickname = useCallback(
    (name: string) => {
      alert.reset();
      setTempNickname(name);
      setDisable(true);
    },
    [alert],
  );

  useEffect(() => {
    if (!tempNickname) {
      setDisable(true);
    }
    const debounce = setTimeout(() => {
      setNickname(tempNickname);
    }, 500);
    return () => clearTimeout(debounce);
  }, [setNickname, tempNickname]);

  useEffect(() => {
    const checkNicknameAvailable = async () => {
      if (curruntNickname && nickname === curruntNickname) {
        setNicknameValidationResult(
          NICKNAME_VALIDATION_RESULT_MAP.CURRENT_NICKNAME,
        );
      } else if (
        !/^(?=.{1,15}$)(?!.*[^가-힣A-Za-z0-9])(?:(?=.*[가-힣])|(?=(?:.*[A-Za-z]){2,})|(?=(?:.*\d){2,})|(?=(?=.*[A-Za-z])(?=.*\d))).+$/.test(
          nickname,
        )
      ) {
        setNicknameValidationResult(
          NICKNAME_VALIDATION_RESULT_MAP.FORM_INCORRECT,
        );
      } else if (await existsNickname(nickname)) {
        setNicknameValidationResult(
          NICKNAME_VALIDATION_RESULT_MAP.ALREADY_USED,
        );
      } else {
        setNicknameValidationResult(NICKNAME_VALIDATION_RESULT_MAP.PASS);
        setDisable(false);
      }
      alert.start();
    };

    if (nickname) {
      checkNicknameAvailable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname]);

  const initializeNicknameModal = useCallback(() => {
    setTempNickname('');
    alert.reset();
  }, [alert]);

  return {
    nickname,
    tempNickname,
    disable,
    alterOpacity,
    nicknameValidationResult,
    onChangeNickname,
    initializeNicknameModal,
  };
};
