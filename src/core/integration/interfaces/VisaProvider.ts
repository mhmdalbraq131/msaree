import { ConnectorInterface } from '../types';

export interface VisaApplicationRequest {
  applicantName: string;
  passportNumber: string;
  nationality: string;
  destinationCountry: string;
  visaType: 'tourist' | 'umrah' | 'business' | 'residence';
  passportExpiry: string;
  photoUrl?: string;
}

export interface VisaStatusResult {
  applicationId: string;
  passportNumber: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  issuedVisaNumber?: string;
  validUntil?: string;
  remarks?: string;
}

export interface VisaProvider extends ConnectorInterface {
  submitApplication(request: VisaApplicationRequest): Promise<VisaStatusResult>;
  checkStatus(applicationId: string): Promise<VisaStatusResult>;
}
