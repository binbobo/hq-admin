import { Injectable } from '@angular/core';
import { EventDispatcher } from "./event-dispatcher.service";

@Injectable()
export class RequestIdService {

  constructor(private dispatcher: EventDispatcher) { }

  public refesh() {
    let requestId = this.generateId();
    this.dispatcher.emit('RequestIdChanged', requestId);
  }
  private generateId():string {
    // let requestId = new Date().getTime().toString();
    let id = this.generateRandom(1,10000);
    return id;
  }

  private generateRandom(m,n){
    return m + Math.floor(Math.random() * (n - m + 1));
  }

}
