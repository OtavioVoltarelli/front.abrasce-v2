import { useQuery } from '@tanstack/react-query';
import { transparencyService } from '../services/transparencyService';

export function useTransparencyTree() {
    const data = useQuery({
        queryKey: ['transparencyTree'],
        queryFn: () => transparencyService.getTransparencyTree()
    })
    return data;
}