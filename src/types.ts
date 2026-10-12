export type AccountName = 'eliasespinola' | 'mynetfilin' | 'milena';
export type PaymentStatus = 'pagado' | 'pendiente';
export type ClientStatus = 'renovado' | 'nuevo';

export interface NetflixProfile {
  id: string;
  accountName: AccountName;
  profileNumber: number;
  clientName: string;
  clientPhone: string;
  paymentDate: string; // YYYY-MM-DD
  paymentStatus: PaymentStatus;
  clientStatus: ClientStatus;
  price: number;
  pin: string;
  notes: string;
  isExtension?: boolean; // Extensión extra para 1 solo dispositivo
  deviceLimit?: string; // Ej: "1 solo dispositivo"
  updatedAt: string;
}

export interface PaymentLog {
  id: string;
  profileId: string;
  clientName: string;
  accountName: AccountName;
  profileNumber: number;
  amount: number;
  type: 'pago' | 'renovacion' | 'registro';
  date: string;
  notes?: string;
}
