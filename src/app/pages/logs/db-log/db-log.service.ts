import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedResult, PagedParams, BasicService, BasicModel } from 'app/shared/models';

@Injectable()
export class DbLogService implements BasicService<DbLog> {

  create(body: DbLog): Promise<DbLog> {
    throw new Error('Method not implemented.');
  }
  update(body: DbLog): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: DbLog): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  constructor(
    private httpService: HttpService
  ) { }

  public getPagedList(params: DbLogListRequest): Promise<PagedResult<DbLog>> {
    const url = Urls.logging.concat('/dblogs?', params.serialize());
    return this.httpService.get<PagedResult<DbLog>>(url);
  }

  public get(id: string): Promise<DbLog> {
    let url = Urls.logging.concat('/dblogs/', id);
    return this.httpService.get<DbLog>(url);
  }
}

export class DbLog extends BasicModel {
  constructor(
    commandText: string,
    databaseName: string,
    logLevel: string,
    environmentName: string,
    takeTime: number,
    applicationName: string,
    timestamp: Date,
    result: string,
    sessionId: string,
    sourceName: string
  ) { super(); }
}

export class DbLogListRequest extends PagedParams {
  constructor(
  ) {
    super('DbLogListRequestParams');
  }
}