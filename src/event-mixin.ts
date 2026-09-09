/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypedEvent } from './typed-event';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type Constructor = (new (...args: any[]) => {}) | (abstract new (...args: any[]) => {});

// Extract the 'Handler' type from the given TypedEvent
type eventHandlerType<Type> = Type extends TypedEvent<infer X> ? X : never;

/**
 * A mixin which will add event subscription methods to the given Base type.
 * This is done by returning a new class which extends the given class and has the event
 * subscription methods added.
 *
 * TODO: can we improve/enforce the below requirement on TBase?
 * 'TBase' can be any class. Note that it _must_ have members of type 'TypedEvent', whose
 * names match the even names defined in type 'U'.  These members can have any
 * visibility (public, private, protected).
 *
 * 'U' must be an object where:
 *     - The key names are strings which correspond to the event names.
 *     - The values are of typed 'TypedEvent'.
 *
 * @param Base - The class which will be extended with event subscription methods.
 * @returns A subclass of Base with event subscription methods added.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function AddEvents<TBase extends Constructor, U>(Base: TBase) {
  // eslint-disable-next-line jsdoc/require-jsdoc
  return class WithEvents extends Base {
    /**
     * Invoke the given handler when the event with the given name is fired.
     *
     * @param eventName - The name of the event to subscribe to.
     * @param handler - The handler to invoke when the event is fired.
     */
    on<K extends keyof U, E extends eventHandlerType<U[K]>>(eventName: K, handler: E) {
      // Even though we bypass type safety in the call (casting this as any), we've enforced it in the
      // method signature above, so it's still safe.
      (this as any)[eventName].on(handler);
    }

    /**
     * Add an event handler to be invoked only the next time the given event is emitted.
     *
     * @template K Extends keyof U - The event name type.
     * @template E Extends eventHandlerType<U[K]> - The handler type.
     * @param eventName - The event name.
     * @param handler - The handler.
     */
    once<K extends keyof U, E extends eventHandlerType<U[K]>>(eventName: K, handler: E) {
      (this as any)[eventName].once(handler);
    }

    /**
     * Remote the given event handler from the given event.
     *
     * @template K Extends keyof U - The event name type.
     * @template E Extends eventHandlerType<U[K]> - The handler type.
     * @param eventName - The event name.
     * @param handler - The handler.
     */
    off<K extends keyof U, E extends eventHandlerType<U[K]>>(eventName: K, handler: E) {
      (this as any)[eventName].off(handler);
    }

    /**
     * Remove all event listeners from all events.
     */
    removeAllListeners() {
      /**
       * Recursively remove all listeners from the given object and its prototype chain. This is
       * necessary because the events may be defined on the prototype chain.
       *
       * @param obj - The object to remove listeners from.
       */
      function removeListeners(obj: any) {
        if (!obj || obj === Object.prototype) {
          return;
        }
        Object.keys(obj).forEach((eventName) => {
          const event = obj[eventName];
          if (event instanceof TypedEvent) {
            event.removeAllListeners();
          }
        });
        removeListeners(Object.getPrototypeOf(obj));
      }
      removeListeners(this);
    }
  };
}

/**
 * A helper type to ensure the export is seen as a type and not just a value.
 */
export type WithEventsDummyType<U> = {
  on<K extends keyof U, E extends eventHandlerType<U[K]>>(eventName: K, handler: E): void;
  once<K extends keyof U, E extends eventHandlerType<U[K]>>(eventName: K, handler: E): void;
  off<K extends keyof U, E extends eventHandlerType<U[K]>>(eventName: K, handler: E): void;
};
