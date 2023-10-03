import {BASE_URL_PROD} from '../Constants/common';

export const getImageUrl = (image: string) => {
  return BASE_URL_PROD + `/files/${image}`;
};
