import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Utils {

    static showToast = (firingComponent, toastTitle, toastBody, variant) => {
        const evt = new ShowToastEvent({
            title: toastTitle,
            message: toastBody,
            variant: variant
        });

        firingComponent.dispatchEvent(evt);
    }

    // Exercise 5-4
    static showModal = (firingComponent, header, content) => {
        const evt = new CustomEvent('showmodal', {
            detail: {
                header,
                content
            },
            bubbles: true,
            composed: true
        });
        
        firingComponent.dispatchEvent(evt);
    }
}