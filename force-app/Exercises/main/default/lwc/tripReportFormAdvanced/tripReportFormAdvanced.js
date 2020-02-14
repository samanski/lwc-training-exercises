// NEW! Exercise 6-2
import { LightningElement, api, track, wire } from 'lwc';

import Utils from 'c/utils';
import getInstructors from '@salesforce/apex/StudentBrowserForm.getInstructors';
import { getObjectInfo, getPicklistValues} from 'lightning/uiObjectInfoApi';

// TODO #1: In a single line, import four functions from 'lightning/uiRecordApi' that we will use for Lightning Data Service. 
// The functions are: createRecord, getFieldValue, getRecord, updateRecord
import { createRecord, getFieldValue, getRecord, updateRecord } from 'lightning/uiRecordApi';	//fill in the contents of this line


// TODO #2: using the examples of FIELD_ID and FIELD_DATE, import the Instructor__c, Name, Rating__c, ReviewType__c, and Review__c fields
// HINT: loook at the fieldsToLoad array that immediately follows.
import OBJECT_TRIP_REPORT from '@salesforce/schema/TripReport__c';
import FIELD_ID from '@salesforce/schema/TripReport__c.Id';
import FIELD_DATE from '@salesforce/schema/TripReport__c.Date__c';
import FIELD_INSTRUCTOR from '@salesforce/schema/TripReport__c.Instructor__c';
import FIELD_NAME from '@salesforce/schema/TripReport__c.Name';
import FIELD_RATING from '@salesforce/schema/TripReport__c.Rating__c';
import FIELD_REVIEWTYPE from '@salesforce/schema/TripReport__c.ReviewType__c';
import FIELD_REVIEW from '@salesforce/schema/TripReport__c.Review__c';

const fieldsToLoad = [FIELD_DATE, FIELD_INSTRUCTOR, FIELD_NAME, FIELD_RATING, FIELD_REVIEWTYPE, FIELD_REVIEW];

export default class TripReportFormAdvanced extends LightningElement {

	error;
	_editorInitialized;

	@api recordId;
	
	//arrays to populate form options
	@track instructors;
	@track reviewTypes;
	
	//properties to store form values
	@track instructorId;
	@track locationName;
	@track dateVisited;
	@track reviewType;
	@track rating = 3;
	@track review;

	// Exercise 6-3
	@track saveButtonDisabled = true;
	
    //TODO #3: following the examples of and dateVisited and instructorId, 
    //         store the value of the name, rating, review type, and review fields in JavaScript properties 
	@wire(getRecord, { recordId: '$recordId', fields:fieldsToLoad })
    wiredTripReport({ error, data }) {
        if (data) {
			this.dateVisited = getFieldValue(data, FIELD_DATE);
            this.instructorId = getFieldValue(data, FIELD_INSTRUCTOR);
            this.locationName = getFieldValue(data, FIELD_NAME);
            this.rating = getFieldValue(data, FIELD_RATING);
            this.reviewType = getFieldValue(data, FIELD_REVIEWTYPE);
            this.review = getFieldValue(data, FIELD_REVIEW);
			
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.record = undefined;
        }
    }

	@wire(getInstructors)
	wired_getInstructors({ error, data }) {
		this.instructors = [];
		if (data) {
			data.forEach(instructor => {
				this.instructors.push({
					value: instructor.Id,
					label: instructor.Name
				});
			});
		} else if (error) {
			this.error = error;
		}
	}
	
	//Get Object Info
	@wire (getObjectInfo, {objectApiName: OBJECT_TRIP_REPORT})
	objectInfo;

	//Get ReviewType picklist values
	@wire (getPicklistValues, {recordTypeId: '$objectInfo.data.defaultRecordTypeId', 
	                           fieldApiName: FIELD_REVIEWTYPE})
	wired_getPicklistValues({ error, data }) {
		this.reviewTypes = [];
		if (data) {
			data.values.forEach(reviewType => {
				this.reviewTypes.push({
					value: reviewType.value,
					label: reviewType.label
				});
			});
		}
	}

	get formTitle() {
		return (typeof this.recordId==='undefined' || this.recordId===0) ? 'Add Trip Report' : 'Edit Trip Report';
	}

	renderedCallback() {
		//without the following, the rich text area doesn't show text until first click
		if (!this._editorInitialized) {
			this._editorInitialized = true;
			this.template.querySelector('lightning-input-rich-text').focus();
		}
	}

	//TODO #4: set the value of the private tracked properties when they're changed in the form
	onInstructorChange(event) {
        this.instructorId = event.target.value;
	}
	onLocationNameChange(event) {
        this.locationName = event.target.value;
	}
	onDateVisitedChange(event) {
        this.dateVisited = event.target.value;
	}
	onReviewTypeChange(event) {
        this.reviewType = event.target.value;
	}
	onRatingChange(event) {
        this.rating = event.target.value;
	}
	onReviewChange(event) {
        this.review = event.target.value;
	}

	onSave() {
		this.saveTripReport();
	}
	saveTripReport() {
		const fieldsToSave = {}
		fieldsToSave[FIELD_DATE.fieldApiName] = this.dateVisited;
		fieldsToSave[FIELD_INSTRUCTOR.fieldApiName] = this.instructorId;
		//TODO #5: follow the pattern from the previous two lines to include rating, reviewtype, review, and name
        //in our request
        fieldsToSave[FIELD_NAME.fieldApiName] = this.locationName;
        fieldsToSave[FIELD_RATING.fieldApiName] = this.rating;
        fieldsToSave[FIELD_REVIEWTYPE.fieldApiName] = this.reviewType;
        fieldsToSave[FIELD_REVIEW.fieldApiName] = this.review;

		if (!this.recordId) {
			
			//todo #6: When creating a new record, define an object named recordInput with two property:
			//---fields, which contains the fieldsToSave object
            //---apiName, which contains the api name of the trip report object
            const recordInput = { fields:fieldsToSave, apiName:OBJECT_TRIP_REPORT.objectApiName};

			createRecord(recordInput)
				.then(tripReport => {
                    //TODO #7: after record creation, store the new ID of the trip report in our recordId property
                    this.recordId = tripReport.Id;
					
					Utils.showToast(this,'Success', 'Trip Report Created', 'success');

					// Exercise 6-4: Part II
						// call the function to return to 'browse' mode after a record saves successfully
					this.returnToBrowseMode();
				})
				.catch(error => {
					Utils.showToast(this,'Error creating record', error.body.message, 'error');
				});
		} else {
			
			//TODO #8: when doing an update, add the recordId to our fieldsToSave object 
            //so that the system knows which record to update
            fieldsToSave[FIELD_ID.fieldApiName] = this.recordId;

			const recordInput = { fields:fieldsToSave}
			updateRecord(recordInput)
                .then(() => {
					Utils.showToast(this,'Success', 'Trip report updated', 'success');

					// Exercise 6-4: Part II
						// call function to return to 'browse' mode after a record updates successfully
					this.returnToBrowseMode();
                })
                .catch(error => {
                    Utils.showToast(this,'Error updating record', error.body.message, 'error');
                });
		}
		
	}

	// Exercise 6-3
	validateFields() {
		let field = null;
		let fields = this.template.querySelectorAll('.validateMe');
		let result = true;

		for (let i=0; i < fields.length; i++) {
			field = fields[i];
			result = field.checkValidity();

			if (!result) break;
		}

		return result;
	}

	onBlur() {
		this.saveButtonDisabled = !this.validateFields();
	}

	// Exercise 6-4: Part III
		// define function which returns to 'browse' mode
	onCancel() {
		this.returnToBrowseMode();
	}


	// Exercise 6-4: Part II
		// create function that fires a custom event to set the trip report mode back to 'browse'
	returnToBrowseMode() {
		const evt = new CustomEvent('tripreportmodechange', {
			detail: {
				mode: 'browse'
			}
		});
		this.dispatchEvent(evt);
	}

}