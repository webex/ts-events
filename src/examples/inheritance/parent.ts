/* eslint-disable jsdoc/require-jsdoc */
import { AddEvents, WithEventsDummyType } from '../../event-mixin';
import { TypedEvent } from '../../typed-event';

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

export const Parent = AddEvents<typeof _Parent, ParentEvents>(_Parent);

export type Parent = _Parent & WithEventsDummyType<ParentEvents>;
