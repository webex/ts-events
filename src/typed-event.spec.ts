/* eslint-disable jsdoc/require-jsdoc */
import { TypedEvent } from './typed-event';

describe('TypedEvent', () => {
  const event = new TypedEvent<(value: number) => void>();
  describe('on', () => {
    it('should notify a subscriber when firing', () => {
      expect.hasAssertions();

      const handlerArgs: number[] = [];
      event.on((value: number) => handlerArgs.push(value));
      event.emit(42);
      event.emit(43);
      event.emit(44);

      expect(handlerArgs).toHaveLength(3);
      expect(handlerArgs).toStrictEqual([42, 43, 44]);
    });
    it('should notify multiple subscribers', () => {
      expect.hasAssertions();

      const handlerOneArgs: number[] = [];
      event.on((value: number) => handlerOneArgs.push(value));
      const handlerTwoArgs: number[] = [];
      event.on((value: number) => handlerTwoArgs.push(value));
      event.emit(42);

      expect(handlerOneArgs).toHaveLength(1);
      expect(handlerOneArgs[0]).toBe(42);
      expect(handlerTwoArgs).toHaveLength(1);
      expect(handlerTwoArgs[0]).toBe(42);
    });
  });
  describe('once', () => {
    it('should notify subscribers only once', () => {
      expect.hasAssertions();

      const handlerArgs: number[] = [];
      event.once((value: number) => handlerArgs.push(value));
      event.emit(42);
      event.emit(43);

      expect(handlerArgs).toHaveLength(1);
      expect(handlerArgs[0]).toBe(42);
    });
  });
  describe('off', () => {
    it('should remove the given subscriber', () => {
      expect.hasAssertions();

      const handlerOneArgs: number[] = [];
      const handlerOne = (value: number) => handlerOneArgs.push(value);
      event.on(handlerOne);
      const handlerTwoArgs: number[] = [];
      const handlerTwo = (value: number) => handlerTwoArgs.push(value);
      event.on(handlerTwo);

      event.emit(42);
      event.off(handlerOne);
      event.emit(43);

      expect(handlerOneArgs).toHaveLength(1);
      expect(handlerTwoArgs).toHaveLength(2);
    });
  });
});
