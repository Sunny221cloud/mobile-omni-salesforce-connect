
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Target, DollarSign, TrendingUp, Calendar, Activity } from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Contacts",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Leads",
      value: "156",
      change: "+8%",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Pipeline Value",
      value: "$847K",
      change: "+23%",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Conversion Rate",
      value: "24.5%",
      change: "+3%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const recentActivities = [
    { type: "Call", contact: "John Smith", time: "2 hours ago", status: "completed" },
    { type: "Email", contact: "Sarah Johnson", time: "4 hours ago", status: "sent" },
    { type: "Meeting", contact: "Mike Davis", time: "1 day ago", status: "completed" },
    { type: "Call", contact: "Lisa Wilson", time: "2 days ago", status: "missed" },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    {metric.change}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sales Pipeline */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sales Pipeline
          </CardTitle>
          <CardDescription>Current quarter progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Prospecting</span>
              <span>$234K (28%)</span>
            </div>
            <Progress value={28} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Qualification</span>
              <span>$189K (22%)</span>
            </div>
            <Progress value={22} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Proposal</span>
              <span>$312K (37%)</span>
            </div>
            <Progress value={37} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Closing</span>
              <span>$112K (13%)</span>
            </div>
            <Progress value={13} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          <CardDescription>Your latest interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.type} - {activity.contact}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <Badge 
                  variant={activity.status === 'completed' ? 'default' : activity.status === 'sent' ? 'secondary' : 'destructive'}
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <input type="checkbox" className="rounded" />
              <div className="flex-1">
                <p className="font-medium">Follow up with John Smith</p>
                <p className="text-sm text-gray-600">Scheduled call at 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <input type="checkbox" className="rounded" />
              <div className="flex-1">
                <p className="font-medium">Send proposal to ABC Corp</p>
                <p className="text-sm text-gray-600">Due today</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <input type="checkbox" className="rounded" />
              <div className="flex-1">
                <p className="font-medium">Update CRM records</p>
                <p className="text-sm text-gray-600">Weekly maintenance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
