import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getInstructors from '@salesforce/apex/StudentBrowserForm.getInstructors';
import getDeliveriesByInstructor from '@salesforce/apex/StudentBrowserForm.getDeliveriesByInstructor';

export default class StudentBrowserForm extends NavigationMixin(LightningElement) {
    @track instructors = [];
    @track deliveries = [];
    @track isButtonDisabled = true;

    error;
    selectedInstructorId = '';
    selectedDeliveryId = '';

    @wire (getInstructors)
    wired_getInstructors({ error, data }) {
        this.instructors = [];
        if (data) {
            this.instructors.push({
                value: '',
                label: 'Select an instructor'
            });
            data.forEach(instructor => {
                this.instructors.push({
                    value: instructor.Id,
                    label: instructor.Name
                });
            });
        }
        else if (error) {
            this.error = error;
        }
    }

    @wire (getDeliveriesByInstructor, {instructorId: '$selectedInstructorId'})
    wired_getDeliveriesByInstructor({ error, data }) {
        this.deliveries = [];
        if (data && data.length) {
            if (this.selectedInstructorId) {
                this.deliveries.push({
                    value: '',
                    label: 'Any delivery'
                });
            }
            data.forEach(delivery => {
                this.deliveries.push({
                    value: delivery.Id,
                    label: `${delivery.Start_Date__c} ${delivery.Location__c} ${delivery.Attendee_Count__c} students`
                });
            });
        } else if (error) {
            this.error = error;
        }
    }

    onInstructorChange(event) {
        this.selectedDeliveryId = '';
        this.selectedInstructorId = event.target.value;
        this.isButtonDisabled = (this.selectedInstructorId === '');
        this.notifyParent();
    }

    onDeliveryChange(event) {
        this.selectedDeliveryId = event.target.value;
        this.notifyParent();
    }

    notifyParent() {
        const evt = new CustomEvent('filterchange', {
            detail: {
                instructorId: this.selectedInstructorId,
                deliveryId: this.selectedDeliveryId
            }
        });

        this.dispatchEvent(evt);
    }

    onAddNewDelivery() {
        // Opens the new Course Delivery record modal dialog.
        this[NavigationMixin.Navigate] ({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Course_Delivery__c',
                actionName: 'new'
            }
        });
    }
}