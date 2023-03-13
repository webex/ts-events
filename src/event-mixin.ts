/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypedEvent } from './typed-event';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type Constructor = new (...args: any[]) => {};

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
  };
}
