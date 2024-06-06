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

  it('should remove all handlers when removeAllListeners is called', () => {
    expect.hasAssertions();
    const handlerOneArgs: number[] = [];
    const handler = (value: number) => {
      handlerOneArgs.push(value);
    };
    myClass.on('eventOne', handler);
    myClass.fireEventOne();
    expect(handlerOneArgs).toHaveLength(1);
    expect(handlerOneArgs[0]).toBe(42);

    myClass.removeAllListeners();
    myClass.fireEventOne();
    expect(handlerOneArgs).toHaveLength(1); // Should still be 1, as all listeners should be removed
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

  it('should remove all handlers from parent and child when removeAllListeners is called', () => {
    expect.hasAssertions();

    const eventOneArgs: number[] = [];
    const eventThreeArgs: string[] = [];

    myClass.on('eventOne', (value: number) => eventOneArgs.push(value));
    myClass.on('eventThree', (value: string) => eventThreeArgs.push(value));

    myClass.removeAllListeners();

    myClass.fireEventOne();
    myClass.fireEventThree();

    expect(eventOneArgs).toHaveLength(0); // Should be 0, as all listeners should be removed
    expect(eventThreeArgs).toHaveLength(0); // Should be 0, as all listeners should be removed
  });
});
