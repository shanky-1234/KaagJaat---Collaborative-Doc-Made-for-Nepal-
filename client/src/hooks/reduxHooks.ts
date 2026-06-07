import type { AppDispatch, RootState,  } from "@/redux/store/store";
import { useDispatch, useSelector, useStore } from "react-redux";

export const useAppDispatch =  useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()