import { LightningElement, track } from 'lwc';

export default class PropsDemo extends LightningElement {
    myPrivateName = "Private Hello";
    @track myTrackedName = "Tracked World";

    changePrivate() {
        this.myPrivateName = "Private Hello " + this._getTime();
    }
    changeReactive() {
        this.myTrackedName = "Tracked World " + this._getTime();
    }
   
   _getTime() {
        return (new Date()).getTime();
    }
}