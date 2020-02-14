// NEW! Exercise 6-4
import { LightningElement, track } from 'lwc';

export default class TripReports extends LightningElement {
	@track mode = 'browse';

	// Exercise 6-4: Part II
		// declare private/tracked property
	@track selectedTripReportId = 0;

	get browseMode() {
		return (this.mode==='browse');
	}
	get addOrEditMode() {
		return (this.mode==='add' || this.mode==='edit');
	}

	// Exercise 6-4: Part II
		// define function that updates mode and the selectedTripReportId
		// function is called when 'ontripreportmodechange' event is fired
	handleTripReportModeChange(event) {
		this.mode = event.detail.mode;
		this.selectedTripReportId = event.detail.Id;
	}

}