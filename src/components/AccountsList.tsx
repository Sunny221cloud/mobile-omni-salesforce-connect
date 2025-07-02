import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Building2, Plus, Phone, Globe, MapPin, Users, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { salesforceService, Account } from '@/services/salesforceService';

const AccountsList = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  // Form state for new account
  const [newAccount, setNewAccount] = useState({
    Name: '',
    Phone: '',
    Website: '',
    BillingStreet: '',
    BillingCity: '',
    BillingState: '',
    BillingPostalCode: '',
    BillingCountry: '',
    Industry: '',
    Type: 'Customer',
    NumberOfEmployees: 0
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      console.log('Fetching accounts...');
      const data = await salesforceService.getAccounts();
      setAccounts(data);
      console.log('Accounts fetched successfully:', data.length);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch accounts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAccount.Name.trim()) {
      toast({
        title: "Validation Error",
        description: "Account name is required",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    console.log('Attempting to create account:', newAccount);

    try {
      // Check authentication before creating
      if (!salesforceService.isAuthenticated()) {
        throw new Error('Not authenticated to Salesforce');
      }

      const accountId = await salesforceService.createAccount(newAccount);
      if (accountId) {
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        
        // Reset form
        setNewAccount({
          Name: '',
          Phone: '',
          Website: '',
          BillingStreet: '',
          BillingCity: '',
          BillingState: '',
          BillingPostalCode: '',
          BillingCountry: '',
          Industry: '',
          Type: 'Customer',
          NumberOfEmployees: 0
        });
        
        setIsSheetOpen(false);
        fetchAccounts(); // Refresh the list
        console.log('Account creation completed successfully');
      } else {
        throw new Error('Account creation returned null ID');
      }
    } catch (error) {
      console.error('Account creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setNewAccount(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accounts</h2>
          <p className="text-gray-600">Manage your Salesforce accounts</p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Account
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Create New Account
              </SheetTitle>
              <SheetDescription>
                Add a new account to your Salesforce organization
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleCreateAccount} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name *</Label>
                <Input
                  id="name"
                  value={newAccount.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  placeholder="Enter account name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newAccount.Phone}
                  onChange={(e) => handleInputChange('Phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={newAccount.Website}
                  onChange={(e) => handleInputChange('Website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={newAccount.Industry}
                  onChange={(e) => handleInputChange('Industry', e.target.value)}
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  value={newAccount.NumberOfEmployees}
                  onChange={(e) => handleInputChange('NumberOfEmployees', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Billing Street</Label>
                <Input
                  id="street"
                  value={newAccount.BillingStreet}
                  onChange={(e) => handleInputChange('BillingStreet', e.target.value)}
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newAccount.BillingCity}
                    onChange={(e) => handleInputChange('BillingCity', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newAccount.BillingState}
                    onChange={(e) => handleInputChange('BillingState', e.target.value)}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    value={newAccount.BillingPostalCode}
                    onChange={(e) => handleInputChange('BillingPostalCode', e.target.value)}
                    placeholder="12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={newAccount.BillingCountry}
                    onChange={(e) => handleInputChange('BillingCountry', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button type="submit" disabled={isCreating} className="w-full bg-blue-600 hover:bg-blue-700">
                  {isCreating ? 'Creating...' : 'Create Account'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)} className="w-full">
                  Cancel
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4">
        {accounts.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
              <p className="text-gray-600 mb-4">Create your first account to get started</p>
            </CardContent>
          </Card>
        ) : (
          accounts.map((account) => (
            <Card key={account.Id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      {account.Name}
                    </CardTitle>
                    {account.Industry && (
                      <Badge variant="secondary" className="mt-2">
                        {account.Industry}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {account.Phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {account.Phone}
                  </div>
                )}
                
                {account.Website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <a href={account.Website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {account.Website}
                    </a>
                  </div>
                )}

                {(account.BillingCity || account.BillingState) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {[account.BillingCity, account.BillingState, account.BillingCountry].filter(Boolean).join(', ')}
                  </div>
                )}

                {account.NumberOfEmployees > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {account.NumberOfEmployees} employees
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountsList;
