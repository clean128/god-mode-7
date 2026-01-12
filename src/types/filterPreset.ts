// Filter Preset Types for Milestone 2

import { SearchFilters } from './index';

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: SearchFilters;
  createdAt: number;
  updatedAt: number;
  isDefault?: boolean;
}

export interface FilterSuggestion {
  id: string;
  label: string;
  description: string;
  filters: Partial<SearchFilters>;
  category: 'demographic' | 'financial' | 'lifestyle' | 'behavioral';
  icon?: string;
}

// Pre-defined filter suggestions
export const DEFAULT_FILTER_SUGGESTIONS: FilterSuggestion[] = [
  {
    id: 'affluent-homeowners',
    label: 'Affluent Homeowners',
    description: 'High-income homeowners aged 35-65',
    category: 'financial',
    filters: {
      homeowner: true,
      incomeRange: ['$150K+'],
      ageRange: [35, 65],
    },
  },
  {
    id: 'young-professionals',
    label: 'Young Professionals',
    description: 'Business owners and professionals aged 25-40',
    category: 'demographic',
    filters: {
      businessOwner: true,
      ageRange: [25, 40],
      incomeRange: ['$75K-$100K', '$100K-$150K', '$150K+'],
    },
  },
  {
    id: 'families-with-kids',
    label: 'Families with Kids',
    description: 'Homeowners with children',
    category: 'lifestyle',
    filters: {
      childrenPresent: true,
      homeowner: true,
    },
  },
  {
    id: 'pet-lovers',
    label: 'Pet Lovers',
    description: 'Pet owners interested in animals',
    category: 'lifestyle',
    filters: {
      petOwner: ['Dogs', 'Cats'],
      interests: ['Pets', 'Animals'],
    },
  },
  {
    id: 'online-shoppers',
    label: 'Online Shoppers',
    description: 'Active online buyers',
    category: 'behavioral',
    filters: {
      onlineBuyer: true,
    },
  },
  {
    id: 'charitable-givers',
    label: 'Charitable Givers',
    description: 'People who donate to charities',
    category: 'behavioral',
    filters: {
      charitableDonor: true,
    },
  },
];

