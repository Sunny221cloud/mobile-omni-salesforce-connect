
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Search, DollarSign, Calendar, Target, Plus, Filter, TrendingUp } from 'lucide-react';

const LeadsList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const leads = [
    {
      id: 1,
      name: "ABC Corporation",
      contact: "Jennifer Adams",
      value: 125000,
      stage: "Proposal",
      probability: 75,
      closeDate: "2024-08-15",
      source: "Website",
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      name: "XYZ Industries",
      contact: "Robert Chen",
      value: 85000,
      stage: "Qualification",
      probability: 40,
      closeDate: "2024-09-01",
      source: "Referral",
      lastActivity: "1 day ago"
    },
    {
      id: 3,
      name: "Tech Innovations Ltd",
      contact: "Maria Garcia",
      value: 200000,
      stage: "Negotiation",
      probability: 85,
      closeDate: "2024-07-30",
      source: "Cold Call",
      lastActivity: "3 hours ago"
    },
    {
      id: 4,
      name: "Global Services Inc",
      contact: "James Wilson",
      value: 95000,
      stage: "Discovery",
      probability: 25,
      closeDate: "2024-09-15",
      source: "Trade Show",
      lastActivity: "5 days ago"
    },
    {
      id: 5,
      name: "Future Systems",
      contact: "Anna Rodriguez",
      value: 150000,
      stage: "Proposal",
      probability: 60,
      closeDate: "2024-08-22",
      source: "LinkedIn",
      lastActivity: "Yesterday"
    }
  ];

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Discovery': return 'bg-blue-100 text-blue-800';
      case 'Qualification': return 'bg-yellow-100 text-yellow-800';
      case 'Proposal': return 'bg-orange-100 text-orange-800';
      case 'Negotiation': return 'bg-purple-100 text-purple-800';
      case 'Closed Won': return 'bg-green-100 text-green-800';
      case 'Closed Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalPipelineValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const avgDealSize = totalPipelineValue / leads.length;

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(totalPipelineValue)}</p>
                <p className="text-sm text-gray-600">Total Pipeline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(avgDealSize)}</p>
                <p className="text-sm text-gray-600">Avg Deal Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-purple-100 text-purple-600 font-medium">
                    {getInitials(lead.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{lead.name}</h3>
                    <Badge className={getStageColor(lead.stage)}>
                      {lead.stage}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">Contact: {lead.contact}</p>
                  <p className="text-xs text-gray-500 mb-3">Last activity: {lead.lastActivity}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{formatCurrency(lead.value)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{lead.closeDate}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Probability</span>
                        <span>{lead.probability}%</span>
                      </div>
                      <Progress value={lead.probability} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Source: {lead.source}</span>
                      <Badge variant="outline" className="text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        Lead
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Update Stage
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Add Activity
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No leads found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
