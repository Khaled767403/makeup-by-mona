// Shipping fees are resolved server-side so a customer can never manipulate
// the total by tampering with client-side requests.
export const SHIPPING_FEES = {
  Cairo: 60,
  Giza: 60,
  Alexandria: 70,
  Qalyubia: 65,
  "Port Said": 80,
  Suez: 80,
  Dakahlia: 75,
  Sharqia: 75,
  Gharbia: 75,
  Menoufia: 75,
  Beheira: 80,
  "Kafr El Sheikh": 80,
  Damietta: 80,
  Ismailia: 80,
  "Beni Suef": 85,
  Fayoum: 85,
  Minya: 90,
  Asyut: 95,
  Sohag: 100,
  Qena: 100,
  Luxor: 110,
  Aswan: 120,
  "Red Sea": 110,
  Matrouh: 100,
  "North Sinai": 110,
  "South Sinai": 110,
  "New Valley": 120,
};

export function getShippingFee(governorate) {
  return SHIPPING_FEES[governorate] ?? 100; // fallback default fee
}
