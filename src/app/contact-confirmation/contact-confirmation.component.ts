/**
 * Created by mgross on 2/22/18.
 */

import { Component} from '@angular/core';
import {Router} from '@angular/router';
import { SubmissionService } from '../submission.service';

@Component({
    selector: 'contact-confirmation.component',
    templateUrl: './contact-confirmation.html'
})

export class ContactConfirmationComponent {

    constructor(private submissionService : SubmissionService, private router: Router) { }

}