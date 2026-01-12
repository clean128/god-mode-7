import axios from 'axios';
import { L2SearchRequest, L2SearchResponse, Person, SearchFilters } from '../types';

const L2_API_BASE = import.meta.env.VITE_L2_API_BASE_URL || 'https://api.l2datamapping.com';
const API_CUSTOMER = import.meta.env.VITE_L2_API_CUSTOMER;
const API_KEY = import.meta.env.VITE_L2_API_KEY;

// Application ID for Consumer data, United States
const APP_ID = 'COM_US';

class L2ApiService {
  private baseUrl: string;
  private apiCustomer: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = L2_API_BASE;
    this.apiCustomer = API_CUSTOMER || '';
    this.apiKey = API_KEY || '';
  }

  /**
   * Build authentication query string
   */
  private getAuthParams(): string {
    return `id=${this.apiCustomer}&apikey=${this.apiKey}`;
  }

  /**
   * Convert our SearchFilters to L2 API filter format
   */
  private convertFiltersToL2Format(filters: SearchFilters): Record<string, any> {
    const l2Filters: Record<string, any> = {};

    // Gender filter
    if (filters.gender && filters.gender.length > 0) {
      l2Filters['Voters_Gender'] = filters.gender.length === 1 
        ? filters.gender[0] 
        : filters.gender;
    }

  // Age range (needs birth year calculation)
  // TODO: Implement when needed
  // if (filters.ageRange) {
  //   const currentYear = new Date().getFullYear();
  //   const [minAge, maxAge] = filters.ageRange;
  //   // L2 uses birth years, so convert
  //   const maxBirthYear = currentYear - minAge;
  //   const minBirthYear = currentYear - maxAge;
  //   // This would need more specific L2 field mapping
  // }

    // Income range
    if (filters.incomeRange && filters.incomeRange.length > 0) {
      l2Filters['Estimated_Income'] = filters.incomeRange;
    }

    // Zip codes
    if (filters.zipCodes && filters.zipCodes.length > 0) {
      l2Filters['Residence_Addresses_Zip'] = filters.zipCodes.length === 1
        ? filters.zipCodes[0]
        : filters.zipCodes;
    }

    // Homeowner
    if (filters.homeowner !== undefined) {
      l2Filters['Homeowner_Probability_Model'] = filters.homeowner ? 'Y' : 'N';
    }

    // Children present
    if (filters.childrenPresent !== undefined) {
      l2Filters['Presence_of_Children'] = filters.childrenPresent ? 'Y' : 'N';
    }

    // Business owner
    if (filters.businessOwner !== undefined) {
      l2Filters['Business_Owner'] = filters.businessOwner ? 'Y' : 'N';
    }

    // Marital status
    if (filters.maritalStatus && filters.maritalStatus.length > 0) {
      l2Filters['Marital_Status'] = filters.maritalStatus;
    }

    // Occupation
    if (filters.occupation && filters.occupation.length > 0) {
      l2Filters['Occupation_Group'] = filters.occupation;
    }

    // Education
    if (filters.education && filters.education.length > 0) {
      l2Filters['Education_Level'] = filters.education;
    }

    // Interests
    if (filters.interests && filters.interests.length > 0) {
      l2Filters['Interest_Categories'] = filters.interests;
    }

    // Net worth
    if (filters.netWorthRange && filters.netWorthRange.length > 0) {
      l2Filters['Net_Worth'] = filters.netWorthRange;
    }

    // Home value
    if (filters.homeValueRange && filters.homeValueRange.length > 0) {
      l2Filters['Home_Market_Value'] = filters.homeValueRange;
    }

    // Credit rating
    if (filters.creditRating && filters.creditRating.length > 0) {
      l2Filters['Credit_Rating'] = filters.creditRating;
    }

    // Behavioral filters
    if (filters.onlineBuyer !== undefined) {
      l2Filters['Online_Buyer'] = filters.onlineBuyer ? 'Y' : 'N';
    }

    if (filters.mailResponder !== undefined) {
      l2Filters['Mail_Order_Responder'] = filters.mailResponder ? 'Y' : 'N';
    }

    if (filters.charitableDonor !== undefined) {
      l2Filters['Charitable_Donor'] = filters.charitableDonor ? 'Y' : 'N';
    }

    // Political affiliation
    if (filters.politicalAffiliation && filters.politicalAffiliation.length > 0) {
      l2Filters['Political_Party'] = filters.politicalAffiliation;
    }

    // Vehicle filters
    if (filters.vehicleOwner !== undefined) {
      l2Filters['Vehicle_Owner'] = filters.vehicleOwner ? 'Y' : 'N';
    }

    if (filters.vehicleType && filters.vehicleType.length > 0) {
      l2Filters['Vehicle_Type'] = filters.vehicleType;
    }

    // Pet owner
    if (filters.petOwner && filters.petOwner.length > 0) {
      l2Filters['Pet_Owner_Type'] = filters.petOwner;
    }

    // Lifestyle segments
    if (filters.lifestyleSegment && filters.lifestyleSegment.length > 0) {
      l2Filters['Lifestyle_Segment'] = filters.lifestyleSegment;
    }

    return l2Filters;
  }

  /**
   * Convert L2 API response to our Person type
   */
  private convertL2DataToPerson(data: any): Person {
    return {
      id: data.LALVOTERID || data.Individual_ID || `person-${Math.random()}`,
      latitude: parseFloat(data.Latitude) || 0,
      longitude: parseFloat(data.Longitude) || 0,
      firstName: data.Voters_FirstName || data.First_Name,
      lastName: data.Voters_LastName || data.Last_Name,
      fullName: data.Full_Name,
      age: data.Age || this.calculateAge(data.Date_of_Birth),
      gender: data.Voters_Gender || data.Gender,
      address: this.buildAddress(data),
      zipCode: data.Residence_Addresses_Zip || data.Zip_Code,
      phone: data.Cell_Phone || data.Landline,
      email: data.Email,
      estimatedIncome: data.Estimated_Income,
      netWorth: data.Household_Net_Worth,
      homeValue: data.Home_Est_Current_Value,
      householdSize: parseInt(data.Number_of_Persons_in_Unit) || undefined,
      maritalStatus: data.Marital_Status,
      childrenPresent: data.Presence_of_Children === 'Y',
      homeowner: data.Homeowner_Probability_Model === 'Y',
      occupation: data.Occupation_of_Person,
      businessOwner: data.Business_Owner === 'Y',
      interests: this.extractInterests(data),
      // Store raw data for additional access
      _raw: data,
    };
  }

  private buildAddress(data: any): string {
    const parts = [
      data.Residence_Addresses_HouseNumber,
      data.Residence_Addresses_StreetName,
      data.Residence_Addresses_City,
      data.Residence_Addresses_State,
    ].filter(Boolean);
    return parts.join(' ');
  }

  private calculateAge(dob: string): number | undefined {
    if (!dob) return undefined;
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  private extractInterests(data: any): string[] {
    const interests: string[] = [];
    // Extract interest fields from L2 data
    // These fields typically start with specific prefixes
    for (const key in data) {
      if (key.includes('Interest') || key.includes('Enthusiast') || 
          key.includes('Buyer') || key.includes('Collector')) {
        if (data[key] === 'Y' || data[key] === true) {
          interests.push(key.replace(/_/g, ' '));
        }
      }
    }
    return interests;
  }

  /**
   * Estimate search results (ALWAYS call this first to avoid unexpected costs)
   */
  async estimateSearch(
    center: [number, number],
    radius: number,
    filters?: SearchFilters
  ): Promise<number> {
    try {
      const l2Filters = filters ? this.convertFiltersToL2Format(filters) : {};
      
      const requestBody: Partial<L2SearchRequest> = {
        filters: l2Filters,
        circle_filter: {
          lat: center[1],
          long: center[0],
          radius: radius,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/api/v2/records/search/estimate/${this.apiCustomer}/${APP_ID}?${this.getAuthParams()}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.total || 0;
    } catch (error) {
      console.error('L2 API Estimate Error:', error);
      throw new Error('Failed to estimate search results');
    }
  }

  /**
   * Search for people in a geographic area
   */
  async searchPeople(
    center: [number, number],
    radius: number,
    filters?: SearchFilters,
    limit: number = 500
  ): Promise<Person[]> {
    try {
      const l2Filters = filters ? this.convertFiltersToL2Format(filters) : {};
      
      const requestBody: L2SearchRequest = {
        filters: l2Filters,
        circle_filter: {
          lat: center[1],
          long: center[0],
          radius: radius,
        },
        format: 'json',
        fieldset: 'EXTENDED',
        limit: Math.min(limit, 500), // Max 500 for JSON
        wait: 30000, // Wait up to 30 seconds
      };

      const response = await axios.post<L2SearchResponse>(
        `${this.baseUrl}/api/v2/records/search/${this.apiCustomer}/${APP_ID}?${this.getAuthParams()}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.result === 'ok' && response.data.data) {
        return response.data.data.map((record: any) => this.convertL2DataToPerson(record));
      }

      // If job ID returned, would need to poll for results
      if (response.data.job) {
        throw new Error('Search is processing. Please implement job polling.');
      }

      return [];
    } catch (error: any) {
      console.error('L2 API Search Error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to search people data');
    }
  }

  /**
   * Get available columns for the application
   */
  async getAvailableColumns(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v2/customer/application/columns/${this.apiCustomer}/${APP_ID}?${this.getAuthParams()}`
      );
      return response.data.columns || [];
    } catch (error) {
      console.error('L2 API Get Columns Error:', error);
      throw new Error('Failed to get available columns');
    }
  }

  /**
   * Check if API credentials are configured
   */
  isConfigured(): boolean {
    return !!(this.apiCustomer && this.apiKey);
  }
}

export const l2Api = new L2ApiService();

