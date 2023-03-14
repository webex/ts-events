/* eslint-disable jsdoc/require-jsdoc */
import { AddEvents, WithEventsDummyType } from 'event-mixin';
import { TypedEvent } from 'typed-event';
import { Child } from './child';

export type EventFour = {
  field: number;
};

interface GrandchildEvents {
  eventFour: TypedEvent<(ev: EventFour) => void>;
}

class _Grandchild extends Child {
  protected eventFour = new TypedEvent<(value: EventFour) => void>();

  fireEventFour() {
    this.eventFour.emit({
      field: 42,
    });
  }
}

export const Grandchild = AddEvents<typeof _Grandchild, GrandchildEvents>(_Grandchild);

export type Grandchild = _Grandchild & WithEventsDummyType<GrandchildEvents>;
