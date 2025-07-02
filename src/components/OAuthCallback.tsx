
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesforceService } from '@/services/salesforceService';
import { useToast } from '@/hooks/use-toast';
import { Cloud } from 'lucide-react';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('Processing OAuth callback...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('OAuth callback page loaded');
        
        // Extract parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const instanceUrl = urlParams.get('instance_url') || 'https://login.salesforce.com';
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        // Handle OAuth errors
        if (error) {
          throw new Error(`OAuth Error: ${error} - ${errorDescription || 'Unknown error'}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Salesforce');
        }

        console.log('Extracted OAuth code, processing...');
        setStatus('Exchanging authorization code for access token...');

        // Exchange code for access token
        const success = await salesforceService.handleOAuthCallback(code, instanceUrl, state || undefined);

        if (success) {
          setStatus('Authentication successful! Redirecting to dashboard...');
          
          toast({
            title: "Successfully Connected!",
            description: "Your Salesforce org is now connected. You can now view and manage your data.",
          });

          // Short delay before redirect to show success message
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } else {
          throw new Error('Failed to exchange authorization code for access token');
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('Authentication failed');
        
        const errorMessage = error instanceof Error ? error.message : 'OAuth authentication failed';
        
        toast({
          title: "Authentication Failed",
          description: errorMessage,
          variant: "destructive",
        });

        // Redirect back to main app after error with longer delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 4000);
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
