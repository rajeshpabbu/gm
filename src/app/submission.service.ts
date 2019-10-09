/**
 * Created by rraleigh on 2/20/18.
 */
import {Injectable} from '@angular/core'
import {Promotion} from './promotion';
import { Http, Response, Headers, RequestOptions, URLSearchParams, HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SubmissionService {

    userType: string; //valid values: mail-in, online, fleet
    formData: any = {
        client: 2580011,
        optIn: 'T',
    };
    purchaseInfo : any = {};
    promotion: Promotion;
    submissionStatus: string;
    model: any = {};

    forceCaptureImage = false;
    noVIN = false;
    promoSpecificFields : any = {
        transType: null,
    };

    public getFormData(): any {
        return this.formData;
    }


    public setFormData(data : any){
        for(let field in data){
            if(data.hasOwnProperty(field)){
                this.formData[field] = data[field];
            }
        }

    }

    public setEmailText(){

        this.formData.emailSubject = 'Rebate Redemption Offer: ' + this.promotion.name;

        this.formData.emailMsg = "<p>Thank you for participating in the " + this.promotion.name + ". You will receive a second confirmation email once we have confirmed your purchase.</p>" +
        "<p>You may also check the status of your request at any time at https://mycertifiedservicerebates.com/</p>" +
        "<p>If you have any questions you may contact customer service at any time at the https://mycertifiedservicerebates.com/contact </p>" +
        "<p>Your submission ID is {{id}}. To expedite customer service inquiries please include your submission ID in your correspondence.</p>" +
        "<br />" +
        "<p>Thank you,</p>" +
        "<p>Promotions Center Support Team</p>"

    }

    public noDealer(){

        this.formData.dealer = null;
        this.formData.noDealer = true;
        this.forceCaptureImage = true;

    }

    public setTransType(){

       let promoMap : any = {
           '66040': {
                auto_carbureted: {
                    promotion: "14081",
                    offerCode: "66040AC",
                },
               auto_fi : {
                   promotion: '14085',
                   offerCode: '66040AF',
               },
               manual: {
                   promotion: '14086',
                   offerCode: '66040M',
               },
           }

       };

       let transType = this.promoSpecificFields.transType;

       for(let obj in promoMap){
           if(promoMap[obj][transType]){
               console.log(promoMap[obj][transType]['promotion']);
               this.formData.promotion = promoMap[obj][transType]['promotion'];
               this.formData.offerCode = promoMap[obj][transType]['offerCode'];
           }
       }
    }

    reset(){
        this.formData = {
            client: 2580011,
            optIn: 'T',

        };
        this.promotion = null;
        this.model = {};
    }
}