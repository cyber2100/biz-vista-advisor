
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const BusinessAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [hasRegisteredBusiness, setHasRegisteredBusiness] = useState(false);
  const [businessData, setBusinessData] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [selectedTimeframe, setSelectedTimeframe] = useState("yearly");

  useEffect(() => {
    // Check if business is registered
    const savedBusinessData = localStorage.getItem("businessData");
    if (savedBusinessData) {
      setBusinessData(JSON.parse(savedBusinessData));
      setHasRegisteredBusiness(true);
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const revenueData = [
    { name: 'Jan', value: 4000, average: 3000 },
    { name: 'Feb', value: 3000, average: 3200 },
    { name: 'Mar', value: 2000, average: 3400 },
    { name: 'Apr', value: 2780, average: 3300 },
    { name: 'May', value: 1890, average: 3200 },
    { name: 'Jun', value: 2390, average: 3100 },
    { name: 'Jul', value: 3490, average: 3000 },
    { name: 'Aug', value: 4000, average: 3200 },
    { name: 'Sep', value: 4500, average: 3400 },
    { name: 'Oct', value: 5200, average: 3600 },
    { name: 'Nov', value: 5500, average: 3800 },
    { name: 'Dec', value: 6000, average: 4000 },
  ];

  const customerData = [
    { name: 'Jan', value: 400, average: 350 },
    { name: 'Feb', value: 430, average: 360 },
    { name: 'Mar', value: 450, average: 370 },
    { name: 'Apr', value: 470, average: 380 },
    { name: 'May', value: 540, average: 390 },
    { name: 'Jun', value: 580, average: 400 },
    { name: 'Jul', value: 600, average: 410 },
    { name: 'Aug', value: 700, average: 420 },
    { name: 'Sep', value: 800, average: 430 },
    { name: 'Oct', value: 850, average: 440 },
    { name: 'Nov', value: 900, average: 450 },
    { name: 'Dec', value: 950, average: 460 },
  ];

  const profitMarginData = [
    { name: 'Jan', value: 15, average: 12 },
    { name: 'Feb', value: 14, average: 12 },
    { name: 'Mar', value: 13, average: 12 },
    { name: 'Apr', value: 14, average: 12 },
    { name: 'May', value: 15, average: 13 },
    { name: 'Jun', value: 16, average: 13 },
    { name: 'Jul', value: 17, average: 13 },
    { name: 'Aug', value: 18, average: 14 },
    { name: 'Sep', value: 19, average: 14 },
    { name: 'Oct', value: 20, average: 14 },
    { name: 'Nov', value: 21, average: 15 },
    { name: 'Dec', value: 22, average: 15 },
  ];

  const marketShareData = [
    { name: 'Your Business', value: 15 },
    { name: 'Competitor A', value: 25 },
    { name: 'Competitor B', value: 20 },
    { name: 'Competitor C', value: 18 },
    { name: 'Others', value: 22 },
  ];
  
  // Get the selected data based on metric
  const getSelectedData = () => {
    switch (selectedMetric) {
      case 'revenue':
        return revenueData;
      case 'customers':
        return customerData;
      case 'profitMargin':
        return profitMarginData;
      default:
        return revenueData;
    }
  };
  
  // Get the title based on metric
  const getMetricTitle = () => {
    switch (selectedMetric) {
      case 'revenue':
        return 'Revenue';
      case 'customers':
        return 'Customer Growth';
      case 'profitMargin':
        return 'Profit Margin';
      default:
        return 'Revenue';
    }
  };
  
  // Get the unit based on metric
  const getMetricUnit = () => {
    switch (selectedMetric) {
      case 'revenue':
        return '$';
      case 'customers':
        return '';
      case 'profitMargin':
        return '%';
      default:
        return '';
    }
  };

  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Business Analytics</h1>
        <p className="text-gray-500 mb-6">
          Compare your business performance against industry averages and competitors.
        </p>

        {!hasRegisteredBusiness ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <h2 className="text-xl font-semibold mb-4">Register Your Business First</h2>
                <p className="mb-6 text-gray-600">
                  To access Business Analytics, please register your business details first.
                </p>
                <Button asChild>
                  <Link to="/app/register">Register Business</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="profitMargin">Profit Margin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="chart" className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="chart">Performance Chart</TabsTrigger>
                <TabsTrigger value="market">Market Share</TabsTrigger>
                <TabsTrigger value="comparison">Industry Comparison</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart">
                <Card>
                  <CardHeader>
                    <CardTitle>{getMetricTitle()} Performance</CardTitle>
                    <CardDescription>
                      Compare your {getMetricTitle().toLowerCase()} performance with industry average.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getSelectedData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`${getMetricUnit()}${value}`, '']}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            name="Your Business" 
                            dataKey="value" 
                            stroke="#38b2ac" 
                            activeDot={{ r: 8 }}
                            strokeWidth={3}
                          />
                          <Line 
                            type="monotone" 
                            name="Industry Average" 
                            dataKey="average" 
                            stroke="#1a365d" 
                            strokeWidth={2}
                            strokeDasharray="5 5" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="market">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Share Analysis</CardTitle>
                    <CardDescription>
                      See how your business compares in market share against competitors.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={marketShareData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                          <Legend />
                          <Bar dataKey="value" fill="#38b2ac" name="Market Share %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="comparison">
                <Card>
                  <CardHeader>
                    <CardTitle>Industry Benchmarking</CardTitle>
                    <CardDescription>
                      View detailed comparisons against industry standards for your business type.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold flex items-baseline">
                            12.3%
                            <span className="text-xs text-green-500 ml-2">+2.1% above average</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Industry average: 10.2%
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold flex items-baseline">
                            85%
                            <span className="text-xs text-green-500 ml-2">+7% above average</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Industry average: 78%
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Operating Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold flex items-baseline">
                            22.5%
                            <span className="text-xs text-green-500 ml-2">-1.5% below average</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Industry average: 24%
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Employee Productivity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold flex items-baseline">
                            $120K
                            <span className="text-xs text-green-500 ml-2">+$10K above average</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Revenue per employee
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold flex items-baseline">
                            3.5x
                            <span className="text-xs text-green-500 ml-2">+0.7x above average</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Return on marketing spend
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Digital Presence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold flex items-baseline">
                            78/100
                            <span className="text-xs text-red-500 ml-2">-5 below average</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Online visibility score
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessAnalyticsPage;
