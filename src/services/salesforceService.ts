
import axios from 'axios';

export interface SalesforceConfig {
  instanceUrl: string;
  accessToken: string;
  apiVersion: string;
}

export interface Contact {
  Id: string;
  Name: string;
  Email: string;
  Phone: string;
  Title: string;
  Account?: {
    Name: string;
  };
}

export interface Lead {
  Id: string;
  Name: string;
  Company: string;
  Email: string;
  Phone: string;
  Status: string;
  LeadSource: string;
}

export interface Account {
  Id: string;
  Name: string;
  Phone: string;
  Website: string;
  BillingStreet: string;
  BillingCity: string;
  BillingState: string;
  BillingPostalCode: string;
  BillingCountry: string;
  Industry: string;
  Type: string;
  NumberOfEmployees: number;
}

export interface Opportunity {
  Id: string;
  Name: string;
  Amount: number;
  StageName: string;
  Probability: number;
  CloseDate: string;
  Account?: {
    Name: string;
  };
}

class SalesforceService {
  private config: SalesforceConfig | null = null;

  constructor() {
    // Initialize with stored config if available
    const storedConfig = localStorage.getItem('sf_config');
    if (storedConfig) {
      this.config = JSON.parse(storedConfig);
    }
  }

  async authenticate(username: string, password: string, instanceUrl: string, securityToken?: string): Promise<boolean> {
    try {
      const loginUrl = `${instanceUrl}/services/oauth2/token`;
      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: 'YOUR_CONNECTED_APP_CLIENT_ID', // Replace with actual client ID
        client_secret: 'YOUR_CONNECTED_APP_CLIENT_SECRET', // Replace with actual client secret
        username: username,
        password: password + (securityToken || '')
      });

      const response = await axios.post(loginUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.access_token) {
        this.config = {
          instanceUrl: response.data.instance_url,
          accessToken: response.data.access_token,
          apiVersion: 'v58.0'
        };

        // Store config for persistence
        localStorage.setItem('sf_config', JSON.stringify(this.config));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  private getHeaders() {
    if (!this.config) {
      throw new Error('Not authenticated');
    }
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  private getApiUrl(endpoint: string): string {
    if (!this.config) {
      throw new Error('Not authenticated');
    }
    return `${this.config.instanceUrl}/services/data/v${this.config.apiVersion}${endpoint}`;
  }

  async getContacts(limit: number = 50): Promise<Contact[]> {
    try {
      const query = `SELECT Id, Name, Email, Phone, Title, Account.Name FROM Contact LIMIT ${limit}`;
      const response = await axios.get(
        this.getApiUrl(`/query/?q=${encodeURIComponent(query)}`),
        { headers: this.getHeaders() }
      );
      return response.data.records;
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      return [];
    }
  }

  async getLeads(limit: number = 50): Promise<Lead[]> {
    try {
      const query = `SELECT Id, Name, Company, Email, Phone, Status, LeadSource FROM Lead WHERE IsConverted = false LIMIT ${limit}`;
      const response = await axios.get(
        this.getApiUrl(`/query/?q=${encodeURIComponent(query)}`),
        { headers: this.getHeaders() }
      );
      return response.data.records;
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      return [];
    }
  }

  async getAccounts(limit: number = 50): Promise<Account[]> {
    try {
      const query = `SELECT Id, Name, Phone, Website, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, Industry, Type, NumberOfEmployees FROM Account LIMIT ${limit}`;
      const response = await axios.get(
        this.getApiUrl(`/query/?q=${encodeURIComponent(query)}`),
        { headers: this.getHeaders() }
      );
      return response.data.records;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      return [];
    }
  }

  async createAccount(accountData: Partial<Account>): Promise<string | null> {
    try {
      const response = await axios.post(
        this.getApiUrl('/sobjects/Account/'),
        accountData,
        { headers: this.getHeaders() }
      );
      return response.data.id;
    } catch (error) {
      console.error('Failed to create account:', error);
      return null;
    }
  }

  async getOpportunities(limit: number = 50): Promise<Opportunity[]> {
    try {
      const query = `SELECT Id, Name, Amount, StageName, Probability, CloseDate, Account.Name FROM Opportunity WHERE IsClosed = false LIMIT ${limit}`;
      const response = await axios.get(
        this.getApiUrl(`/query/?q=${encodeURIComponent(query)}`),
        { headers: this.getHeaders() }
      );
      return response.data.records;
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
      return [];
    }
  }

  async createLead(leadData: Partial<Lead>): Promise<string | null> {
    try {
      const response = await axios.post(
        this.getApiUrl('/sobjects/Lead/'),
        leadData,
        { headers: this.getHeaders() }
      );
      return response.data.id;
    } catch (error) {
      console.error('Failed to create lead:', error);
      return null;
    }
  }

  async updateContact(contactId: string, contactData: Partial<Contact>): Promise<boolean> {
    try {
      await axios.patch(
        this.getApiUrl(`/sobjects/Contact/${contactId}`),
        contactData,
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Failed to update contact:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.config !== null;
  }

  logout(): void {
    this.config = null;
    localStorage.removeItem('sf_config');
  }
}

export const salesforceService = new SalesforceService();
