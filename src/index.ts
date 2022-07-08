import { useCallback, useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const useStoredState = <T>(
  key: string,
  defaultValue?: T
): [T | undefined, (args: any) => void, boolean, () => void] => {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) readItem();
    return () => {
      isMounted = false;
    };
  }, [key]);

  const readItem = useCallback(async () => {
    const item = await AsyncStorage.getItem(key);
    setValue(item ? JSON.parse(item) : defaultValue);
    setLoaded(true);
  }, [key]);

  const writeItem = useCallback(
    (newValue: T) => {
      setValue(newValue);
      AsyncStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  const removeItem = useCallback(() => {
    setValue(undefined);
    AsyncStorage.removeItem(key);
  }, [key]);

  return [value, writeItem, loaded, removeItem];
};

export const useStoredReducer = <S, T extends string>(
  key: string,
  stateReducer: (state: S, action: { type: T; payload: any }) => S,
  defaultValue?: S
): [S | undefined, (args: { type: T; payload: any }) => void, boolean, () => void] => {
  const reducer = (state: S, action: { type: T; payload: any }) => {
    const newState = action.type === 'load' ? action.payload : stateReducer(state, action);
    AsyncStorage.setItem(key, JSON.stringify(newState));
    return newState;
  };

  const [value, dispatch] = useReducer(reducer, defaultValue);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) readItem();
    return () => {
      isMounted = false;
    };
  }, [key]);

  const readItem = useCallback(async () => {
    const item = await AsyncStorage.getItem(key);
    if (item) dispatch({ type: 'load', payload: item ? JSON.parse(item) : defaultValue });
    setLoaded(true);
  }, [key]);

  const removeItem = useCallback(() => {
    AsyncStorage.removeItem(key);
  }, [key]);

  return [value, dispatch, loaded, removeItem];
};
