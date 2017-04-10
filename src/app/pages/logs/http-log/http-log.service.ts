import { Injectable } from '@angular/core';
import { Urls, HttpService } from 'app/shared/services';
import { PagedParams, PagedResult, BasicService, BasicModel } from 'app/shared/models';

@Injectable()
export class HttpLogService implements BasicService<HttpLog> {

  create(body: HttpLog): Promise<HttpLog> {
    throw new Error('Method not implemented.');
  }
  update(body: HttpLog): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: HttpLog): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) { }

  public getPagedList(params: HttpLogListRequest): Promise<PagedResult<HttpLog>> {
    let url = Urls.logging.concat('/httplogs?', params.serialize());
    return this.httpService.get<PagedResult<HttpLog>>(url);
  }

  public get(id: string): Promise<HttpLog> {
    let url = Urls.logging.concat('/httplogs/', id);
    return this.httpService.get<HttpLog>(url);
  }
}

export class HttpLog extends BasicModel {
  constructor(
    requestUrl: string,
    endpoint: string,
    requestMethod: string,
    responseCode: number,
    takeTime: number,
    applicationName: string,
    environmentName: string,
    timestamp: Date,
    requestBody: string,
    requestHeaders: string,
    responseBody: string,
    responseHeaders: string,
    isFromCache: boolean,
    logLevel: string,
    sessionId: string,
    sourceName: string
  ) { super(); }
}

export class HttpLogListRequest extends PagedParams {
  constructor(
  ) {
    super('HttpLogListRequestParams');
  }
}
