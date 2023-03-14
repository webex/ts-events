# typescript-events

A library for subscribing to and emitting type-safe events using a familiar, javascript-style API:

```typescript
myClass.on('eventName', (value: number) { ... });
// Error: handler signature is wrong
myClass.on('eventName', (value: boolean) { ... });
// Error: event name is wrong
myClass.on('eventNameWithATypo', (value: number) { ... });
```

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

An additional downside of the above libraries is that, since they involve inheriting from the `EventEmitter` class, the `emit` method was
exposed as part of the class' API; we'd like to be able to prevent outside entities from emitting a class' events.

When developing this library, we had the following requirements:
1. As much type safety as possible should be provided.  Referring to an invalid event name or passing a handler whose signature doesn't match 
should fail at compile time.
1. Class hierarchies should allow classes at each level to add events that make sense for them.
1. We want to preserve the 'familiar' event subscription API: `class.on('eventName', <handler>)`.
1. We don't want to have to manually implement the event subscription API on each class (minimize the need for boilerplate code).
1. Classes should have the flexibility to decide whether or not a subclass can emit their events.

The implementation of this library accomplishes the above requirements, but not without tradeoffs.  A summary of what is required to
use this library can be found below.

# Methodology

This library implements the behaviors described above via the use of a [mixin](https://www.typescriptlang.org/docs/handbook/mixins.html) and a helper type.

The mixin defines the event subscription APIs (`on`, `off`, `once`, etc.) and is generic around a type defining the event names and their handler signatures.  This is
what provides the type safety when calling the event subscription methods.
The helper type helps make sure the resulting type (after adding the mixin) is defined as a _type_ not a _value_, such that it can be used just like a normal
class.

Given a class:
```typescript
interface ParentEvents {
  eventOne: TypedEvent<(value: number) => void>;
}

class _Parent {
    protected eventOne = new TypedEvent<(value: number) => void>();    
}
```

***NOTE***: The property names between the events definition (`ParentEvents`) and the class (`_Parent`) ***must*** match.  I.e. it needs to be `eventOne` in both places.

The type that should be exposed can be generated like so:
```typescript
// Create and export the mixin type by adding the event subscription APIs
export const Parent = AddEvents<typeof _Parent, ParentEvents(_Parent);

// Export it as a type as well, to avoid "'Parent' refers to a value, but is being used as a type".
export const Parent = _Parent & WithEventsDummyType(ParentEvents);
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

# Development 
## Setup

1. Run `yarn` to install dependencies.
2. Run `yarn prepare` to prepare dependencies.
3. Run `yarn watch` to build and watch for updates.
4. Run `yarn test` to build, run tests, lint, and run test coverage.
