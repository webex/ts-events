# typescript-events

A library for subscribing to and emitting type-safe events.

### Why does this library exist?

There exist multiple typesafe event emitter libraries for typescript (we were previously using [this one](https://github.com/andywer/typed-emitter) and
also tried [this one](https://github.com/binier/tiny-typed-emitter)), so why is this library necessary? 

When using 
existing solutions, we were unable to implement an event 'hierarchy': where a class inheritance chain could have
each class defining appropriate events for their level.  Some links to issues others have had around this can
be found [here](https://github.com/binier/tiny-typed-emitter/issues/6#ref-commit-1a5053b), and [here](https://stackoverflow.com/a/71272663/612493).
Playgrounds with our own attempts to make the above libraries work can be found below:

1. An attempt still using EventEmitter from typed-emitter, but adding generics to allow subclasses to add events: [Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAFQJ5gKYBMCiJgxqqAGjgG85MA3VAOxgFkBDMOAXzgDMoIQ4ByGFBgC0qHHgK8A3AChQkWKXJVa2XPihwGAZ3KZWHLj16plMLVOnSAxgBttOyjRirxUADwI4qAB75q6B1NGMAA+L18aALgACkw9bUVpOGS4alQAdzgPTx8-KMdaYJDogEoALkRBLDF1bJCZFhKPEJIWSwB6drgABQYoJ2kBNER0iAL4AF5SJJT2YFQbdArqAFcQACMCaTbZWgJ2BitUHr6ncZ1cyMCnYOmUuABtY1MAeTTeAF0K6JMnZbXNlASnAJmEKBBgOgZPcnr9aAhRp9vnCYBUEWNTMDQXBwZDth0ugB1Y5pDBwGAQOArLTHBhwADmNAIwCscAAFgRUMQKXAtCswPJ4HSrGzgIs4LZ7OE8sBqPSTv0VKYdDyGOh0HBcDoIOlqF5lQA6ax2LQ6XqKmAAYRNWg80quCrOyrCl381xUNQIzTuHGA-XGb1QpR9yU6cAAkvB0BBUFpqPxeahjrwACwAJl4mh0dJADBgIvZnKN9xgoq0BtEuGizycgd4xHTJUk93uMzaOxoazgltFi3GADkGCBYyGlE50SC+Cj0bx8bt1Acjt3e1hlfa3WPCkxRw8e2LV05B8Py+N0V8YhQGDYVqh-hsCFiwRD0NsgA)
1. A slightly different approach using the tiny-typed-emitter lib: [Playground](https://www.typescriptlang.org/play?ssl=28&ssc=1&pln=28&pc=2#code/JYWwDg9gTgLgBAFQJ5gKYBMCiJgxqqAGjgG85MA3VAOxgFkBDMOAXzgDMoIQ4ByGFBgC0qHHgK8A3AChQkWKXJVa2XPihwGAZ3KZWHLj16plMLVOnSAxgBttOyjRirxUADwI4qAB75q6B1NGMAA+L18aALgACkw9bUVpOGS4alQAdzgPTx8-KMdaYJDogEoALkRBLDF1bJCZFhKPEJIWSwB6drgASWotMGAoDDgAIyQ4GGBqJCEBNHQRGoIy6U64AAs8MC0yzoBzXHWAVxGAOitudpGp4AJ2yenZqsW1O5GbCBH2kG11dptgF8pugfKd0KczABiAAyAEZpHNUHBocAtH4CABlYB7agMGBHIZuaFhAC8iRScAA2nopnAANaoJAQdjIgC6FWipy5DCgex2cCO1Dp1Ag6WolNZJTgJLCguFouokjg0jaqy6AAUeU5LDQjjxNUMVKYAHIMECoHQkJIpAowADyaWlfBMTiEEDSvBVlim6nYDCsSINTltAGEGDYbCN-XTLdbkpSg0anKbzVpTraHah2TEKOGjqgKtQ9SMCFKZXAKBBgOgvdY7FodImYCH61oPOE8joUWiaJjsbj8YSECESd30VAsTi8QTUG45SKxSEwrlIoFg0t3E3Q+HI9GdAAyRBhMjKinsQaoDNpUqkOMUibrVGnUS4aJbk1mi3p0yZ4gAFgAJhKGQKTaFggA)

An additional downside of the above libraries is that, since they involve inherting from the `EventEmitter` class, the `emit` method was
exposed as part of the class' API; we'd like to be able to prevent outside entities from emitting a class' events.

When developing this library, we had the following requirements:
1. As much type safety as possible should be provided.  Referring to an invalid event name or passing a handler whose signature doesn't match 
should fail at compile time.
1. Class hierarchies should allow classes at each level to add events that make sense for them..
1. We want to preserve the 'familiar' event subscription API: `class.on('eventName', <handler>)`.
1. We don't want to have to manually implement the event subscription API on each class (minimize the need for boilerplate code).
1. Classes should have the flexibility to decide whether or not a subclass can emit their events.

The implementation of this library accomplishes the above requirements, but not without tradeoffs.  A summary of what is required to
use this library can be found below.

# Methodology

This library implements the behaviors described above via a [mixin](https://www.typescriptlang.org/docs/handbook/mixins.html) that looks like this
(shortened here for the sake of illustration.  See [event-mixin.ts](src/event-mixin.ts) for the full file):

```typescript
/**
 * A mixin which will add event subscription methods to the given Base type.
 * This is done by returning a new class which extends the given class and has the event
 * subscription methods added.
 *
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
    <snip>
  }
}
```

Given a class:
```typescript
interface ParentEvents {
  eventOne: TypedEvent<(value: number) => void>;
}

class _Parent {
    protected eventOne = new TypedEvent<(value: number) => void>();    
}
```

The type that should be exposed can be generated like so:
```typescript
export const Parent = AddEvents<typeof _Parent, ParentEvents(_Parent);
```
This type (`Parent`) is what should be exported and used by other code (_not_ `_Parent`).


## FAQ
##### _Rather than requiring constraints on the type `U` in AddEvents via documentation, why not express them in the type system?_

This was attempted.  We originally borrowed a type defined in the EventEmitter libraries above, like so:

```typescript
type EventMap = {
  [key: string]: (...args: any[]) => void
}
```
Which could enforce that the events type always had keys that were strings and values which were functions. But unfortunately this will allow undefined event names to be passed without an error.  A playground illustrating this issue can be found [here](https://www.typescriptlang.org/play?ssl=19&ssc=1&pln=20&pc=1#code/C4TwDgpgBAwg9gOwM7AE4FcDGw6qgXigQgHcoAKAOmoENUBzJALihoRAG0BdASgID4oAbwC+AbgBQoSFAASbACYAbCHkJVaDZq3bc++QQDc4ASwWTp0AKKGICYAFkaYAsIlQPUDgGsIIFiioJgj0XCzyCMqqEiISEsHAqgBmNJjWtvZIUBAAHomRWTZ2js5unkQ0ALYQLOQIVTVQgcH0+kamCgA07p409I3kfY0I6JUARqptUMZmMXFJ6AjYJohQAOomwAAWRZkAPAAqAEI0SNC5+QpZ8MhoWDionVAAqtl5dldQuyVg-OQnZxYx1OED4Qh6HlQEGA6FQCCgmCUpyyG223yyFw+WQB0HB5XKiD2AGk3pcsr4QHAki8ngdSViXhwiVw-hSWESnltFCpUECwbFyrFYhJEcioAB9AAKqiQqzxnnq1QCaBargARGM1ZJykMWCNxqpXAAWABMYnKEKgcxFiBQUGlqFl8MIqJ2GWASD2lipEodTqe6L+UpliB4khttygkEdq0IxDIfsQ5DDEmjTsoSYA5ENM09yIYaEp0MNRhNUFNRCmAPRVqAHLYmLJILZwdBKBRQCY6bKoVC4J5jdDAKCNhCZ4eYGjoehbYCpkMIDMIciZpJwOC5igVkRhoA).  This is something I'd
love to improve, so would be happy to learn of a solution here.

# Examples


# Development 
## Setup

1. Run `yarn` to install dependencies.
2. Run `yarn prepare` to prepare dependencies.
3. Run `yarn watch` to build and watch for updates.
4. Run `yarn test` to build, run tests, lint, and run test coverage.
