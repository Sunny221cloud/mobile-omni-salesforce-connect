
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Cloud, Lock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { salesforceService } from '@/services/salesforceService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [instanceUrl, setInstanceUrl] = useState('https://login.salesforce.com');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityToken, setSecurityToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOAuthLogin = () => {
    console.log('Starting OAuth flow...');
    setIsLoading(true);
    
    try {
      salesforceService.initiateOAuth();
    } catch (error) {
      console.error('OAuth initiation failed:', error);
      toast({
        title: "OAuth Error",
        description: "Failed to initiate OAuth flow. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await salesforceService.authenticate(username, password, instanceUrl, securityToken);
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Salesforce!",
        });
        onLogin();
        onClose();
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Failed to authenticate with Salesforce",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-600" />
            Connect to Salesforce
          </DialogTitle>
          <DialogDescription>
            Choose your preferred authentication method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* OAuth Login Button */}
          <div className="space-y-3">
            <Button 
              onClick={handleOAuthLogin} 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
            >
              {isLoading ? 'Connecting...' : 'Connect with OAuth (Recommended)'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Secure authentication using Salesforce OAuth
            </p>
          </div>

          <Separator />

          {/* Legacy Username/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Or use username/password (Legacy)</p>
            
            <div className="space-y-2">
              <Label htmlFor="instanceUrl" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Instance URL
              </Label>
              <Input
                id="instanceUrl"
                placeholder="https://yourcompany.salesforce.com"
                value={instanceUrl}
                onChange={(e) => setInstanceUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="email"
                placeholder="your.email@company.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityToken">Security Token</Label>
              <Input
                id="securityToken"
                placeholder="Your security token (optional)"
                value={securityToken}
                onChange={(e) => setSecurityToken(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Find this in your Salesforce personal settings under "Reset My Security Token"
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={isLoading} variant="outline" className="w-full">
                {isLoading ? 'Connecting...' : 'Connect with Username/Password'}
              </Button>
              
              <Button type="button" variant="outline" onClick={onClose} className="w-full">
                Cancel
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Setup Steps:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Log into your Salesforce org</li>
            <li>2. Go to Setup → Apps → Connected Apps</li>
            <li>3. Create a new Connected App with OAuth enabled</li>
            <li>4. Set the callback URL to: {window.location.origin}/oauth/callback</li>
            <li>5. Enable "Perform requests on your behalf at any time"</li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
