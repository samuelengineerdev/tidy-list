import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';

// Tipado para dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Tipado para selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
