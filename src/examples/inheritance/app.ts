/* eslint-disable class-methods-use-this */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { EventFour, Grandchild } from './grandchild';

class Application {
  grandchild: Grandchild;

  constructor(grandchild: Grandchild) {
    this.grandchild = grandchild;

    this.grandchild.on('eventOne', (value: number) => this.handleEventOne(value));
    this.grandchild.on('eventTwo', (value: boolean) => this.handleEventTwo(value));
    this.grandchild.on('eventThree', (value: string) => this.handleEventThree(value));
    this.grandchild.on('eventFour', (value: EventFour) => this.handleEventFour(value));
  }

  protected handleEventOne(value: number) {
    console.log(`got event one: ${value}`);
  }

  protected handleEventTwo(value: boolean) {
    console.log(`got event two: ${value}`);
  }

  protected handleEventThree(value: string) {
    console.log(`got event three: ${value}`);
  }

  protected handleEventFour(value: EventFour) {
    console.log(`got event four: ${value}`);
  }
}

const mc = new Grandchild();

const app = new Application(mc);

mc.fireEventOne();
