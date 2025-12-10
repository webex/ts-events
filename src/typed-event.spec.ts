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

  describe('emitAsync', () => {
    it('should return a promise that resolves', async () => {
      expect.hasAssertions();

      const asyncEvent = new TypedEvent<(value: number) => void>();
      const handlerArgs: number[] = [];
      asyncEvent.on((value: number) => handlerArgs.push(value));

      await asyncEvent.emitAsync(42);

      expect(handlerArgs).toHaveLength(1);
      expect(handlerArgs[0]).toBe(42);
    });

    it('should wait for async handlers to complete', async () => {
      expect.hasAssertions();

      const asyncEvent = new TypedEvent<(value: number) => Promise<void>>();
      const executionOrder: string[] = [];

      asyncEvent.on(async (value: number) => {
        executionOrder.push('handler1-start');
        await new Promise((resolve) => setTimeout(resolve, 50));
        executionOrder.push(`handler1-end-${value}`);
      });

      asyncEvent.on(async (value: number) => {
        executionOrder.push('handler2-start');
        await new Promise((resolve) => setTimeout(resolve, 30));
        executionOrder.push(`handler2-end-${value}`);
      });

      executionOrder.push('before-emit');
      await asyncEvent.emitAsync(100);
      executionOrder.push('after-emit');

      expect(executionOrder).toStrictEqual([
        'before-emit',
        'handler1-start',
        'handler2-start',
        'handler2-end-100',
        'handler1-end-100',
        'after-emit',
      ]);
    });

    it('should handle multiple async handlers', async () => {
      expect.hasAssertions();

      const asyncEvent = new TypedEvent<(value: number) => Promise<number>>();
      const results: number[] = [];

      asyncEvent.on(async (value: number) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        results.push(value * 2);
        return value * 2;
      });

      asyncEvent.on(async (value: number) => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        results.push(value * 3);
        return value * 3;
      });

      asyncEvent.on(async (value: number) => {
        await new Promise((resolve) => setTimeout(resolve, 15));
        results.push(value * 4);
        return value * 4;
      });

      await asyncEvent.emitAsync(10);

      expect(results).toHaveLength(3);
      expect(results).toContain(20);
      expect(results).toContain(30);
      expect(results).toContain(40);
    });

    it('should handle synchronous handlers', async () => {
      expect.hasAssertions();

      const asyncEvent = new TypedEvent<(value: number) => void>();
      const handlerArgs: number[] = [];

      asyncEvent.on((value: number) => handlerArgs.push(value));
      asyncEvent.on((value: number) => handlerArgs.push(value * 2));

      await asyncEvent.emitAsync(5);

      expect(handlerArgs).toStrictEqual([5, 10]);
    });

    it('should handle mixed sync and async handlers', async () => {
      expect.hasAssertions();

      const asyncEvent = new TypedEvent<(value: number) => void | Promise<void>>();
      const results: string[] = [];

      asyncEvent.on((value: number) => {
        results.push(`sync-${value}`);
      });

      asyncEvent.on(async (value: number) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        results.push(`async-${value}`);
      });

      asyncEvent.on((value: number) => {
        results.push(`sync2-${value}`);
      });

      await asyncEvent.emitAsync(7);

      expect(results).toHaveLength(3);
      expect(results).toContain('sync-7');
      expect(results).toContain('async-7');
      expect(results).toContain('sync2-7');
    });
  });
});
