import type { AppDispatch, RootState } from "@frontend/redux/store";
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchUntyped,
  useSelector as useSelectorUntyped,
} from "react-redux";

// Typed versions of `useDispatch` and `useSelector` that should be used
export const useDispatch: () => AppDispatch = useDispatchUntyped;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorUntyped;
