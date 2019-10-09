/**
 * Created by rraleigh on 2/13/18.
 */
import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";

import "rxjs/add/operator/map";

import { BsModalRef } from "ngx-bootstrap";

import { SubmissionService } from "../submission.service";

@Component({
  selector: "dealer-lookup",
  templateUrl: "./dealer-lookup.component.html"
})
export class DealerLookupComponent implements OnInit {
  submissionService: SubmissionService;

  loading: boolean;
  error: boolean;
  dealerList: any[];
  dealerZip: number;

  constructor(
    public bsModalRef: BsModalRef,
    private http: Http,
    submissionService: SubmissionService
  ) {
    this.submissionService = submissionService;
  }

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.submissionService.forceCaptureImage = false;
    this.submissionService.formData.noDealer = false;

    console.log(this.dealerZip);

    var dealerLookupUrl =
      "https://api.rebatepromotions.com/dealerlookup/?format=json&clientId=2580011&zip=" +
      this.dealerZip;

    this.http
      .get(dealerLookupUrl)
      .map(res => res.json())
      .subscribe(
        (res: Response) => {
          this.parseResults(res);
        },
        error => {
          this.errorCallback(error);
        },
        () => {
          this.loading = false;
        }
      );
  }

  parseResults(res: Response) {
    if (!res["retailers"] || res["retailers"].length < 1) {
      this.error = true;
      return;
    }

    this.dealerList = res["retailers"];
  }

  errorCallback(error: any) {
    this.error = true;
  }

  chooseDealer(dealer: any) {
    this.updateDealerFormData(dealer);

    this.bsModalRef.hide();
  }

  updateDealerFormData(dealer: any) {
    this.submissionService.formData.dealer = dealer;

    this.submissionService.formData.retailer = dealer.internal_id;
  }

  escapeDealer() {
    this.submissionService.noDealer();
    this.bsModalRef.hide();
  }
}
