// NEW! Exercise 5-6
import { LightningElement } from 'lwc';
import getCertPopularity from '@salesforce/apex/CertPopularity.getCertPopularity';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chart';

const CHART_CONFIG = {
    dom_selector: 'canvas.certBarChart',
    type: 'bar',
    color: 'rgb(255, 99, 132)',
    options: {
        responsive: true,
        legend: { display: false },
        title: { display: false },
        animation: { animationScale: true }
    }
}

export default class CertPopularity extends LightningElement {
    error;
    _chart;
    _chartjsInitialized = false;

    renderedCallback() {
        // *** if statement preferrably done last ***
        if (this._chartjsInitialized) {
            return;
        }
        this._chartjsInitialized = true;

        loadScript(this, chartjs)
            .then(getCertPopularity)
                .then((result) => {
                    console.log('Data returned from Apex', result);

                    // TODO: process data and render chart here
                    let certData = result;
                    let certLabels = [];
                    let certCounts= [];
                    for (let i=0; i < certData.length; i++) {
                        certLabels.push(certData[i].Name);
                        certCounts.push(certData[i].Number_of_Certified_Professionals__c);
                    }
                    const config= {
                        type: CHART_CONFIG.type,
                        data: {
                            labels: certLabels,
                            datasets: [{
                                label: CHART_CONFIG.label,
                                backgroundColor: CHART_CONFIG.color,
                                data: certCounts
                            }]
                        },
                        options: CHART_CONFIG.options
                    };
                    const ctx = this.template
                        .querySelector(CHART_CONFIG.dom_selector)
                        .getContext('2d');
                    this._chart = new window.Chart(ctx, config);
                })
                .catch(error => {
                    this.error = error;
                });
    }
}