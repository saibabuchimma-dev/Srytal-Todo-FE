import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/config';
import { getProfile } from '../services/profile.service';

export const useProfile = () =>
  useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: getProfile,
  });
