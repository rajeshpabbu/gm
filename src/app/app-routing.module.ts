import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserSelectComponent } from './user-select/user-select.component';
import { PurchaseInfoComponent } from './purchase-info/purchase-info.component';
import { StatusLookupComponent } from './status-lookup/status-lookup.component';
import { SubmissionConsumerComponent } from './submission-consumer/submission-consumer.component';
import { TilesSubmissionComponent } from './tiles-submission/tiles-submission.component';
import { FleetComponent } from './fleet/fleet.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { SubmissionConfirmationComponent } from './submission-confirmation/submission-confirmation.component'
import { SubmissionErrorComponent } from "./submission-error/submission-error.component";
import { ContactConfirmationComponent } from "./contact-confirmation/contact-confirmation.component";
import { AuthGuard } from "./auth.service";

const routes: Routes = [
    {
        path: 'home',
        component: UserSelectComponent
    },

    {
        path: 'status-lookup',
        component: StatusLookupComponent
    },
    {
        path: 'submission-consumer',
        component: SubmissionConsumerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'tiles-submission',
        component: TilesSubmissionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'submission-error',
        component: SubmissionErrorComponent
    },
    {
        path: 'purchase-info',
        component: PurchaseInfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'fleet',
        component: FleetComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'image-upload',
        component: ImageUploadComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'contact-confirmation',
        component: ContactConfirmationComponent
    },
    {
        path: 'faq',
        component: FaqComponent
    },
    {
        path: 'submission-confirmation',
        component: SubmissionConfirmationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
