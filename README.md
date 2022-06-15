# react-native-use-stored-state

State hook for react-native and react-native-web that allows easy usage of state that is persisted. It is a wrapper of `@react-native-async-storage/async-storage` which makes it easier to deal with objects and loading states.


Installation:

```
yarn add react-native-use-stored-state
```

Usage:

```javascript
const MyComponent = () => {
  const [myName, setMyName, myNameIsLoaded, unsetName] = useStoredState('NAME_KEY_FOR_ASYNC_STORAGE');
  const [myState, setMyState, myStateIsLoaded, unsetMyState] = useStoredState('MY_STATE_KEY_FOR_ASYNC_STORAGE', {
    active: false,
  });

  if (!myNameIsLoaded || !myStateIsLoaded) {
    return <Loading />;
  }

  const onNameChange = (name) => {
    setMyName(name);
  };

  const onStateChange = (key, value) => {
    setMyState({
      ...myState,
      [key]: value,
    });
  };

  const onClear = () => {
    unsetName();
    unsetMyState();
  };

  return (
    <Container>
      <Input value={myName} onChange={onNameChange} />
      <Input value={myState.age} onChange={(value) => onStateChange('age', value)} />
      <Checkbox value={myState.active} onChange={(value) => onStateChange('active', value)} />
      <Button onPress={onClear}>Clear</Button>
    </Container>
  );
}
```

this in typescript would be:

```typescript
interface MyState {
  active: boolean;
  age?: number;
}

const MyComponent = (): ReactElement => {
  const [myName, setMyName, myNameIsLoaded] = useStoredState<String>('NAME_KEY_FOR_ASYNC_STORAGE');
  const [myState, setMyState, myStateIsLoaded] = useStoredState<MyState>('MY_STATE_KEY_FOR_ASYNC_STORAGE', {
    active: false,
  });

  if (!myNameIsLoaded || !myStateIsLoaded) {
    return <Loading />;
  }

  const onNameChange = (name: string) => {
    setMyName(name);
  };

  const onStateChange = <K extends keyof MyState>(key: K, value: MyState[K]) => {
    setMyState({
      ...myState,
      [key]: value,
    });
  };

  const onClear = () => {
    unsetName();
    unsetMyState();
  };

  return (
    <Container>
      <Input value={myName} onChange={onNameChange} />
      <Input value={myState.age} onChange={(value: string) => onStateChange('age', Number(value))} />
      <Checkbox value={myState.active} onChange={(value: boolean) => onStateChange('active', value)} />
      <Button onPress={onClear}>Clear</Button>
    </Container>
  );
};
```
