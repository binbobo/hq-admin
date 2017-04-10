import { Injectable } from '@angular/core';
import { Urls, HttpService } from 'app/shared/services';
import { PagedParams, PagedResult, BasicService, BasicModel } from 'app/shared/models';

@Injectable()
export class UsualLogService implements BasicService<UsualLog> {

  create(body: UsualLog): Promise<UsualLog> {
    throw new Error('Method not implemented.');
  }
  update(body: UsualLog): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: UsualLog): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) { }

  public getPagedList(params: UsualLogListRequest): Promise<PagedResult<UsualLog>> {
    let url = Urls.logging.concat('/normallogs?', params.serialize());
    return this.httpService.get<PagedResult<UsualLog>>(url);
  }

  public get(id: string): Promise<UsualLog> {
    let url = Urls.logging.concat('/normallogs/', id);
    return this.httpService.get<UsualLog>(url);
  }
}

export class UsualLog extends BasicModel {
  constructor(
    logLevel: string,
    message: string,
    exceptionMessage: string,
    applicationName: string,
    timestamp: Date,
    environmentName: string,
    stackTrace: string,
    sessionId: string,
    sourceName: string
  ) { super(); }
}

export class UsualLogListRequest extends PagedParams {
  constructor(
  ) {
    super('UsualLogListRequestParams');
  }
}