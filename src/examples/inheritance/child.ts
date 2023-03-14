/* eslint-disable jsdoc/require-jsdoc */
import { AddEvents, WithEventsDummyType } from 'event-mixin';
import { TypedEvent } from '../../typed-event';
import { Parent } from './parent';

interface ChildEvents {
  eventThree: TypedEvent<(value: string) => void>;
}

class _Child extends Parent {
  protected eventThree = new TypedEvent<(value: string) => void>();

  fireEventThree() {
    this.eventThree.emit('hello, world');
  }
}

export const Child = AddEvents<typeof _Child, ChildEvents>(_Child);

export type Child = _Child & WithEventsDummyType<ChildEvents>;
