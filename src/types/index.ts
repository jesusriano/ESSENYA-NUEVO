export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName?: string;
}

export interface ServicePrice {
  durationMinutes: number; // e.g. 60, 90, 120
  priceMXN: number;
}

export interface MassageService {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'relajante' | 'terapeutico' | 'especial' | 'parejas' | 'prenatal';
  tag?: string; // e.g. "Más Popular", "Recomendado", "Exclusivo"
  image: string;
  prices: ServicePrice[];
  benefits: string[];
  recommendedFor: string[];
  intensity: 1 | 2 | 3 | 4 | 5; // Pressure level
  includedOils: string[];
  durationOptions: number[];
}

export interface CoverageZone {
  id: string;
  name: string;
  areaGroup: 'Poniente' | 'Centro-Sur' | 'Interlomas & Edomex' | 'Oeste';
  zipCodes: string[];
  estimatedArrival: string;
  deliveryFee: number; // 0 for standard zones
  popularNeighborhoods: string[];
}

export interface Review {
  id: string;
  author: string;
  neighborhood: string;
  rating: number;
  date: string;
  comment: string;
  serviceUsed: string;
  verified: boolean;
  avatarImage?: string;
}

export interface FAQItem {
  id: string;
  category: 'Reserva' | 'Seguridad' | 'Preparación' | 'Pagos y Cancelaciones';
  question: string;
  answer: string;
}

export interface BookingFormState {
  serviceId: string;
  durationMinutes: number;
  selectedAddOns: string[];
  therapistGenderPreference: 'indistinto' | 'femenino' | 'masculino';
  date: string;
  timeSlot: string;
  zoneId: string;
  fullAddress: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  specialRequests: string;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta_terminal' | 'tarjeta_online';
}
