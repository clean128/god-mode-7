import axios from 'axios';
import { Gift, Person, GiftOrder } from '../types';

const SENDOSO_API_BASE = import.meta.env.VITE_SENDOSO_API_BASE_URL || 'https://api.sendoso.com';
const SENDOSO_API_KEY = import.meta.env.VITE_SENDOSO_API_KEY;

/**
 * Sendoso API Service
 * Handles gift catalog fetching and gift sending
 */
class SendosoApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = SENDOSO_API_BASE;
    this.apiKey = SENDOSO_API_KEY || '';
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Check if Sendoso API is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Fetch gift catalog from Sendoso
   * Returns mock data if API not configured
   */
  async getGiftCatalog(): Promise<Gift[]> {
    // If API not configured, return mock gift catalog
    if (!this.isConfigured()) {
      return this.getMockGiftCatalog();
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/catalog`,
        { headers: this.getAuthHeaders() }
      );
      
      // Transform Sendoso API response to our Gift type
      return response.data.items?.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price || item.cost || 0,
        imageUrl: item.image_url || item.image,
        category: item.category,
        sendosoId: item.id,
      })) || [];
    } catch (error) {
      console.error('Sendoso API Error:', error);
      // Fallback to mock catalog on error
      return this.getMockGiftCatalog();
    }
  }

  /**
   * Send gift to recipients via Sendoso
   */
  async sendGift(
    gift: Gift,
    recipients: Person[],
    message?: string
  ): Promise<GiftOrder> {
    // If API not configured, simulate sending
    if (!this.isConfigured()) {
      return this.simulateGiftSending(gift, recipients, message);
    }

    try {
      const sendRequests = recipients.map((recipient) => ({
        gift_id: gift.sendosoId || gift.id,
        recipient: {
          name: recipient.fullName || `${recipient.firstName} ${recipient.lastName}`,
          email: recipient.email,
          phone: recipient.phone,
          address: recipient.address,
          city: '', // Would need to parse from address
          state: '', // Would need to parse from address
          zip: recipient.zipCode || '',
        },
        message: message || '',
        // Additional Sendoso-specific fields
      }));

      // Send all gifts in batch
      const response = await axios.post(
        `${this.baseUrl}/v1/sends/batch`,
        {
          sends: sendRequests,
        },
        { headers: this.getAuthHeaders() }
      );

      // Create order record
      const order: GiftOrder = {
        id: `order-${Date.now()}`,
        gift,
        recipients,
        message,
        totalPrice: gift.price * recipients.length,
        status: 'processing',
        createdAt: Date.now(),
        sendosoOrderId: response.data.order_id || response.data.id,
      };

      return order;
    } catch (error: any) {
      console.error('Sendoso Send Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send gifts');
    }
  }

  /**
   * Mock gift catalog for demo purposes
   */
  private getMockGiftCatalog(): Gift[] {
    return [
      {
        id: 'gift-1',
        name: 'Starbucks Gift Card',
        description: 'A thoughtful $10 Starbucks gift card for coffee lovers',
        price: 10.00,
        imageUrl: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Starbucks+Gift+Card',
        category: 'Food & Beverage',
      },
      {
        id: 'gift-2',
        name: 'Amazon Gift Card',
        description: 'Popular $25 Amazon gift card - let them choose their perfect gift',
        price: 25.00,
        imageUrl: 'https://via.placeholder.com/300x200/FF9900/FFFFFF?text=Amazon+Gift+Card',
        category: 'Retail',
      },
      {
        id: 'gift-3',
        name: 'Gourmet Coffee Box',
        description: 'Premium artisanal coffee selection delivered fresh',
        price: 35.00,
        imageUrl: 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Coffee+Box',
        category: 'Food & Beverage',
      },
      {
        id: 'gift-4',
        name: 'Custom Branded Notebook',
        description: 'Elegant leather-bound notebook with personalized message',
        price: 22.00,
        imageUrl: 'https://via.placeholder.com/300x200/4B5563/FFFFFF?text=Notebook',
        category: 'Office Supplies',
      },
      {
        id: 'gift-5',
        name: 'Plants & Flowers Delivery',
        description: 'Beautiful potted plant or fresh flower bouquet',
        price: 40.00,
        imageUrl: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Plants',
        category: 'Flowers',
      },
      {
        id: 'gift-6',
        name: 'Wine Selection',
        description: 'Curated wine selection from local vineyards',
        price: 50.00,
        imageUrl: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Wine',
        category: 'Food & Beverage',
      },
      {
        id: 'gift-7',
        name: 'Tech Accessories Kit',
        description: 'USB-C cables, wireless charger, and other essentials',
        price: 30.00,
        imageUrl: 'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Tech+Kit',
        category: 'Electronics',
      },
      {
        id: 'gift-8',
        name: 'Chocolate Gift Box',
        description: 'Premium artisan chocolates in elegant packaging',
        price: 28.00,
        imageUrl: 'https://via.placeholder.com/300x200/78350F/FFFFFF?text=Chocolate',
        category: 'Food & Beverage',
      },
    ];
  }

  /**
   * Simulate gift sending when API not configured
   */
  private async simulateGiftSending(
    gift: Gift,
    recipients: Person[],
    message?: string
  ): Promise<GiftOrder> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const order: GiftOrder = {
      id: `order-${Date.now()}`,
      gift,
      recipients,
      message,
      totalPrice: gift.price * recipients.length,
      status: 'sent',
      createdAt: Date.now(),
    };

    return order;
  }

  /**
   * Get order status from Sendoso
   */
  async getOrderStatus(orderId: string): Promise<string> {
    if (!this.isConfigured()) {
      return 'sent';
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/orders/${orderId}`,
        { headers: this.getAuthHeaders() }
      );
      
      return response.data.status || 'unknown';
    } catch (error) {
      console.error('Sendoso Get Order Status Error:', error);
      return 'unknown';
    }
  }
}

export const sendosoApi = new SendosoApiService();

