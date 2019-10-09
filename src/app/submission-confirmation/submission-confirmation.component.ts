/**
 * Created by mgross on 2/22/18.
 */

import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SubmissionService} from '../submission.service';

@Component({
  selector: 'submission-confirmation.component',
  templateUrl: './submission-confirmation.html'
})

export class SubmissionConfirmationComponent {

  response: string;
  userType: string;
  promotionName: string;

  constructor(public submissionService: SubmissionService, private router: Router) {
    this.response = submissionService.submissionStatus;
    this.userType = submissionService.userType;
    this.promotionName = submissionService.promotion.displayName;
  }

  back() {

    // This is to clear out the image after the upload of the first submission, so that if the user selects to submit another rebate all the form data fields will be there except the image uploads
    this.submissionService.formData.imgUpload1 = null;
    this.submissionService.formData.imgUpload2 = null;

    this.router.navigate(['/tiles-submission']);

  }
}
