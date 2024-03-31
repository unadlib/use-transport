import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import {
  mockPorts,
  type Transport as ITransport,
  Reverse,
  createTransport,
} from 'data-transport';

import { useTransport, type Transport } from '../src/index';

test('Base', async () => {
  const ports = mockPorts();
  type Interaction = {
    listen: {
      foo: (value: number) => Promise<number>;
    };
    emit: {
      bar: (value: number) => Promise<void>;
    };
  };
  const transport0: ITransport<Reverse<Interaction>> = createTransport(
    'Base',
    ports.create()
  );
  const fn0 = jest.fn();
  transport0.listen('bar', async (value) => {
    fn0(value);
  });
  const fn1 = jest.fn();
  const { result, unmount } = renderHook(() => {
    const [state, setState] = useState(0);
    const transport: Transport<Interaction> = useTransport('Base', ports.main);
    transport.listen(
      'foo',
      async (value) => {
        const nextState = value + state;
        setState(nextState);
        fn1(value);
        return nextState;
      },
      [state]
    );
    return {
      state,
      setState,
      transport,
    };
  });
  expect(result.current.state).toEqual(0);

  act(() => {
    result.current.transport.emit('bar', 1);
  });
  expect(result.current.state).toEqual(0);
  expect(fn0).toHaveBeenLastCalledWith(1);

  let fooResult = await act(async () => {
    return transport0.emit('foo', 1);
  });
  expect(result.current.state).toEqual(1);
  expect(fn0).toHaveBeenLastCalledWith(1);
  expect(fooResult).toEqual(1);

  fooResult = await act(async () => {
    return transport0.emit('foo', 2);
  });
  expect(result.current.state).toEqual(3);
  expect(fn0).toHaveBeenLastCalledWith(1);
  expect(fooResult).toEqual(3);

  fooResult = await act(async () => {
    return transport0.emit('foo', 3);
  });
  expect(result.current.state).toEqual(6);
  expect(fn0).toHaveBeenLastCalledWith(1);
  expect(fn0).toHaveBeenCalledTimes(1);
  expect(fn1).toHaveBeenCalledTimes(3);
  expect(fooResult).toEqual(6);

  act(() => {
    result.current.transport.emit('bar', 2);
  });
  expect(result.current.state).toEqual(6);
  expect(fn0).toHaveBeenLastCalledWith(2);
  expect(fn0).toHaveBeenCalledTimes(2);
  expect(fn1).toHaveBeenCalledTimes(3);

  act(() => {
    unmount();
  });

  act(() => {
    transport0.emit('foo', 2);
  });
  expect(result.current.state).toEqual(6);
  expect(fn0).toHaveBeenLastCalledWith(2);
  expect(fn0).toHaveBeenCalledTimes(2);
  expect(fn1).toHaveBeenCalledTimes(3);
});
