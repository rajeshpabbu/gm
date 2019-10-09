import { Injectable }     from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SubmissionService } from './submission.service'

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private submissionService: SubmissionService, private router: Router) { };

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if(this.submissionService.userType)
            return true;

        this.router.navigate(['/home']);
        return false;

    }
}