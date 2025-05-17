
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, BarChart2, FileText, HelpCircle, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { BusinessTypeSelector } from "@/components/BusinessTypeSelector";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [hasRegisteredBusiness, setHasRegisteredBusiness] = useState(false);
  const [businessData, setBusinessData] = useState<any>(null);
  const [businessType, setBusinessType] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Check localStorage for business data
      const savedBusinessData = localStorage.getItem("businessData");
      if (savedBusinessData) {
        setBusinessData(JSON.parse(savedBusinessData));
        setHasRegisteredBusiness(true);
      }
      
      const savedBusinessType = localStorage.getItem("businessType");
      if (savedBusinessType) {
        setBusinessType(savedBusinessType);
      }
      
      setLoading(false);
      
      // Show welcome toast if we have business data
      if (savedBusinessData) {
        const data = JSON.parse(savedBusinessData);
        toast(`Welcome back to ${data.businessName}!`, {
          description: "Your business dashboard is ready.",
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const onSelectBusinessType = (type: string) => {
    setBusinessType(type);
    localStorage.setItem("businessType", type);
    toast.success(`Business type set to ${type}`);
  };

  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

        {!hasRegisteredBusiness && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-medium text-business-navy mb-4">
              Get Started with Business Vista Advisor
            </h2>
            {!businessType ? (
              <div>
                <p className="mb-6 text-gray-600">
                  Select your business type to get personalized insights and recommendations:
                </p>
                <BusinessTypeSelector onSelect={onSelectBusinessType} />
              </div>
            ) : (
              <div>
                <p className="mb-6 text-gray-600">
                  <span className="font-semibold">Selected business type:</span> {businessType}
                </p>
                <p className="mb-6 text-gray-600">
                  Now that you've selected your business type, register your business to access all features:
                </p>
                <Button asChild>
                  <Link to="/app/register">Register Your Business</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hasRegisteredBusiness ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,234.59</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  +4% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  +201 since last month
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`col-span-1 ${hasRegisteredBusiness ? "md:col-span-2" : "md:col-span-3"}`}>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/app/currency">
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-business-teal/10 flex items-center justify-center mb-3">
                    <Globe className="h-6 w-6 text-business-teal" />
                  </div>
                  <h3 className="font-medium text-business-navy text-center">Currency Exchange</h3>
                  <p className="text-xs text-gray-500 text-center mt-1">Track major world currencies</p>
                </div>
              </Link>
              <Link to="/app/analytics">
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-business-teal/10 flex items-center justify-center mb-3">
                    <BarChart2 className="h-6 w-6 text-business-teal" />
                  </div>
                  <h3 className="font-medium text-business-navy text-center">Business Analytics</h3>
                  <p className="text-xs text-gray-500 text-center mt-1">Compare performance metrics</p>
                </div>
              </Link>
              <Link to="/app/advice">
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-business-teal/10 flex items-center justify-center mb-3">
                    <HelpCircle className="h-6 w-6 text-business-teal" />
                  </div>
                  <h3 className="font-medium text-business-navy text-center">Business Advice</h3>
                  <p className="text-xs text-gray-500 text-center mt-1">Get strategic recommendations</p>
                </div>
              </Link>
            </div>
          </div>
          
          {hasRegisteredBusiness && (
            <div className="col-span-1">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Business</h2>
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">{businessData.businessName}</h3>
                    <p className="text-sm text-gray-500">{businessType}</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Founded</p>
                      <p className="text-sm text-gray-500">{businessData.foundationDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">CEO</p>
                      <p className="text-sm text-gray-500">{businessData.ceo}</p>
                    </div>
                    {businessData.website && (
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a 
                          href={businessData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-business-teal hover:underline"
                        >
                          {businessData.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
