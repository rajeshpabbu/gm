import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Http } from '@angular/http';


@Component({
	selector: 'fleet',
	templateUrl: './fleet.component.html'
})

export class FleetComponent {

	@Input() fileExt: string = "JPG, PNG, JPEG, PDF, DOC, DOCX";
	@Input() maxFiles: number = 5;
	@Input() maxSize: number = 5; // 5MB
	@Output() uploadStatus = new EventEmitter();

	postURL = "https://api.rebatepromotions.com/emailGM.php";

	errors: Array<string> =[];
	exists: boolean;

	fileNames: string[] = [];
	formData: FormData = new FormData();
	state: string = 'main';

	constructor(private http: Http){ };

	submit(){

		this.state = 'loading';

		this.formData.append('password', 'skickafilerna');


		this.http.post(this.postURL, this.formData)

            .subscribe((response: any) => {

					let body = response.json();

					if(body['status'] === 'success'){
						this.state = 'success';
					}else{
						this.state = 'error';
					}

				},
				(err: Response) => {
					console.log(err);
					this.state = 'error';
				});

	}

	onFileChange(event){
		let files = event.target.files;
		this.saveFiles(files);
	}

	restart(){
		this.formData = new FormData();
		this.errors = [];
		this.fileNames = [];

		this.state = 'main'
	}

	saveFiles(files){
		console.log(files);

		this.errors = []; // Clear error
		// Validate file size and allowed extensions
		if (files.length > 0 && (!this.isValidFiles(files))) {
			this.uploadStatus.emit(false);
			return;
		}
		if (files.length > 0) {
			for (var j = 0; j < files.length; j++) {
				this.formData.append("fileToUpload[]", files[j]);
				this.fileNames.push(files[j].name);
			}
		}

		//console.log(this.formData.getAll("fileToUpload[]"));
		console.log(this.fileNames);
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
			this.exists = (extensions.indexOf(ext) !== -1);
			if (!this.exists) {
				this.errors.push('Only .jpeg/.jpg/.png/.pdf/.doc/.docx formats allowed.');
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