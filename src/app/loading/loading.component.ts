/**
 * Created by mgross on 2/21/18.
 */
/**
 * Created by rraleigh on 2/13/18.
 */
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import { BsModalRef } from 'ngx-bootstrap';

import { SubmissionService } from '../submission.service';

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html'
})

export class LoadingComponent implements OnInit{

    loading: boolean;
    error: boolean;

    constructor(public bsModalRef: BsModalRef, private http: Http, private submissionService: SubmissionService) {};

    ngOnInit() {
        this.loading = true;
        this.error = false;

    }






}