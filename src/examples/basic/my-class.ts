/* eslint-disable jsdoc/require-jsdoc */
import { AddEvents, WithEventsDummyType } from '../../event-mixin';
import { TypedEvent } from '../../typed-event';

interface MyClassEvents {
  eventOne: TypedEvent<(value: number) => void>;
  eventTwo: TypedEvent<(value: boolean) => void>;
}

class _MyClass {
  protected eventOne = new TypedEvent<(value: number) => void>();

  protected eventTwo = new TypedEvent<(value: boolean) => void>();

  fireEventOne() {
    this.eventOne.emit(42);
  }

  fireEventTwo() {
    this.eventTwo.emit(true);
  }
}

export const MyClass = AddEvents<typeof _MyClass, MyClassEvents>(_MyClass);
// Do this to workaround errors for 'MyClass' refers to a value but is
// being used as a type.
export type MyClass = _MyClass & WithEventsDummyType<MyClassEvents>;
