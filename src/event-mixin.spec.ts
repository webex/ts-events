/* eslint-disable max-classes-per-file */
/* eslint-disable jsdoc/require-jsdoc */
import { AddEvents } from './event-mixin';
import { TypedEvent } from './typed-event';

interface ParentEvents {
  eventOne: TypedEvent<(value: number) => void>;
  eventTwo: TypedEvent<(value: boolean) => void>;
}

class _Parent {
  protected eventOne = new TypedEvent<(value: number) => void>();

  protected eventTwo = new TypedEvent<(value: boolean) => void>();

  fireEventOne() {
    this.eventOne.emit(42);
  }

  fireEventTwo() {
    this.eventTwo.emit(true);
  }
}

const Parent = AddEvents<typeof _Parent, ParentEvents>(_Parent);

describe('a class with events', () => {
  const myClass = new Parent();
  it('should notify handlers when events are fired', () => {
    expect.hasAssertions();
    const handlerOneArgs: number[] = [];
    myClass.on('eventOne', (value: number) => {
      handlerOneArgs.push(value);
    });
    const handlerTwoArgs: number[] = [];
    myClass.on('eventOne', (value: number) => {
      handlerTwoArgs.push(value);
    });
    myClass.fireEventOne();
    expect(handlerOneArgs).toHaveLength(1);
    expect(handlerOneArgs[0]).toBe(42);
    expect(handlerTwoArgs).toHaveLength(1);
    expect(handlerTwoArgs[0]).toBe(42);
  });
});

interface ChildEvents {
  eventThree: TypedEvent<(value: string) => void>;
}

class _Child extends Parent {
  protected eventThree = new TypedEvent<(value: string) => void>();

  fireEventThree() {
    this.eventThree.emit('hello, world');
  }
}

const Child = AddEvents<typeof _Child, ChildEvents>(_Child);

describe('a child class', () => {
  const myClass = new Child();
  it('should be able to subscribe to parent or child events', () => {
    expect.hasAssertions();

    const eventOneArgs: number[] = [];
    myClass.on('eventOne', (value: number) => eventOneArgs.push(value));

    const eventThreeArgs: string[] = [];
    myClass.on('eventThree', (value: string) => eventThreeArgs.push(value));

    myClass.fireEventOne();
    myClass.fireEventThree();

    expect(eventOneArgs).toHaveLength(1);
    expect(eventThreeArgs).toHaveLength(1);
  });
});

interface NestedEvents {
  eventOne: TypedEvent<(value: number) => void>;
  eventTwo: TypedEvent<(value: boolean) => void>;
}

interface InvalidPathEvents {
  eventOne: TypedEvent<(value: number) => void>;
}
class _Nested {
  eventContainer = {
    deeper: {
      eventOne: new TypedEvent<(value: number) => void>(),
      eventTwo: new TypedEvent<(value: boolean) => void>(),
    },
  };

  fireEventOne() {
    this.eventContainer.deeper.eventOne.emit(42);
  }

  fireEventTwo() {
    this.eventContainer.deeper.eventTwo.emit(true);
  }
}

const Nested = AddEvents<typeof _Nested, NestedEvents>(_Nested, 'eventContainer.deeper');
const InvalidPath = AddEvents<typeof _Nested, InvalidPathEvents>(_Nested, 'eventContainer.unknown');

describe('a nested class with path', () => {
  const myClass = new Nested();
  it('should notify handlers when nested events are fired', () => {
    expect.hasAssertions();
    const handlerOneArgs: number[] = [];
    const handlerTwoArgs: boolean[] = [];

    myClass.on('eventOne', (value: number) => handlerOneArgs.push(value));
    myClass.on('eventTwo', (value: boolean) => handlerTwoArgs.push(value));

    myClass.fireEventOne();
    myClass.fireEventTwo();

    expect(handlerOneArgs).toStrictEqual([42]);

    expect(handlerTwoArgs).toStrictEqual([true]);
  });

  it('should throw an error when trying to subscribe to an event with an invalid path', () => {
    expect.hasAssertions();

    const instance = new InvalidPath();

    // Trying to bind an event handler to an invalid path
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      instance.on('eventOne', () => {});
    }).toThrow(new Error('Event "eventContainer.unknown.eventOne" is not defined'));
  });
});
