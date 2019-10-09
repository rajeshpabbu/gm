import {Component, OnInit} from '@angular/core';
import {SubmissionService} from '../submission.service';
import {Router} from '@angular/router';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs} from '@angular/http';
import {DatePipe} from '@angular/common';
import {Input} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/timeout';
import {LoadingComponent} from '../loading/loading.component';

@Component({
    selector: 'submission-consumer',
    templateUrl: './submission-consumer.component.html'
})

export class SubmissionConsumerComponent {

    @Input() fileExt: string = "JPG, GIF, PNG, JPEG, PDF, DOC, XLS";
    @Input() maxFiles: number = 1;
    @Input() maxSize: number = 3.5; // 5MB

    imgErrors: string[] = [];
    exists: boolean;

    loading: boolean;
    netsuiteResponse: any;
    validEpsilonResponse: any;
    bsModalRef: BsModalRef;
    params: URLSearchParams;
    epsilonParts: any;
    //object to store form data in
    model = {
        firstName: null,
        lastName: null,
        address1: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
        phone: null,
        phoneNumber: null,
        email: null,
        confirmEmail: null,
        lastFourCard: null,
        cardType: null,
        isVirtualCard: null
    };

    epsilonData = {
        pi_oem_dealer_id: null,
        pi_vin: null,
        pi_ro_number: null,
        pi_ro_close_date: null,
        pi_submission_id: null,
    };
    invalidObject = {
        action: 'update',
        validationStatus: 213,
        reviewDisposition: 25,
        sid: null,
        epsilonVerificationStatus: 2,
        invalidCodes: 251,
    };
    validObject = {
        action: 'update',
        validationStatus: 208,
        epsilonVerificationStatus: 1, //verified (?)
        productInfo: [],
        sid: null,
        invoiceNumber: null,
        reviewDisposition: '',
        invalidCodes: '',
    };

    //epsilonRequestURL = "http://aka-qa-test.parago.com/rest/protected/EpsilonGatewayService/GetROData";
    epsilonRequestURL = "https://webenrollmentapi.amssupport.net/securegenericdataservice/rebate/ getROData?";
    //epsilonRequestURL = "https://staging-webenrollmentapi.amssupport.net/securegenericdataservice/rebate/getROData?";

    //epsilonParameters = "oem_dealer_id=12345?vin=123?ro_number=123&ro_close_date=1/1/1900&submission_id=123";
    postURL = "https://api.rebatepromotions.com/SubmissionCtrl.php";

    constructor(private router: Router, public submissionService: SubmissionService, private modalService: BsModalService, private http: Http, private datePipe: DatePipe) {
        this.model = submissionService.model;
    }

    ngOnInit(){
        this.model.isVirtualCard = "F";
    }
    config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
    };

    postRequest() {

        this.loading = true;
        this.bsModalRef = this.modalService.show(LoadingComponent,
            Object.assign({}, this.config, {class: 'gray modal-sm'})
        );

        //format date:
        this.submissionService.formData.transactionDate = this.datePipe.transform(this.submissionService.formData.transactionDate, 'MM/dd/yyyy');

        let postData = JSON.stringify(this.submissionService.formData);
        let formdata = new FormData();

        formdata.append('nsPayload', postData);
        formdata.append('scriptId', '672');
        formdata.append('format', "json");
        // console.log(postData);
        this.http.post(this.postURL, formdata)
            .timeout(60000)
            .subscribe((response: Response) => {
                    this.parseResponse(response);
                },
                (err: Response) => {
                    console.log(err);
                    this.bsModalRef.hide();
                    this.router.navigate(['/submission-error']);
                });
    }


    parseResponse(body: Response) {
        if (body.status == 200 && body.text() != '') {
            let res = body.json();

            if (this.isValidResponse(res)) {
                this.submissionService.submissionStatus = 'approved';
                if(this.submissionService.promotion.captureImage || this.submissionService.forceCaptureImage || this.submissionService.noVIN){
                    this.bsModalRef.hide();
                    this.router.navigate(['submission-confirmation']);
                }
                else
                    this.makeEpsilonRequest();
            }
            else {
                this.bsModalRef.hide();
                this.router.navigate(['/submission-error']);
            }
        }
    }

    isValidResponse(res: any): boolean {
        if (res.status.text == "success") {
            console.log(res.sid);
            this.validObject.sid = res.sid;
            this.invalidObject.sid = res.sid;
            this.submissionService.submissionStatus = "approved";
            return true;
        }
        else {
            this.submissionService.submissionStatus = "error";
            return false;
        }
    }

    makeEpsilonRequest() {
        let callEpsilon = this.setEpsilonData();

         let headers = {headers: new Headers({'Authorization': 'bearer QP9dpee9VRyjXYtUArUimCWTsJoVuCcOri9W4wDq61PgI8hQRVgTaemwYo71KYNrB6iCp4BilFJpjkl7RbhrwnD4sbVGUFnBTJi98UP6ko7sviCjhAiJiHps9gItizsQJ7Wo8qnwZ4Y4F83ry4SOiBbBhrM5GrjEj7n5E4nUpteh5XyROePed5wghZF978am1HCkZQkEpy6IdF37rpifiPn2T4SmZKuRzAeew2SHrKFserpnpCy5eX8WqX7J7ZXI_tps'})};
        //let headers = {headers: new Headers({'Authorization': 'bearer hmBH2BTUuGKF2kcOkqsP34IRL8N2w5QgENuVGsTxJLrDNIlFPle6YJtb57pz4CtO16I2k0dNh6v5XSvQA032DQvfHoTWued7dG25Ser6817e27TNX02uPRuUITxYZ3AwMj8xW32WjG0E8Be3PYmFti2cvXnCk9l9nYt9Uges7hyvHQJmBmTAEchVouWWQrl9A6Jq84CmS61NZ14uIemjQuKbsy0ee7hoDbSuAErJtsR2GLpv3COYhuQX0XCicMuy'})};
        if (callEpsilon) {
           // console.log('calling epsilon');
            let url = this.epsilonRequestURL + this.params;
            this.http.get(url, headers as RequestOptionsArgs)
                .timeout(60000)
                .subscribe((res: Response) => {
                        this.parseEpsilonResponse(res);
                    },
                    (err: Response) => {
                        this.updateNetsuiteSubmission(this.invalidObject);
                        this.bsModalRef.hide();
                        this.router.navigate(['/submission-confirmation']);
                    })


        }
        else
            this.bsModalRef.hide();
        this.router.navigate(['/submission-confirmation']);
    }

    parseEpsilonResponse(res: Response): any {
        let body = res.json();
        if (this.isValidEpsilon(body)) {
         // console.log('validated');
          this.updateNetsuiteSubmission(this.validObject);
        }else{
          this.updateNetsuiteSubmission(this.invalidObject);
        }


    }

    isValidEpsilon(body: any): boolean {
        for (let rowSetObject of body.dataObj.Rowset) {
          console.log(rowSetObject);
             for( let value of rowSetObject.ROWS) {
               console.log(value);
                var pi_ro_close_date = new Date(value.ro_close_date);
                var epsilonData_pi_ro_close_date = new Date(this.epsilonData.pi_ro_close_date);
                var timeDiff = Math.abs(pi_ro_close_date.getTime() - epsilonData_pi_ro_close_date.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                console.log(diffDays);
                if (diffDays <= 3) {
                    this.validObject.invoiceNumber = this.epsilonData.pi_ro_number;
                    let products = value.part;
                    if(products instanceof Array) {
                      for (let i in products) {

                        if (!products[i].id || !products[i].quantity) {
                          continue;
                        }

                        let parts = {
                          partNumber: products[i].id,
                          qty: products[i].quantity,
                        };
                        this.validObject.productInfo.push(parts);
                      }
                    }
                    else{
                      if(!products)
                        continue;
                      if(!products.id ||! products.quantity){
                        continue;
                      }
                      let parts = {
                        partNumber: products.id,
                        qty: products.quantity,
                      };
                      this.validObject.productInfo.push(parts);
                    }
                  //  console.log(this.validObject.invoiceNumber);
                    this.epsilonParts = value.part;
                  //  console.log(this.epsilonParts);

                }
              }
        }
      //  console.log('error in parsing Epsilon');
        if(this.validObject.productInfo !== null)
          return true;

        return false;
    }

    updateNetsuiteSubmission(data: any) {
        this.loading = true;
        data['epsilonProducts'] = this.epsilonParts;
        let postData = JSON.stringify(data);
        let formdata = new FormData();
        formdata.append('sid', this.validObject.sid);
        formdata.append('nsPayload', postData);
        formdata.append('scriptId', '672');
        formdata.append('format', "json");
      //  console.log(postData);
        this.http.post(this.postURL, formdata)
            .timeout(60000)
            .subscribe((response: Response) => {
                  this.submissionService.submissionStatus = "validated";
                },
                (err: Response) => {
                    // return false;
                },
                //@todo: we may need to remove the below finally func.
                () => {
                    this.bsModalRef.hide();
                     this.router.navigate(['/submission-confirmation']);
                });
    }



    submit() {
        this.submissionService.formData.noVIN = this.submissionService.noVIN ? 'T' : 'F';
        this.submissionService.formData.paymentType = this.model.lastFourCard ? 1 : 107;
        this.submissionService.setEmailText();

        this.submissionService.setFormData(this.model);
        this.submissionService.model = this.model;


        this.netsuiteResponse = this.postRequest();
    }

    setEpsilonData() {

        if(!this.submissionService.formData.dealer){
            return false;
        }

        /* Running the following code before any other code will create String.prototype.padStart() if it's not natively available. */
        if (!String.prototype.padStart) {
            String.prototype.padStart = function padStart(targetLength,padString) {
                targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
                padString = String((typeof padString !== 'undefined' ? padString : ' '));
                if (this.length > targetLength) {
                    return String(this);
                }
                else {
                    targetLength = targetLength-this.length;
                    if (targetLength > padString.length) {
                        padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
                    }
                    return padString.slice(0,targetLength) + String(this);
                }
            };
        }

      // Test Epsilon Data
      // this.epsilonData.pi_vin = "21159798";   //last 8 of VIN
      // this.epsilonData.pi_ro_close_date = "4/12/2011";
      // this.epsilonData.pi_ro_number = "270205";
      // this.epsilonData.pi_oem_dealer_id = "00000116579";
      // this.epsilonData.pi_submission_id = this.validObject.sid;
        // Actual Epsilon Data
        this.epsilonData.pi_vin = (this.submissionService.formData.vin) ? this.submissionService.formData.vin.slice(-8) : null;   //last 8 of VIN
        this.epsilonData.pi_ro_close_date = this.submissionService.formData.transactionDate;
        this.epsilonData.pi_ro_number = this.submissionService.formData.invoiceNumber;
        this.epsilonData.pi_oem_dealer_id = this.submissionService.formData.dealer.client_bac.padStart(11, "0");
        this.epsilonData.pi_submission_id = this.validObject.sid;

        this.params = new URLSearchParams();
        for (let data in this.epsilonData) {
            if (data == null)
                return false;
            this.params.set(data, this.epsilonData[data]);
        }
        return true;
    }

    onFileChange(event, num){

        this.imgErrors[num-1] = "";
        this.submissionService.formData["imgUpload" + num] = null;
        // console.log(event);

        let files = event.target.files;
        this.saveFiles(files, num);
    }

    saveFiles(files, num){
        // console.log(files);

        //this.errors = []; // Clear error
        // Validate file size and allowed extensions
        if (files.length > 0 && (!this.isValidFiles(files, num))) {
            //this.uploadStatus.emit(false);
            return;
        }
        if (files.length > 0) {
            for (var j = 0; j < files.length; j++) {

                var subService = this.submissionService;

                this.submissionService.formData["imgUpload" + num] = {
                    name: files[j].name
                };

                let reader = new FileReader();
                reader.addEventListener('load', function(){
                    var res = reader.result;

                    res = res.split(',');

                    subService.formData["imgUpload" + num].content = res[1];
                }, false);

                reader.readAsDataURL(files[j]);

            }
        }


        //console.log(this.submissionService.formData);

    }

    private readFile(file, onLoadCallback){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = onLoadCallback;
    }

    private isValidFiles(files, num){
        // Check Number of files
        if (files.length > this.maxFiles) {
            this.imgErrors[num-1] = "Error: At a time you can upload only " + this.maxFiles + " files";
            return;
        }
        this.isValidFileExtension(files, num);
        return true;
    }

    private isValidFileExtension(files, num){
        // Make array of file extensions
        var extensions = (this.fileExt.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
        for (var i = 0; i < files.length; i++) {
            // Get file extension
            var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
            // Check the extension exists
            //this.exists = extensions.includes(ext);
            this.exists = (extensions.indexOf(ext) !== -1);
            if (!this.exists) {
                this.imgErrors[num-1] = 'Unsupported file format, please upload .jpeg/.jpg/.png/.pdf only.';
            }
            // Check file size
            this.isValidFileSize(files[i],num);
        }
    }

    private isValidFileSize(file,num) {
        var fileSizeinMB = file.size / (1024 * 1000);
        var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize)
            this.imgErrors[num-1] = "File Size exceed file size limit of " + this.maxSize + "MB";

        if(size === 0)
            this.imgErrors[num-1] = "File has no content";
    }


    isValidImage(){

        if(!this.submissionService.forceCaptureImage && !this.submissionService.promotion.captureImage && !this.submissionService.noVIN){
            return true;
        }

        if(this.imgErrors[0] || this.imgErrors[1]){
            return false;
        }

        if(!this.submissionService.formData.imgUpload1 && !this.submissionService.formData.imgUpload2){
            return false;
        }

        return true;

    }

    // test sub : 5998740 for update
}
