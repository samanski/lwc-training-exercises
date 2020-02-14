import { LightningElement, wire, track } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import getStudents from '@salesforce/apex/StudentBrowser.getStudents';
import { NavigationMixin } from 'lightning/navigation';

export default class StudentBrowser extends NavigationMixin(LightningElement) {

    selectedDeliveryId = '';
    selectedInstructorId = '';

    // Exercise 6-5
        // change wired students property to a tracked property and initialized as an empty array
        // students property will be populated in the callback of the "getStudents" method
        // fire the 'doneloading' event in the callback
    @track students = [];
    @wire(getStudents, {instructorId: '$selectedInstructorId', courseDeliveryId: '$selectedDeliveryId'}) 
    // students;
    wired_getStudents(result) {
        if (result.data) {
            this.students = result;
        }
        else if (result.error) {
            this.error = result.error;
        }
        this.dispatchEvent(new CustomEvent('doneloading', {
            bubbles: true,
            composed: true
        }));
    }

    cols = [
        {
            fieldName: "Name",
            label: "Name"
        },
        {
            fieldName: "Title",
            label: "Title",
            hiddenOnMobile: true
        },
        {
            fieldName: "Phone",
            label: "Phone",
            type: "phone"
        },
        {
            fieldName: "Email",
            label: "Email",
            type: "email"
        }
    ];

    @wire(CurrentPageReference) pageRef;

    handleFilterChange(event) {
        this.selectedDeliveryId = event.detail.deliveryId;
        this.selectedInstructorId = event.detail.instructorId;

        // Exercise 6-5
            // fire the loading custom event
        this.dispatchEvent(new CustomEvent('loading', {
            bubbles: true,
            composed: true
        }));
    }

    handleStudentSelected(event) {
        const studentId = event.detail.studentId;
        this.updateSelectedStudent(studentId);
    }

    updateSelectedStudent(studentId) {
        let grid = this.template.querySelector('c-responsive-datatable');
        let gallery = this.template.querySelector('c-student-tiles');

        if (grid) {
            grid.setSelectedRecord(studentId);
        }
        if (gallery) {
            gallery.setSelectedStudent(studentId);
        }
        
        fireEvent(this.pageRef, 'studentChange', { studentId });
    }

    handleRowDblClick(event) {
        const studentId = event.detail.pk;
        this[NavigationMixin.Navigate] ({
            type: 'standard__recordPage',
            attributes: {
                recordId: studentId,
                objectApiName: 'Contact',
                actionName: 'edit'
            }
        });
    }

    handleRowClick(event) {
        let studentId = event.detail.pk;
        this.updateSelectedStudent(studentId);
    }
      
}