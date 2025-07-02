
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesforceService } from '@/services/salesforceService';
import { useToast } from '@/hooks/use-toast';
import { Cloud } from 'lucide-react';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('OAuth callback page loaded');
        
        // Extract authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const instanceUrl = urlParams.get('instance_url') || 'https://login.salesforce.com';

        console.log('Extracted OAuth code:', code);

        if (!code) {
          throw new Error('No authorization code received');
        }

        setStatus('Authenticating with Salesforce...');

        // Exchange code for access token
        const success = await salesforceService.handleOAuthCallback(code, instanceUrl);

        if (success) {
          setStatus('Authentication successful! Redirecting...');
          toast({
            title: "Connection Successful",
            description: "Successfully connected to Salesforce via OAuth!",
          });

          // Redirect back to main app after short delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } else {
          throw new Error('OAuth authentication failed');
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('Authentication failed');
        
        toast({
          title: "Authentication Failed",
          description: error instanceof Error ? error.message : "OAuth authentication failed",
          variant: "destructive",
        });

        // Redirect back to main app after error
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="flex items-center justify-center mb-6">
          <Cloud className="h-12 w-12 text-blue-600 mr-3 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">OmniOut</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connecting to Salesforce</h2>
          <p className="text-gray-600">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
