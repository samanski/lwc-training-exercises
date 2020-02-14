// NEW! Exercise 6-4
import { LightningElement, track } from 'lwc';
import getAll from '@salesforce/apex/TripReportBrowser.getAll';

export default class TripReportBrowser extends LightningElement {
	cols = [
		{
			fieldName:'Date__c', 
			label: 'Date',
			hiddenOnMobile:true
		},
		{
			fieldName:'Name', 
			label: 'Name'
		},
		{
			fieldName:'ReviewType__c', 
			label: 'Type'
		},
		{
			fieldName:'InstructorName', 
			label: 'Instructor'
		},
		{
			fieldName:'Rating__c', 
			label: 'Rating'
		}
	];

	@track tripReports;

	// Exercise 6-4: Part II
		// declare private/tracked property
	@track selectedRecordId = 0;

	connectedCallback() {
		getAll()
		.then((result) => {
			let data = result;
			let reports=[];
			if (data) {
				data.forEach(report => {
					let instructorName = '';
					if (typeof report.Instructor__r !== 'undefined') {
						instructorName = report.Instructor__r.Name;
					} 
					let reportCopy = {
						Id: report.Id,
						Name: report.Name,
						Date__c: report.Date__c,
						Rating__c: report.Rating__c, 
						Review__c: report.Review__c, 
						ReviewType__c: report.ReviewType__c, 
						InstructorName: instructorName
					}
					reports.push(reportCopy); 
				});
				this.tripReports = reports;
			} 
		});
	}

	// Exercise 6-4: Part II
		// declare function 
		// fire event that includes the mode we're changing to
		// if mode is 'edit', include selectedRecordId.
	changeTripReportMode(newMode) {
		let eventDetail = {
			mode: newMode
		}
		if (newMode === 'edit') {
			eventDetail.Id = this.selectedRecordId;
		}

		// fire the event
		const evt = new CustomEvent('tripreportmodechange', {
			detail: eventDetail
		});
		this.dispatchEvent(evt);
	}

		// define function that calls "changeTripReportMode"
		// changes to 'add' mode
	onBtnNewClick() {
		this.changeTripReportMode('add');
	}

	// Exercise 6-4: Part Four
		// define function that updates 'selectedRecordId' when record row is clicked once
	handleRowClick(event) {
		this.selectedRecordId = event.detail.pk;
	}

	// Exercise 6-4: Part Four
		// define function that changes to 'edit' mode when record row is double clicked
	handleRowDblClick() {
		this.changeTripReportMode('edit');
	}


	// Exercise 6-4: Part 5
		// define function to change report mode to 'edit' when the Edit button event is fired
	onBtnEditClick() {
		this.changeTripReportMode('edit');
	}
	

}