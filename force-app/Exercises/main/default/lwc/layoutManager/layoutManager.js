import { LightningElement, track } from 'lwc';
import Utils from 'c/utils';

const VIEW_STUDENT_BROWSER = 'students';
const VIEW_TRIP_REPORTS = 'tripreports';
const VIEW_CERTIFICATION = 'certifiedStudents';
const VIEW_POPULARITY = 'certPopularity';

export default class LayoutManager extends LightningElement {

	@track viewMode = VIEW_STUDENT_BROWSER;
	@track certificationName = '';
	@track certificationId = 0;
	@track modalHeader = '';
	@track modalContent = '';

	// Exercise 6-5
		// define private/tracked property 'loading'
		// used to show / hide the spinner
		// sets default value to 'true' so that the first time the student list loads, the spinner will display
	@track loading = true;

	handleNavItemSelected(event) {
		const selectedItemName = event.detail.itemName;
		
		if (selectedItemName === 'students') {
			this.viewMode = VIEW_STUDENT_BROWSER;
		} else if (selectedItemName === 'tripreports') {
			this.viewMode = VIEW_TRIP_REPORTS;
		} else if (selectedItemName === 'certpopularity') {
			this.viewMode = VIEW_POPULARITY;
		} else if (selectedItemName.indexOf('certification') !== -1) {
			this.viewMode = VIEW_CERTIFICATION;
			const selectedCertificationObj = selectedItemName.split('|');
			this.certificationId = selectedCertificationObj[1];
			this.certificationName = selectedCertificationObj[2];
		}
	}

	get studentBrowserView() {
		return (this.viewMode === VIEW_STUDENT_BROWSER);
	}
	get tripReportView() {
		return (this.viewMode === VIEW_TRIP_REPORTS);
	}
	get certifiedStudentsView() {
		return (this.viewMode === VIEW_CERTIFICATION);
	}
	get certPopularityView() {
		return (this.viewMode === VIEW_POPULARITY);
	}

	handleShowModal(event) {
		this.modalHeader = event.detail.header;
		this.modalContent = event.detail.content;

		const modal = this.template.querySelector('c-modal');
		modal.show();
	}

	closeModal() {
		const modal = this.template.querySelector('c-modal');
		modal.hide();
	}


	connectedCallback() {
		Utils.showToast(
			this,
			'Welcome',
			"Don't forget to check back here for updated class schedules and assignments",
			'info'
		);
		// Does not display on "AwInstructors" tab because this toast is only fired on the LayoutManager which creates
		//   the "AwInstructors_Cmp_Tab" with the vertical navigation
	}


	// Exercise 6-5
		// define functions that will toggle the value of the 'loading' property
	handleLoading() {
		this.loading = true;
	}
	handleDoneLoading() {
		this.loading = false;
	}
}