/**
 * Created by rraleigh on 2/13/18.
 */
export class Promotion {
    promoId: number;
    image: string;
    name: string;
    displayName: string;
    value: string;
    startDate: any;
    endDate: any;
    expiryDate: any;
    type: any;
    pdfLink: string;
    offerCode: string;
    isOnline: any;
    requiresLastFourCard: boolean;
    hasPromoSpecificRetailers: boolean;
    captureDealer: any;
    hasVirtualCardOption: boolean;
    validProducts: string[];
    validLocationType: string[];
    fleetOffer: boolean;
    captureImage: boolean;
    captureTransmissionType: boolean;
    tileDisclaimer: string;
}