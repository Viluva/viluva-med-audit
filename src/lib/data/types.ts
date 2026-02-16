
export interface Hospital {
  sno_: number;
  city_name: string;
  hospital_name: string;
  accreditation: string;
  tier_type: string;
  address: string;
  facilities: string;
}

export interface Price {
  code: string;
  name: string;
  nabhRate: string;
  nonNabhRate: string;
  superSpecialityRate: string;
  specialityClassification: string;
  tier: string;
}
