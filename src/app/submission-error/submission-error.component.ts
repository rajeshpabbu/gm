/**
 * Created by mgross on 2/22/18.
 */

import {Component} from '@angular/core';

import {SubmissionService} from '../submission.service';

@Component({
    selector: 'submission-error.component',
    templateUrl: './submission-error.html'
})

export class SubmissionErrorComponent {

    response: string;

    constructor(submissionService: SubmissionService) {
        this.response = submissionService.submissionStatus;
    }

}