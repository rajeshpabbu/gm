import {Component, OnInit} from '@angular/core';
import {PromotionService} from '../promotion.service';
import {SubmissionService} from '../submission.service';
import {Router} from '@angular/router';

import {Promotion} from '../promotion';
import {Pipe, PipeTransform} from '@angular/core';
@Component({
    selector: 'tiles-submission',
    templateUrl: './tiles-submission.component.html'
})

export class TilesSubmissionComponent implements OnInit {

    //inject services through constructor
    constructor(public promotionService: PromotionService, public submissionService: SubmissionService, private router: Router) {
        console.log(this.promotionService.usersValidPromotions);
    };

    ngOnInit(){

        this.filterPromotions();

        // Sort promotions alphabetically
        this.sortPromotions();



    }

    filterPromotions(){
      // debugger;
      let validPromos = [];
      let currentPromos = this.promotionService.usersValidPromotions;
      console.log(currentPromos);
      let today = new Date();
      today.setHours(0,0,0,0);

      for(let i in currentPromos ) {

        if (today <= currentPromos[i]["expiryDate"]) {
          validPromos.push(currentPromos[i]);
        }
      }

      this.promotionService.usersValidPromotions = validPromos;
      console.log(validPromos);
      // return currentPromos;

    }


    sortPromotions() {
      // debugger;

        //if mail in GM wants sorted by offer name:
        // if(this.submissionService.userType === 'mail-in'){
        //     this.promotionService.usersValidPromotions.sort(function(a,b){
        //         return a.displayName.localeCompare(b.displayName);
        //     });
        //
        //     return;
        //
        // }

        //else by product name
        // this.promotionService.usersValidPromotions.sort( function(a,b){
        //     return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
        // });
        // console.log(this.promotionService.usersValidPromotions);

    }

    setPromo(promo: Promotion, redirectUrl: string[]) {

        this.submissionService.promotion = promo;
        this.router.navigate(redirectUrl);

        // Set the formData for the promotion
        this.submissionService.formData.promotion = promo.promoId;
        this.submissionService.formData.offerCode = promo.offerCode;

    }

    //validPromos = this.promotionService.usersValidPromotions;


    validPromos = this.promotionService.usersValidPromotions;
    //console.log(validPromos);

}
