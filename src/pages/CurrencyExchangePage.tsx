
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

const CurrencyExchangePage = () => {
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading of currency data
    const timer = setTimeout(() => {
      // Mock currency data
      setCurrencies([
        {
          code: "USD",
          name: "US Dollar",
          rate: 1.0,
          change: 0.0,
          changePercent: 0.0,
        },
        {
          code: "EUR",
          name: "Euro",
          rate: 0.91,
          change: -0.002,
          changePercent: -0.22,
        },
        {
          code: "GBP",
          name: "British Pound",
          rate: 0.79,
          change: 0.004,
          changePercent: 0.51,
        },
        {
          code: "JPY",
          name: "Japanese Yen",
          rate: 149.52,
          change: 0.52,
          changePercent: 0.35,
        },
        {
          code: "CNY",
          name: "Chinese Yuan",
          rate: 7.25,
          change: -0.01,
          changePercent: -0.14,
        },
        {
          code: "AUD",
          name: "Australian Dollar",
          rate: 1.53,
          change: 0.01,
          changePercent: 0.65,
        },
        {
          code: "CAD",
          name: "Canadian Dollar",
          rate: 1.36,
          change: 0.003,
          changePercent: 0.22,
        },
        {
          code: "CHF",
          name: "Swiss Franc",
          rate: 0.89,
          change: -0.005,
          changePercent: -0.56,
        },
        {
          code: "HKD",
          name: "Hong Kong Dollar",
          rate: 7.82,
          change: 0.01,
          changePercent: 0.13,
        },
        {
          code: "SGD",
          name: "Singapore Dollar",
          rate: 1.35,
          change: -0.002,
          changePercent: -0.15,
        },
        {
          code: "INR",
          name: "Indian Rupee",
          rate: 83.37,
          change: 0.13,
          changePercent: 0.16,
        },
        {
          code: "DEM",
          name: "German Mark",
          rate: 1.95583,
          change: 0,
          changePercent: 0,
          historical: true,
        },
        {
          code: "FRF",
          name: "French Franc",
          rate: 6.55957,
          change: 0,
          changePercent: 0,
          historical: true,
        },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Currency Exchange Rates</h1>
        <p className="text-gray-500 mb-6">Monitor major world currencies in real-time to make informed financial decisions.</p>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {currencies
                .filter(currency => !currency.historical)
                .map((currency) => (
                <Card key={currency.code} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <span className="font-bold text-lg">{currency.code}</span>
                      <span className="ml-auto text-sm font-normal">1 USD =</span>
                    </CardTitle>
                    <CardDescription>{currency.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currency.rate.toFixed(2)}</div>
                    <div 
                      className={`flex items-center mt-1 text-sm ${
                        currency.changePercent > 0 
                          ? "text-green-600" 
                          : currency.changePercent < 0 
                          ? "text-red-600" 
                          : "text-gray-500"
                      }`}
                    >
                      {currency.changePercent > 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4" />
                      ) : currency.changePercent < 0 ? (
                        <TrendingDown className="mr-1 h-4 w-4" />
                      ) : null}
                      {currency.changePercent > 0 ? "+" : ""}{currency.changePercent.toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historical Currencies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currencies
                .filter(currency => currency.historical)
                .map((currency) => (
                <Card key={currency.code} className="shadow-sm bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <span className="font-bold text-lg">{currency.code}</span>
                      <span className="ml-auto text-sm font-normal">1 EUR =</span>
                    </CardTitle>
                    <CardDescription>{currency.name} (Historical)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currency.rate.toFixed(5)}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Fixed conversion rate
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CurrencyExchangePage;
