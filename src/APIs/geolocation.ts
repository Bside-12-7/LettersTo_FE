import {axiosInstance} from '@utils/http';
import type {Regions, Cities} from '@type/types';

export async function getRegions() {
  return await axiosInstance.get<Regions>('/geolocations/regions');
}

export async function getCities(id: number) {
  return await axiosInstance.get<Cities>(`/geolocations/regions/${id}/cities`);
}
