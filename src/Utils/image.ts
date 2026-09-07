import {BASE_URL} from '../Constants/common';

export const getImageUrl = (image: string) => {
  return BASE_URL + `/files/${image}`;
};
