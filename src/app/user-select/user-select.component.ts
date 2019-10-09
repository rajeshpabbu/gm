import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SubmissionService } from '../submission.service';
import { PromotionService } from '../promotion.service';

@Component({
    selector: 'user-select',
    templateUrl: './user-select.component.html'
})

export class UserSelectComponent {

    constructor(private submissionService: SubmissionService, private promotionService: PromotionService, private router: Router){ };

    selectUserType(type) {

        this.submissionService.reset();
        this.promotionService.reset();

        console.log(type);

        this.submissionService.userType = type;

        if(type === 'mail-in'){

            let promos = this.promotionService.allRunningPromos;
            let parsedPromos = [];

            for(var i in promos){

                if(!promos[i].fleetOffer){

                    parsedPromos.push(promos[i]);

                }


            }

            this.promotionService.usersValidPromotions = parsedPromos;

            this.router.navigate(['/tiles-submission']);

        }else{

            this.router.navigate(['/purchase-info']);

        }



    }


}