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
  
  // Salesforce Connected App Configuration
  // IMPORTANT: Replace these with your actual Connected App credentials
  private readonly CLIENT_ID = '3MVG9_XwsqGbNStkOr4KvWCHnB7yTlXm6vF_G5N8k7X8vKqWn.y2YrKs8Y_kDq8K9Y8HnqP9KN6mT8Y_kDq8K9';  // Replace with your Consumer Key
  private readonly CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';  // Replace with your Consumer Secret
  private readonly REDIRECT_URI = `${window.location.origin}/oauth/callback`;
  private readonly LOGIN_URL = 'https://login.salesforce.com';  // Use https://test.salesforce.com for sandbox

  constructor() {
    this.loadStoredConfig();
  }

  private loadStoredConfig(): void {
    try {
      const storedConfig = localStorage.getItem('sf_config');
      if (storedConfig) {
        this.config = JSON.parse(storedConfig);
        console.log('Loaded stored Salesforce config');
      }
    } catch (error) {
      console.error('Error loading stored config:', error);
      localStorage.removeItem('sf_config');
    }
  }

  initiateOAuth(): void {
    console.log('Initiating OAuth flow...');
    
    if (this.CLIENT_ID.includes('YOUR_CLIENT_ID') || this.CLIENT_SECRET.includes('YOUR_CLIENT_SECRET')) {
      throw new Error('Please configure your Salesforce Connected App credentials in salesforceService.ts');
    }
    
    const scope = encodeURIComponent('api refresh_token id');
    const state = encodeURIComponent(Math.random().toString(36).substring(7));
    
    // Store state for validation
    localStorage.setItem('oauth_state', state);
    
    const oauthUrl = `${this.LOGIN_URL}/services/oauth2/authorize?response_type=code&client_id=${this.CLIENT_ID}&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&scope=${scope}&state=${state}`;
    
    console.log('Redirecting to OAuth URL...');
    window.location.href = oauthUrl;
  }

  async handleOAuthCallback(code: string, instanceUrl: string, state?: string): Promise<boolean> {
    try {
      console.log('Handling OAuth callback...');
      
      // Validate state parameter
      const storedState = localStorage.getItem('oauth_state');
      if (state && storedState && state !== storedState) {
        throw new Error('Invalid OAuth state parameter');
      }
      localStorage.removeItem('oauth_state');
      
      if (this.CLIENT_ID.includes('YOUR_CLIENT_ID') || this.CLIENT_SECRET.includes('YOUR_CLIENT_SECRET')) {
        throw new Error('Please configure your Salesforce Connected App credentials');
      }

      // Prepare token exchange request
      const tokenData = new URLSearchParams();
      tokenData.append('grant_type', 'authorization_code');
      tokenData.append('client_id', this.CLIENT_ID);
      tokenData.append('client_secret', this.CLIENT_SECRET);
      tokenData.append('redirect_uri', this.REDIRECT_URI);
      tokenData.append('code', code);

      console.log('Exchanging code for access token...');
      
      const tokenResponse = await axios.post(
        `${this.LOGIN_URL}/services/oauth2/token`,
        tokenData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Token exchange successful');

      // Store the configuration
      this.config = {
        instanceUrl: tokenResponse.data.instance_url,
        accessToken: tokenResponse.data.access_token,
        apiVersion: 'v58.0'
      };

      // Persist to localStorage
      localStorage.setItem('sf_config', JSON.stringify(this.config));
      console.log('OAuth authentication successful');
      
      return true;
    } catch (error) {
      console.error('OAuth callback failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Token exchange error:', error.response?.data);
      }
      return false;
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

      // Prepare the account data for Salesforce API
      const salesforceAccountData = {
        Name: accountData.Name,
        Phone: accountData.Phone,
        Website: accountData.Website,
        BillingStreet: accountData.BillingStreet,
        BillingCity: accountData.BillingCity,
        BillingState: accountData.BillingState,
        BillingPostalCode: accountData.BillingPostalCode,
        BillingCountry: accountData.BillingCountry,
        Industry: accountData.Industry,
        Type: accountData.Type,
        NumberOfEmployees: accountData.NumberOfEmployees
      };

      console.log('Sending API request to create account...');
      
      // Make the actual API call to Salesforce
      const response = await axios.post(
        this.getApiUrl('/sobjects/Account/'),
        salesforceAccountData,
        { headers: this.getHeaders() }
      );

      console.log('Account created successfully:', response.data);
      return response.data.id;
      
    } catch (error) {
      console.error('Failed to create account:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error details:', error.response?.data);
        throw new Error(`Salesforce API Error: ${error.response?.data?.message || error.message}`);
      }
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

      const query = `SELECT Id, Name, Phone, Website, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, Industry, Type, NumberOfEmployees FROM Account LIMIT ${limit}`;
      
      const response = await axios.get(
        this.getApiUrl(`/query/?q=${encodeURIComponent(query)}`),
        { headers: this.getHeaders() }
      );
      
      console.log('Accounts fetched successfully:', response.data.records.length);
      return response.data.records;
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
    const authenticated = this.config !== null && this.config.accessToken !== null;
    console.log('Authentication check:', authenticated);
    return authenticated;
  }

  logout(): void {
    console.log('Logging out...');
    this.config = null;
    localStorage.removeItem('sf_config');
    localStorage.removeItem('oauth_state');
  }

  // Utility method to get current user info
  async getCurrentUser(): Promise<any> {
    try {
      if (!this.config) {
        throw new Error('Not authenticated');
      }

      const response = await axios.get(
        this.getApiUrl('/sobjects/User/' + await this.getUserId()),
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  private async getUserId(): Promise<string> {
    try {
      const response = await axios.get(
        `${this.config?.instanceUrl}/services/oauth2/userinfo`,
        { headers: this.getHeaders() }
      );
      return response.data.user_id;
    } catch (error) {
      console.error('Failed to get user ID:', error);
      throw error;
    }
  }
}

export const salesforceService = new SalesforceService();
