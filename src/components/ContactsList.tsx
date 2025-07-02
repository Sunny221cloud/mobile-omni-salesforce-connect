
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Phone, Mail, MapPin, Plus, Filter } from 'lucide-react';

const ContactsList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const contacts = [
    {
      id: 1,
      name: "John Smith",
      title: "CEO",
      company: "Tech Solutions Inc.",
      email: "john.smith@techsolutions.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      status: "hot",
      lastContact: "2 days ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      title: "Marketing Director",
      company: "Global Marketing Co.",
      email: "sarah.j@globalmarketing.com",
      phone: "+1 (555) 234-5678",
      location: "Los Angeles, CA",
      status: "warm",
      lastContact: "1 week ago"
    },
    {
      id: 3,
      name: "Mike Davis",
      title: "IT Manager",
      company: "Enterprise Systems",
      email: "mike.davis@enterprise.com",
      phone: "+1 (555) 345-6789",
      location: "Chicago, IL",
      status: "cold",
      lastContact: "3 weeks ago"
    },
    {
      id: 4,
      name: "Lisa Wilson",
      title: "Sales Manager",
      company: "Retail Solutions",
      email: "lisa.wilson@retailsolutions.com",
      phone: "+1 (555) 456-7890",
      location: "Miami, FL",
      status: "hot",
      lastContact: "Yesterday"
    },
    {
      id: 5,
      name: "David Brown",
      title: "Operations Director",
      company: "Manufacturing Corp",
      email: "david.brown@manufacturing.com",
      phone: "+1 (555) 567-8901",
      location: "Detroit, MI",
      status: "warm",
      lastContact: "4 days ago"
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
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

      {/* Contacts Summary */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-600">{contacts.filter(c => c.status === 'hot').length}</p>
              <p className="text-sm text-gray-600">Hot Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{contacts.filter(c => c.status === 'warm').length}</p>
              <p className="text-sm text-gray-600">Warm Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{contacts.filter(c => c.status === 'cold').length}</p>
              <p className="text-sm text-gray-600">Cold Leads</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{contact.title} at {contact.company}</p>
                  <p className="text-xs text-gray-500 mb-3">Last contact: {contact.lastContact}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{contact.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No contacts found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ContactsList;
