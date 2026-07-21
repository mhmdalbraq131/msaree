import { BaseProvider } from '../BaseProvider';
import { 
  HotelBookingRequest, 
  HotelBookingResult, 
  HotelOffer, 
  HotelsProvider, 
  HotelSearchParams 
} from '../interfaces/HotelsProvider';
import { ProviderCategory } from '../types';

export class MockHotelsProvider extends BaseProvider implements HotelsProvider {
  public readonly id = 'mock-makkah-hotels';
  public readonly name = 'Makkah & Madinah Hotels Connector';
  public readonly category: ProviderCategory = 'hotels';

  constructor() {
    super();
    this.initApiClient('https://api.mock-hotels.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async searchHotels(params: HotelSearchParams): Promise<HotelOffer[]> {
    await new Promise((res) => setTimeout(res, 120));
    return [
      {
        hotelId: 'htl-makkah-1',
        name: 'فندق أبراج الساعة الملكية مكة',
        city: 'مكة المكرمة',
        address: 'مجمع أبراح البيت، مكة',
        starRating: 5,
        roomType: 'غرفة مطلة على الحرم الشريف',
        pricePerNight: 280,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
        availableRooms: 15
      },
      {
        hotelId: 'htl-madinah-1',
        name: 'فندق دار التقوى المدينة المنورة',
        city: 'المدينة المنورة',
        address: 'أمام المسجد النبوي الشريف',
        starRating: 5,
        roomType: 'جناح ملكي فاخر',
        pricePerNight: 240,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
        availableRooms: 8
      }
    ];
  }

  public async bookHotel(request: HotelBookingRequest): Promise<HotelBookingResult> {
    await new Promise((res) => setTimeout(res, 250));
    return {
      reservationId: `HTL-RES-${Math.floor(100000 + Math.random() * 900000)}`,
      hotelName: 'فندق أبراج الساعة الملكية مكة',
      status: 'confirmed',
      totalPrice: 560,
      currency: 'USD'
    };
  }

  public async cancelReservation(reservationId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 100));
    return reservationId.length > 0;
  }
}
