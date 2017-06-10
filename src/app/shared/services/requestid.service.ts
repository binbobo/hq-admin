import { Injectable } from '@angular/core';
import { EventDispatcher } from "./event-dispatcher.service";

@Injectable()
export class RequestIdService {
  constructor(private dispatcher: EventDispatcher) { }

  public refesh() {
    let requestId = this.generateId();
    this.dispatcher.emit('RequestIdChanged', requestId);
  }

  private generateId(l?: number): string {
    if (!l) {
      l = 4;
    }

    let uuid = [];

    for (let i = 0; i < l; i++) {
      uuid.push(this.randomString());
    }

    return uuid.join('-');
  }

  private randomString() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }


}
