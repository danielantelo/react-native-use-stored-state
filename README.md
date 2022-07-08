# react-native-use-stored-state

State hook for react-native and react-native-web that allows easy usage of state that is persisted. It is a wrapper of `@react-native-async-storage/async-storage` which makes it easier to deal with objects and loading states.


Installation:

```
yarn add react-native-use-stored-state
```

Usage:

```javascript
const reducer = (prevState, action) => {
  switch (action.type) {
    case 'age':
      return {...prevState, active: action.payload.age };
  }
}

const MyComponent = () => {
  const [myName, setMyName, myNameIsLoaded, unsetName] = useStoredState('NAME_KEY_FOR_ASYNC_STORAGE');
  const [myState, dispatch, myStateIsLoaded, unsetMyState] = useStoredReducer('MY_STATE_KEY_FOR_ASYNC_STORAGE', reducer, {
    active: false,
  });

  if (!myNameIsLoaded || !myStateIsLoaded) {
    return <Loading />;
  }

  const onNameChange = (name) => {
    setMyName(name);
  };

  const onStateChange = (key, value) => {
    dispatch({
      type: 'abc',
      payload: {
        [key]: value,
      }
    });
  };

  const onClear = () => {
    unsetName();
    unsetMyState();
  };

  return (
    <Container>
      <Input value={myName} onChange={onNameChange} />
      <Checkbox value={myState.active} onChange={(value) => onStateChange('active', value)} />
      <Input value={myState.age} onChange={(value) => onStateChange('age', value)} />
       <Input value={myState.year} onChange={(value) => onStateChange('year', value)} />
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

const ReducerAction = 'age' | 'year';

const reducer = (prevState: MyState, action: ReducerAction): MyState => {
  switch (action.type) {
    case 'age':
      return {...prevState, active: action.payload.age };
  }
}

const MyComponent = (): ReactElement => {
  const [myName, setMyName, myNameIsLoaded] = useStoredState<string>('NAME_KEY_FOR_ASYNC_STORAGE');
  const [myState, setMyState, myStateIsLoaded] = useStoredReducer<MyState, ReducerAction>('MY_STATE_KEY_FOR_ASYNC_STORAGE', reducer, {
    active: false,
  });

  if (!myNameIsLoaded || !myStateIsLoaded) {
    return <Loading />;
  }

  const onNameChange = (name: string) => {
    setMyName(name);
  };

  const onStateChange = <K extends keyof MyState>(key: K, value: MyState[K]) => {
    dispatch({
      type: 'abc',
      payload: {
        [key]: value,
      }
    });
  };

  const onClear = () => {
    unsetName();
    unsetMyState();
  };

  return (
    <Container>
      <Input value={myName} onChange={onNameChange} />
      <Checkbox value={myState.active} onChange={(value) => onStateChange('active', value)} />
      <Input value={myState.age} onChange={(value) => onStateChange('age', value)} />
       <Input value={myState.year} onChange={(value) => onStateChange('year', value)} />
      <Button onPress={onClear}>Clear</Button>
    </Container>
  );
};
```

