/**
 * Created by rraleigh on 2/13/18.
 */
import { Injectable } from '@angular/core'

import { Promotion } from './promotion';
import { PROMOS } from './promotion-list';

@Injectable()
export class PromotionService {

    allRunningPromos = PROMOS;

    usersValidPromotions: Promotion[];
    productCategories: any[] = [];

    setPromotion(id: number): Promotion {

        return new Promotion();
    }

    reset(){
        this.usersValidPromotions = [];
        this.productCategories = [];
    }

    getValidPromotionList(transactionDate: any, productList: string[], dealerValidPromoList: string[], forFleet: boolean, locationType: string): Promotion[] {

        let validPromos = [];
        let currentPromos = PROMOS;
        let today = new Date();
        today.setHours(0,0,0,0);

        for(let i in currentPromos ){

            if(today > currentPromos[i]["expiryDate"]){
                continue;
            }

            /*
                Optional Param Checks
             */
            //if we have a list of promotions valid for a dealer and the promo we are looking at in loop is not in the list, continue
            if(dealerValidPromoList.length > 0 && dealerValidPromoList.indexOf(currentPromos[i]["offerCode"]) === -1){
                continue;
            }

            if(currentPromos[i].validLocationType.length > 0 && currentPromos[i].validLocationType.indexOf(locationType) === -1){
                continue;
            }

            //check that transaction date is within range if it was provided
            if(transactionDate && (currentPromos[i]["startDate"] > transactionDate || transactionDate > currentPromos[i]["endDate"])) {
                continue;
            }


            /*
             Mandatory Param Checks
             */
            //check that fleet

            if(currentPromos[i]["fleetOffer"] !== forFleet) {

                continue;
            }


            if(currentPromos[i]["validProducts"].some(r=> productList.indexOf(r) >= 0)) {
                validPromos.push(currentPromos[i]);
            }


        }

        this.usersValidPromotions = validPromos;
        console.log(validPromos);
        //fleet offers, mail in, or online -- narrowed down
        //Narrow down by transaction date

        //@todo: actually write filtering logic here

        //write a php class to lookup valid promos for a dealer based on their BAC code or internal id
        //var validDealerOffers = getDealers();

        //filter based on products

        //filter based on date - possibly should be first filter


        return currentPromos;
    }




}