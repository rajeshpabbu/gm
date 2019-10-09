import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import {DatePipe} from '@angular/common';

import { AppComponent } from './app.component';
import { UserSelectComponent } from './user-select/user-select.component';
import { PurchaseInfoComponent } from './purchase-info/purchase-info.component';
import { StatusLookupComponent } from './status-lookup/status-lookup.component';
import { SubmissionConsumerComponent } from './submission-consumer/submission-consumer.component';
import { TilesSubmissionComponent } from './tiles-submission/tiles-submission.component';
import { FleetComponent } from './fleet/fleet.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { DealerLookupComponent } from './dealer-lookup/dealer-lookup.component';
import { LoadingComponent } from './loading/loading.component';
import { SubmissionConfirmationComponent } from './submission-confirmation/submission-confirmation.component';
import { SubmissionErrorComponent } from './submission-error/submission-error.component';
import { ContactConfirmationComponent } from './contact-confirmation/contact-confirmation.component';
import { PromotionService } from './promotion.service';
import { SubmissionService } from './submission.service';
import { AuthGuard } from './auth.service';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule }     from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    UserSelectComponent,
    PurchaseInfoComponent,
    SubmissionConsumerComponent,
    TilesSubmissionComponent,
    FleetComponent,
    ImageUploadComponent,
    FaqComponent,
    ContactComponent,
    StatusLookupComponent,
    DealerLookupComponent,
    LoadingComponent,
    SubmissionConfirmationComponent,
    SubmissionErrorComponent,
    ContactConfirmationComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    AppRoutingModule,
    AngularFontAwesomeModule,
    FormsModule,
    JsonpModule
  ],
  providers: [
    AuthGuard,
    PromotionService,
    SubmissionService,
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
      DealerLookupComponent,
      LoadingComponent
  ]
})
export class AppModule { }
