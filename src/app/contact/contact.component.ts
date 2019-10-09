import { Component } from '@angular/core';

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html'
})

export class ContactComponent {

    //object to store form data in
    model = {
        firstName: null,
        lastName: null,
        custevent_address_1: null,
        custevent_address_2: null,
        custevent_city: null,
        custevent_state: null,
        custevent_zip: null,
        custevent_phone: null,
        email: null,
        confirmEmail: null,
        custevent_offer_code: null,
        custevent_text_invoice_number: null,
        date: null,
        issue: null,
        incomingmessage: null,

    };

    minDate = new Date(2017, 5, 10);
    maxDate = new Date(Date.now());
    bsValue: Date = new Date();
}