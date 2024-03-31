import { useEffect, useRef } from 'react';
import {
  type Transport as ITransport,
  type BaseInteraction,
  createTransport,
  type TransportMap,
  type TransportOptionsMap,
  type Reverse as IReverse,
} from 'data-transport';

export type Reverse<T extends BaseInteraction> = IReverse<T>;

export type Transport<T extends BaseInteraction = any> = ITransport<T> & {
  /**
   * Listen for an event and invoke the callback when it is emitted.
   */
  listen: <K extends keyof T['listen']>(
    /**
     * The name of the event to listen for.
     */
    name: K,
    /**
     * The callback to invoke when the event is emitted.
     */
    fn: T['listen'][K],
    /**
     * The dependencies to watch for changes and re-invoke the callback.
     */
    deps?: any[]
  ) => void;
};

/**
 * Create a transport instance with the given name and options.
 */
export const useTransport = <T extends keyof typeof TransportMap>(
  name: T,
  options: TransportOptionsMap[T]
) => {
  const transportRef = useRef<ITransport | null>(null);
  if (!transportRef.current) {
    transportRef.current = createTransport(name, options);
    const { listen } = transportRef.current;
    transportRef.current.listen = ((
      options,
      callback: (...args: unknown[]) => unknown,
      deps: unknown[] = []
    ) => {
      const listenerRef = useRef<((...args: unknown[]) => unknown) | null>(
        null
      );
      useEffect(() => {
        listenerRef.current = callback;
      }, deps);
      useEffect(() => {
        const removeListener = listen.call(
          transportRef.current,
          options,
          (...args: unknown[]) => listenerRef.current?.(...args)
        );
        return () => {
          // Remove the listener when the component unmounts.
          removeListener?.();
        };
      }, []);
    }) as Transport['listen'];
  }
  useEffect(() => {
    return () => {
      // Dispose the transport instance when the component unmounts.
      transportRef.current?.dispose();
    };
  }, []);
  return transportRef.current as Transport;
};
