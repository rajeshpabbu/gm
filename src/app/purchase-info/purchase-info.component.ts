import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

// import {Component} from 'angular2/core';
// import { NgForOf } from '@angular/common';

import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

import { DealerLookupComponent } from "../dealer-lookup/dealer-lookup.component";

import { PromotionService } from "../promotion.service";
import { SubmissionService } from "../submission.service";

@Component({
  selector: "purchase-info",
  templateUrl: "./purchase-info.component.html"
})
export class PurchaseInfoComponent implements OnInit {
  //reference to modal
  bsModalRef: BsModalRef;

  //variable to track if dealer modal has been launched, for form validation
  dealerModalLaunched = false;

  //var to let us know that we have selected at least one prod
  atLeastOneProductSelected = false;

  // Var that handles the vin Pattern. If old vehicle is checked this will be removed
  baseVinPattern = "^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$";
  vinPattern: string;
  oldVehicle = false;

  isFleet = false;

  //inject services through constructor
  constructor(
    public promotionService: PromotionService,
    private router: Router,
    private modalService: BsModalService,
    public submissionService: SubmissionService
  ) {}

  ngOnInit() {
    this.isOldVehicle();
    console.log(this.promotionService.productCategories);
    this.populateProductList();
    console.log(this.promotionService.productCategories);
    this.isChecked();
  }

  // BootStrap Date Picker Configurations
  minDate = new Date(2017, 5, 10);
  maxDate = new Date(Date.now());
  bsValue: Date = new Date();
  bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];
  bsConfigOptions: any = {
    showWeekNumbers: false
  };

  public noVINUpdate() {
    this.submissionService.noVIN = this.submissionService.noVIN ? true : false;

    if (this.submissionService.noVIN) {
      this.submissionService.formData.vin = null;
      this.submissionService.formData.confirmVin = null;
    }
    this.vinPattern = this.submissionService.noVIN ? null : this.baseVinPattern;
  }
  dealerSearch() {
    if (
      !this.submissionService.formData.dealerZip ||
      this.submissionService.formData.dealerZip.length < 5
    ) {
      return;
    }

    const initialState = {
      dealerZip: this.submissionService.formData.dealerZip
    };

    this.dealerModalLaunched = true;

    this.bsModalRef = this.modalService.show(DealerLookupComponent, {
      initialState
    });
  }

  submit(): void {
    console.log(this.submissionService.formData);
    let isFleet = this.submissionService.userType === "fleet";

    //@todo: this should be handeled by just using date pipe when we need the date string
    if (
      this.submissionService.formData.transactionDate &&
      typeof this.submissionService.formData.transactionDate.setHours ===
        "function"
    ) {
      console.log("Look, I set the hours!!");
      this.submissionService.formData.transactionDate.setHours(0, 0, 0, 0);
    } else if (this.submissionService.formData.transactionDate) {
      //date has been parsed previously
      this.submissionService.formData.transactionDate = new Date(
        this.submissionService.formData.transactionDate
      );
    }

    let prods = [];
    for (var i in this.promotionService.productCategories) {
      if (this.promotionService.productCategories[i].checked) {
        prods.push(
          this.promotionService.productCategories[i].name.toLowerCase()
        );
      }
    }

    console.log(prods);

    //first check that we have the data we need. All validation should be checked before this function gets called,
    //so if for whatever reason we don't have the data this function will not return a message or anything.
    if (prods.length < 1) {
      console.log("Data missing to filter promotions!");
      return;
    }

    var validDealer = this.submissionService.formData.dealer
      ? this.submissionService.formData.dealer
      : [];
    if (validDealer !== [])
      var dealerValidOffers = validDealer.valid_offer
        ? this.submissionService.formData.dealer.valid_offers
        : [];

    this.promotionService.getValidPromotionList(
      this.submissionService.formData.transactionDate,
      prods,
      dealerValidOffers,
      isFleet,
      this.submissionService.formData.location
    );

    this.promotionService.getValidPromotionList(
      this.submissionService.formData.transactionDate,
      prods,
      dealerValidOffers,
      isFleet,
      this.submissionService.formData.location
    );
    this.router.navigate(["/tiles-submission"]);
  }

  isChecked() {
    console.log(this.promotionService.productCategories);

    this.atLeastOneProductSelected = false;

    for (var i in this.promotionService.productCategories) {
      if (this.promotionService.productCategories[i].checked) {
        this.atLeastOneProductSelected = true;
        console.log("at least one prod");
        return;
      }
    }
  }

  isOldVehicle() {
    this.vinPattern = this.submissionService.formData.oldVehicle
      ? null
      : this.baseVinPattern;
  }

  clearDealer() {
    this.submissionService.formData.dealer = null;
  }

  populateProductList() {
    if (this.promotionService.productCategories.length === 0) {
      let promos = this.promotionService.allRunningPromos;
      let products = [];
      let type = this.submissionService.userType == "fleet" ? true : false;
      for (var i in promos) {
        if (promos[i].fleetOffer != type) {
          continue;
        }

        let promoProds = promos[i].validProducts;

        for (var j in promoProds) {
          if (products.indexOf(promoProds[j].toLowerCase()) === -1) {
            products.push(promoProds[j].toLowerCase());
          }
        }
      }

      products.sort();

      console.log(products);

      for (var i in products) {
        this.promotionService.productCategories.push({
          name: products[i],
          checked: false
        });
      }
    }
  }

  // showPicker = false;
  // myDate: Date = new Date();
  // showDate = true;
  // showTime = true;
  // closeButton: any = { show: true, label: 'Close Me!', cssClass: 'btn btn-sm btn-primary' };
  //
  // onTogglePicker() {
  //     if (this.showPicker === false) {
  //         this.showPicker = true;
  //     }
  // }
  //
  // onValueChange(val: Date) {
  //     this.myDate = val;
  // }
  //
  // isValid(): boolean {
  //     // this function is only here to stop the datepipe from erroring if someone types in value
  //     return this.myDate && (typeof this.myDate !== 'string') && !isNaN(this.myDate.getTime());
  // }
}
