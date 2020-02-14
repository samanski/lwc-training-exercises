import { LightningElement, api, track } from 'lwc';

export default class StudentTiles extends LightningElement {
    @api studentList= [];

    @api setSelectedStudent(studentId) {
        this.selectedStudentId = studentId;
        console.log('selected student id: ' + studentId);

        // This function only fires when you click the student record in the gallery view
    }

    @track selectedStudentId = '';

    handleStudentSelected(event) {
        this.selectedStudentId = event.detail.studentId;
    }
}