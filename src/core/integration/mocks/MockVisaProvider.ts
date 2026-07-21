import { BaseProvider } from '../BaseProvider';
import { 
  VisaApplicationRequest, 
  VisaProvider, 
  VisaStatusResult 
} from '../interfaces/VisaProvider';
import { ProviderCategory } from '../types';

export class MockVisaProvider extends BaseProvider implements VisaProvider {
  public readonly id = 'mock-immigration-portal';
  public readonly name = 'Consular & Umrah Visa Connector';
  public readonly category: ProviderCategory = 'visa';

  constructor() {
    super();
    this.initApiClient('https://api.mock-visa.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async submitApplication(request: VisaApplicationRequest): Promise<VisaStatusResult> {
    await new Promise((res) => setTimeout(res, 350));
    return {
      applicationId: `VISA-APP-${Math.floor(100000 + Math.random() * 900000)}`,
      passportNumber: request.passportNumber,
      status: 'under_review',
      remarks: 'Application received and transmitted to Ministry of Foreign Affairs'
    };
  }

  public async checkStatus(applicationId: string): Promise<VisaStatusResult> {
    await new Promise((res) => setTimeout(res, 150));
    return {
      applicationId,
      passportNumber: '087654321',
      status: 'approved',
      issuedVisaNumber: `E-VISA-${Math.floor(1000000 + Math.random() * 9000000)}`,
      validUntil: '2026-11-01',
      remarks: 'E-Visa generated and ready for download'
    };
  }
}
