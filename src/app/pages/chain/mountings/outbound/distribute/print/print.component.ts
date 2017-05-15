import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DistributeService } from "../distribute.service";
import { PrintDirective } from "app/shared/directives";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: 'hq-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css'],
  providers: [DistributeService]
})
export class PrintComponent implements OnInit {
  @ViewChild('printer')
  public printer: PrintDirective;
  constructor(
    injector: Injector,
    protected service: DistributeService,
    private route: ActivatedRoute
  ) {

    this.route.params.subscribe((params: Params) => {
      const billId = params['billId'];
      const billCode = params['billCode'];
      const SerialNumsList = params['SerialNumsList'].split("-");
      console.log(SerialNumsList)
      this.service.getPrintList(billId, billCode, SerialNumsList).toPromise()
        .then(data => {
          console.log(data)
        })
        .catch(err => console.log(err));
    });

  }
  private data: any;
  ngOnInit() {
  }

}
