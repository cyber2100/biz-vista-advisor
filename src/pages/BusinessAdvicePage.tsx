
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Lightbulb, CheckCircle, XCircle, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface AdviceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  implemented?: boolean;
}

const BusinessAdvicePage = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [hasRegisteredBusiness, setHasRegisteredBusiness] = useState(false);
  const [businessData, setBusinessData] = useState<any>(null);
  const [advice, setAdvice] = useState<AdviceItem[]>([]);
  const [filteredAdvice, setFilteredAdvice] = useState<AdviceItem[]>([]);
  
  useEffect(() => {
    // Check if business is registered
    const savedBusinessData = localStorage.getItem("businessData");
    if (savedBusinessData) {
      setBusinessData(JSON.parse(savedBusinessData));
      setHasRegisteredBusiness(true);
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      // Sample advice data
      const sampleAdvice = [
        {
          id: '1',
          title: 'Optimize your currency exchange strategy',
          description: 'Based on current exchange rate trends, consider purchasing EUR in the next 2-3 months as indicators suggest favorable movement against your base currency.',
          category: 'finance',
          impact: 'high',
          effort: 'medium',
        },
        {
          id: '2',
          title: 'Expand your digital marketing presence',
          description: 'Your industry analytics show below-average digital presence. Consider investing in SEO and content marketing to improve visibility and customer acquisition.',
          category: 'marketing',
          impact: 'high',
          effort: 'high',
        },
        {
          id: '3',
          title: 'Implement customer retention program',
          description: 'Your customer retention is above industry average, but implementing a loyalty program could further increase repeat business by an estimated 15%.',
          category: 'customer',
          impact: 'medium',
          effort: 'medium',
        },
        {
          id: '4',
          title: 'Review operational expenses',
          description: 'Your operational expenses are 1.5% below industry average. Continue monitoring supply chain costs which have shown volatility in recent months.',
          category: 'operations',
          impact: 'medium',
          effort: 'low',
        },
        {
          id: '5',
          title: 'Consider regional market expansion',
          description: 'Market analysis shows potential growth opportunities in neighboring regions with similar customer demographics to your current base.',
          category: 'growth',
          impact: 'high',
          effort: 'high',
        },
      ] as AdviceItem[];
      
      setAdvice(sampleAdvice);
      setFilteredAdvice(sampleAdvice);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filter advice based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAdvice(advice);
      return;
    }
    
    const filtered = advice.filter((item) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredAdvice(filtered);
  }, [searchQuery, advice]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === "") return;
    
    setQueryLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      toast.success("Search complete", {
        description: `Found ${filteredAdvice.length} results for "${searchQuery}"`,
      });
      setQueryLoading(false);
    }, 1500);
  };

  // Toggle implementation status
  const toggleImplemented = (id: string) => {
    setAdvice(prevAdvice => 
      prevAdvice.map(item => 
        item.id === id ? {...item, implemented: !item.implemented} : item
      )
    );
    
    // Also update filtered advice
    setFilteredAdvice(prevAdvice => 
      prevAdvice.map(item => 
        item.id === id ? {...item, implemented: !item.implemented} : item
      )
    );
    
    // Show toast
    const item = advice.find(item => item.id === id);
    if (item) {
      const isImplemented = !item.implemented;
      toast(
        isImplemented ? "Marked as implemented" : "Marked as not implemented", 
        {
          description: item.title,
        }
      );
    }
  };

  // Get impact color
  const getImpactColor = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Get effort color
  const getEffortColor = (effort: "high" | "medium" | "low") => {
    switch (effort) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Business Advice</h1>
        <p className="text-gray-500 mb-6">
          Get tailored recommendations to help your business grow and succeed.
        </p>

        {!hasRegisteredBusiness ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <h2 className="text-xl font-semibold mb-4">Register Your Business First</h2>
                <p className="mb-6 text-gray-600">
                  To receive personalized business advice, please register your business details first.
                </p>
                <Button asChild>
                  <Link to="/app/register">Register Business</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search for business advice..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={queryLoading || searchQuery.trim() === ""}>
                    {queryLoading ? "Searching..." : "Search"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Advice</TabsTrigger>
                <TabsTrigger value="implemented">Implemented</TabsTrigger>
                <TabsTrigger value="not-implemented">Not Implemented</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/4" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-8 w-28" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <>
                    {filteredAdvice.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No advice found</h3>
                        <p className="text-gray-500">
                          Try a different search query or check back later for more recommendations.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredAdvice.map((item) => (
                          <Card key={item.id} className={item.implemented ? "border-l-4 border-l-green-500" : ""}>
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg flex items-center">
                                    <Lightbulb className="h-5 w-5 mr-2 text-business-teal" />
                                    {item.title}
                                  </CardTitle>
                                  <CardDescription>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</CardDescription>
                                </div>
                                {item.implemented && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Implemented
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700">{item.description}</p>
                              <div className="flex flex-wrap gap-2 mt-4">
                                <Badge className={getImpactColor(item.impact)}>
                                  Impact: {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}
                                </Badge>
                                <Badge className={getEffortColor(item.effort)}>
                                  Effort: {item.effort.charAt(0).toUpperCase() + item.effort.slice(1)}
                                </Badge>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                              <Button 
                                variant={item.implemented ? "outline" : "default"}
                                className="ml-auto"
                                onClick={() => toggleImplemented(item.id)}
                              >
                                {item.implemented ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Mark as Not Implemented
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Implemented
                                  </>
                                )}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="implemented">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/4" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-8 w-28" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <>
                    {filteredAdvice.filter(item => item.implemented).length === 0 ? (
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No implemented advice yet</h3>
                        <p className="text-gray-500">
                          Start implementing business recommendations to track your progress here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredAdvice
                          .filter(item => item.implemented)
                          .map((item) => (
                            <Card key={item.id} className="border-l-4 border-l-green-500">
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg flex items-center">
                                      <Lightbulb className="h-5 w-5 mr-2 text-business-teal" />
                                      {item.title}
                                    </CardTitle>
                                    <CardDescription>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</CardDescription>
                                  </div>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Implemented
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-700">{item.description}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                  <Badge className={getImpactColor(item.impact)}>
                                    Impact: {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}
                                  </Badge>
                                  <Badge className={getEffortColor(item.effort)}>
                                    Effort: {item.effort.charAt(0).toUpperCase() + item.effort.slice(1)}
                                  </Badge>
                                </div>
                              </CardContent>
                              <CardFooter className="pt-0">
                                <Button 
                                  variant="outline"
                                  className="ml-auto"
                                  onClick={() => toggleImplemented(item.id)}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Mark as Not Implemented
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="not-implemented">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/4" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-8 w-28" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAdvice
                      .filter(item => !item.implemented)
                      .map((item) => (
                        <Card key={item.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                              <Lightbulb className="h-5 w-5 mr-2 text-business-teal" />
                              {item.title}
                            </CardTitle>
                            <CardDescription>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{item.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              <Badge className={getImpactColor(item.impact)}>
                                Impact: {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}
                              </Badge>
                              <Badge className={getEffortColor(item.effort)}>
                                Effort: {item.effort.charAt(0).toUpperCase() + item.effort.slice(1)}
                              </Badge>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button 
                              className="ml-auto"
                              onClick={() => toggleImplemented(item.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Implemented
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default BusinessAdvicePage;
