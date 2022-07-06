import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const useStoredState = <T>(
  key: string,
  defaultValue?: T
): [T | undefined, (newValue: T) => void, boolean, () => void] => {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) readItem();
    return () => {
      isMounted = false;
    };
  }, []);

  const readItem = async () => {
    const item = await AsyncStorage.getItem(key);
    setValue(item ? JSON.parse(item) : defaultValue);
    setLoaded(true);
  };

  const writeItem = (newValue: T) => {
    setValue(newValue);
    AsyncStorage.setItem(key, JSON.stringify(newValue));
  };

  const removeItem = () => AsyncStorage.removeItem(key);

  return [value, writeItem, loaded, removeItem];
};

export default useStoredState;
