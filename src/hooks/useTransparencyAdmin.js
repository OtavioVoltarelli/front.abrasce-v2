import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    uploadTransparencyFile,
    deleteTransparencyPath,
    moveTransparencyPath,
    renameTransparencyPath,
    createTransparencyFolder,
} from '../services/transparencyAdminService';

const QUERY_KEY = ['transparency-tree'];

export const useUploadTransparency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ file, path }) => uploadTransparencyFile(file, path),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useDeleteTransparency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ path }) => deleteTransparencyPath(path),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useMoveTransparency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ from, to }) => moveTransparencyPath(from, to),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useRenameTransparency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ path, name }) => renameTransparencyPath(path, name),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useCreateTransparencyFolder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ path }) => createTransparencyFolder(path),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};