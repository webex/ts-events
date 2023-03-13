/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { MyClass } from './my-class';

class Application {
  myClass: MyClass;

  constructor(myClass: MyClass) {
    this.myClass = myClass;

    this.myClass.on('eventOne', (value: number) => this.handleEventOne(value));

  }

  protected handleEventOne(value: number) {
    console.log(`got event one: ${value}`);
  }
}
