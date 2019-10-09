import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/filter';


@Component({
	selector: 'image-upload',
	templateUrl: './image-upload.component.html'
})

export class ImageUploadComponent implements OnInit{

	@Input() fileExt: string = "JPG, PNG, JPEG, PDF";
	@Input() maxFiles: number = 2;
	@Input() maxSize: number = 3.5; // 5MB
	@Output() uploadStatus = new EventEmitter();

	postURL = "https://api.rebatepromotions.com/SubmissionCtrl.php";

	errors: Array<string> =[];
	exists: boolean;

	fileNames: string[] = [];
	state: string = 'main';
	sid: number;
	num = 1;

	data = {};


	constructor(private http: Http, private route: ActivatedRoute){ };

	ngOnInit(){

		this.route.queryParams
			.subscribe(params => {
				console.log(params);

				this.sid = params['sid'];

				if(!this.sid || this.sid['length'] !== 7){
					this.state = 'urlError'
				}
				else{
					this.state = 'spinner';
					let nsPayload = {
			            "client": 2580011,
			            "columns": ['validationStatus', 'invalidCodes']
			        };
			        nsPayload['id'] = this.sid;
			        let formdata = new FormData();
			        formdata.append('nsPayload', JSON.stringify(nsPayload));
			        formdata.append('scriptId', '676');
			        this.http.post(this.postURL, formdata)
			            .map(res => res.json())
			            .subscribe(
			            	(res:Response) => {

                        let sub = res["submissions"][this.sid];

                        if(!sub || sub.validationStatus.toLowerCase() !== 'review'  || sub.invalidCodes.toLowerCase().indexOf('awaiting epsilon transaction details') === -1){
                          this.state = 'statusError';
                        }
                        else{
                          this.state = 'main';
                        }
			                },
			                (error) => {
			            	    this.state = 'error';
			                })
				}
			})

	}

	submit(){

		this.state = 'loading';

		this.data['action'] = 'update';
		this.data['sid'] = this.sid;

		let formdata = new FormData();

		formdata.append('nsPayload', JSON.stringify(this.data));
		formdata.append('scriptId', '672');
		formdata.append('format', "json");

		this.http.post(this.postURL, formdata)
			.subscribe((response: any) => {
					this.parseResponse(response);
				},
				(err: Response) => {

					console.log(err);

					this.state = 'error';
				});

	}

	parseResponse(body: Response){

		if (body.status == 200 && body.text()) {

			let res = body.json();

			if (res["status"]["text"] === 'success') {
				this.state = 'success';
				return;

			}

		}

		this.state = 'error';
	}

	onFileChange(event){
		let files = event.target.files;
		this.saveFiles(files);
	}

	restart(){
		this.data = {};
		this.errors = [];
		this.fileNames = [];

		this.state = 'main'
	}

	saveFiles(files){

		this.errors = []; // Clear error
		// Validate file size and allowed extensions
		if (files.length > 0 && (!this.isValidFiles(files))) {
			this.uploadStatus.emit(false);
			return;
		}
		if (files.length > 0) {
			for (var j = 0; j < files.length; j++) {

				var subService = this;
				let imgNum = this.num++;

				this.fileNames.push(files[j].name);

				this.data["imgUpload" + imgNum] = {
					name: files[j].name
				};

				let reader = new FileReader();
				reader.addEventListener('load', function(){
					var res = reader.result;

					res = res.split(',');

					subService.data["imgUpload" + imgNum].content = res[1];

					console.log(subService.data);
				}, false);

				reader.readAsDataURL(files[j]);

			}
		}

	}

	private isValidFiles(files){
		// Check Number of files
		if ((files.length + this.fileNames.length) > this.maxFiles) {
			this.errors.push("You can only upload " + this.maxFiles + " files at a time");
			return;
		}
		this.isValidFileExtension(files);
		return this.errors.length === 0;
	}

	private isValidFileExtension(files){
		// Make array of file extensions
		var extensions = (this.fileExt.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
		for (var i = 0; i < files.length; i++) {
			// Get file extension
			var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
			// Check the extension exists
			//this.exists = extensions.includes(ext);
			/* Changing the method as the Object doesn't support property or method 'includes' on IE */
			this.exists = (extensions.indexOf(ext) !== -1);
			if (!this.exists) {
				this.errors.push('Only .jpeg/.jpg/.png/.pdf formats allowed');
			}
			// Check file size
			this.isValidFileSize(files[i]);
		}
	}

	private isValidFileSize(file) {
		var fileSizeinMB = file.size / (1024 * 1000);
		var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
		if (size > this.maxSize)
			this.errors.push("File size limit of " + this.maxSize + "MB exceeded (" + size + "MB)");
	}
}
