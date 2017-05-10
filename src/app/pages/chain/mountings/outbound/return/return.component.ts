import { Component, OnInit } from '@angular/core';
import { TypeaheadRequestParams } from 'app/shared/directives';
import { ProviderService, ProviderListRequest } from '../../provider/provider.service';

@Component({
  selector: 'hq-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {

  constructor(
    private providerService: ProviderService
  ) { }

  ngOnInit() {
  }

  public get columns() {
    return [
      { name: 'code', title: '代码' },
      { name: 'name', title: '名称', weight: 1 },
      { name: 'contactUser', title: '联系人' },
    ];
  }

  public onProviderSelect(event) {
    
  }

  public get source() {
    return (params: TypeaheadRequestParams) => {
      let p = new ProviderListRequest(params.text, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.providerService.getPagedList(p);
    };
  }

}
