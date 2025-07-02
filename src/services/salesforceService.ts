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
    this.loadStoredConfig();
  }

  private loadStoredConfig(): void {
    try {
      const storedConfig = localStorage.getItem('sf_config');
      if (storedConfig) {
        this.config = JSON.parse(storedConfig);
        console.log('Loaded stored Salesforce config:', this.config ? 'Config found' : 'No config');
      }
    } catch (error) {
      console.error('Error loading stored config:', error);
      localStorage.removeItem('sf_config');
    }
  }

  async authenticate(username: string, password: string, instanceUrl: string, securityToken?: string): Promise<boolean> {
    try {
      console.log('Attempting to authenticate with Salesforce...');
      
      // For demo purposes, we'll simulate authentication
      // In production, replace with actual Salesforce OAuth flow
      if (username && password && instanceUrl) {
        this.config = {
          instanceUrl: instanceUrl,
          accessToken: 'demo_access_token_' + Date.now(),
          apiVersion: 'v58.0'
        };

        // Store config for persistence
        localStorage.setItem('sf_config', JSON.stringify(this.config));
        console.log('Authentication successful (demo mode)');
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
      console.error('Service not authenticated - config is null');
      throw new Error('Not authenticated');
    }
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  private getApiUrl(endpoint: string): string {
    if (!this.config) {
      console.error('Service not authenticated - config is null');
      throw new Error('Not authenticated');
    }
    return `${this.config.instanceUrl}/services/data/v${this.config.apiVersion}${endpoint}`;
  }

  async createAccount(accountData: Partial<Account>): Promise<string | null> {
    try {
      console.log('Creating account with data:', accountData);
      console.log('Current config:', this.config ? 'Config exists' : 'No config');
      
      if (!this.config) {
        console.error('Cannot create account - not authenticated');
        throw new Error('Not authenticated');
      }

      // For demo purposes, simulate account creation
      // In production, replace with actual Salesforce API call
      const mockAccountId = 'demo_account_' + Date.now();
      console.log('Account created successfully (demo mode):', mockAccountId);
      return mockAccountId;
      
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  }

  async getAccounts(limit: number = 50): Promise<Account[]> {
    try {
      console.log('Fetching accounts...');
      
      if (!this.config) {
        console.log('Not authenticated, returning empty accounts array');
        return [];
      }

      // For demo purposes, return mock data
      // In production, replace with actual Salesforce API call
      const mockAccounts: Account[] = [
        {
          Id: 'demo_001',
          Name: 'Demo Company Inc.',
          Phone: '+1-555-0123',
          Website: 'https://democompany.com',
          BillingStreet: '123 Main St',
          BillingCity: 'San Francisco',
          BillingState: 'CA',
          BillingPostalCode: '94105',
          BillingCountry: 'USA',
          Industry: 'Technology',
          Type: 'Customer',
          NumberOfEmployees: 150
        }
      ];
      
      console.log('Returning mock accounts:', mockAccounts.length);
      return mockAccounts;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      return [];
    }
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

  isAuthenticated(): boolean {
    const authenticated = this.config !== null;
    console.log('Authentication check:', authenticated);
    return authenticated;
  }

  logout(): void {
    console.log('Logging out...');
    this.config = null;
    localStorage.removeItem('sf_config');
  }
}

export const salesforceService = new SalesforceService();
