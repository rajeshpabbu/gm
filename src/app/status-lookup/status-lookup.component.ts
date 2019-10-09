import {Component} from '@angular/core';
import {Http, Jsonp} from '@angular/http';

import 'rxjs/add/operator/map';

@Component({
    selector: 'status-lookup',
    templateUrl: './status-lookup.component.html'
})

export class StatusLookupComponent {

    //object to store form data in
    model = {
        email: null,
        phone: null,
        lastName: null,
        address1: null,
        zip: null,
        address: null,
    };

    data: any[];

    status = 'home';

    constructor(private http: Http, private jsonp: Jsonp) { };


    //called when a status lookup is submitted, completes url and makes GET request
    submitButtonOnStatusLookup(formType: any) {

        this.status = 'spinner';
        let url = 'https://api.rebatepromotions.com/SubmissionCtrl.php';

        let nsPayload = {
            "client": 2580011,
            "columns": ['validationStatus', 'id', 'dateCreated', 'processDate', 'firstName', 'lastName', 'invoiceNumber',
                'offerCode', 'invalidCodes', 'email', 'phoneNumber', 'address1', 'address2', 'city', 'state', 'zip', 'transactionDate',
                'giftCardShipDate', 'checkMailDate', 'processDate', 'decisionDate', 'giftCardFulfillmentAmount', 'checkFulfillmentAmt',
                'issuer', 'premiumItemProcessedDate', 'epsilonVerificationStatus', 'reviewDisposition']
        };


        if (formType === 'email') {
            nsPayload['email'] = this.model.email;
        } else if (formType === 'phone') {
            nsPayload['phoneNumber'] = this.model.phone;
        } else if (formType === 'address') {
            nsPayload['lastName'] = this.model.lastName;
            nsPayload['address'] = this.model.address;
            nsPayload['zip'] = this.model.zip;
        }

        console.log(nsPayload);

        let formdata = new FormData();
        formdata.append('nsPayload', JSON.stringify(nsPayload));
        formdata.append('scriptId', '676');


        this.http.post(url, formdata)
            .map(res => res.json())
            .subscribe(
                (res:Response) => {
                    this.parseResults(res);
                },
                (error) => {
                    this.errorCallback(error);
                },
                () => {
                    // this.loading = false;
                })

    }

    errorCallback(error: any){

        this.status = 'error';
    }
    emptyResults(){

        this.status = 'error';
    }

    refreshStatusLookup(){

        this.status = 'home';
    }

    test(){

        this.status = 'results';
    }

    // window.rebateStatusCallback(res: any) {
    //     console.log(res);
    // }

    parseResults(res: Response) {

        console.log(res);

        this.data = [];

        for(var i in res['submissions']){

            this.data.push(res['submissions'][i]);

        }
        console.log(this.data);
        // console.log(this.data.length);
        // if(this.data.length === 0){
        //
        //     this.emptyResults();
        // }

        this.status = 'results';

    }


}