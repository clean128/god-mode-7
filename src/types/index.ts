// Core Types for GodMode7 MVP

export interface Business {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeType?: string;
}

export interface Person {
  id: string;
  latitude: number;
  longitude: number;
  // Core demographic data
  firstName?: string;
  lastName?: string;
  fullName?: string;
  age?: number;
  gender?: 'M' | 'F' | 'U';
  address?: string;
  zipCode?: string;
  // Contact info
  phone?: string;
  email?: string;
  // Financial data
  estimatedIncome?: string;
  netWorth?: string;
  homeValue?: string;
  // Household info
  householdSize?: number;
  maritalStatus?: string;
  childrenPresent?: boolean;
  homeowner?: boolean;
  // Interests (array of interest categories)
  interests?: string[];
  // Professional
  occupation?: string;
  businessOwner?: boolean;
  // Additional L2 fields (flexible)
  [key: string]: any;
}

export interface PersonPin extends Person {
  clustered?: boolean;
  clusterCount?: number;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface SearchFilters {
  // Demographics
  gender?: ('M' | 'F' | 'U')[];
  ageRange?: [number, number];
  incomeRange?: string[];
  education?: string[];
  ethnicity?: string[];
  
  // Location
  zipCodes?: string[];
  radius?: number; // in meters
  state?: string[];
  county?: string[];
  
  // Household
  homeowner?: boolean;
  childrenPresent?: boolean;
  maritalStatus?: string[];
  householdSize?: [number, number];
  
  // Professional
  businessOwner?: boolean;
  occupation?: string[];
  employmentStatus?: string[];
  
  // Interests & Lifestyle
  interests?: string[];
  lifestyleSegment?: string[];
  hobbies?: string[];
  
  // Financial
  netWorthRange?: string[];
  homeValueRange?: string[];
  creditRating?: string[];
  
  // Behavioral
  onlineBuyer?: boolean;
  mailResponder?: boolean;
  charitableDonor?: boolean;
  politicalAffiliation?: string[];
  
  // Vehicles
  vehicleOwner?: boolean;
  vehicleType?: string[];
  
  // Advanced
  petOwner?: string[]; // ['Dogs', 'Cats', etc.]
  travelFrequency?: string[];
}

export interface L2SearchRequest {
  filters: {
    [key: string]: string | string[] | number | boolean;
  };
  circle_filter?: {
    lat: number;
    long: number;
    radius: number;
  };
  format?: 'json' | 'csv';
  fieldset?: 'SIMPLE' | 'EXTENDED' | 'ALL' | string;
  limit?: number;
  wait?: number;
}

export interface L2SearchResponse {
  result: 'ok' | 'error';
  code: number;
  total?: number;
  data?: Person[];
  job?: string;
  message?: string;
}

export interface SelectedPeople {
  [personId: string]: Person;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  duration?: number;
}

