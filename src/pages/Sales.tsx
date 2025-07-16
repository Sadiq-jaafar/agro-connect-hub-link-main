
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for the charts
const monthlySales = [
  { name: 'Jan', livestock: 4000, crops: 2400, services: 1800 },
  { name: 'Feb', livestock: 3000, crops: 1398, services: 2000 },
  { name: 'Mar', livestock: 2000, crops: 9800, services: 2200 },
  { name: 'Apr', livestock: 2780, crops: 3908, services: 2500 },
  { name: 'May', livestock: 1890, crops: 4800, services: 2300 },
  { name: 'Jun', livestock: 2390, crops: 3800, services: 2100 },
  { name: 'Jul', livestock: 3490, crops: 4300, services: 2400 },
  { name: 'Aug', livestock: 4000, crops: 2400, services: 1800 },
  { name: 'Sep', livestock: 3000, crops: 1398, services: 2000 },
  { name: 'Oct', livestock: 2000, crops: 9800, services: 2200 },
  { name: 'Nov', livestock: 2780, crops: 3908, services: 2500 },
  { name: 'Dec', livestock: 1890, crops: 4800, services: 2300 },
];

const categoryDistribution = [
  { name: 'Livestock', value: 45 },
  { name: 'Crops', value: 35 },
  { name: 'Services', value: 20 },
];

const COLORS = ['#4F7942', '#8B4513', '#2F5233'];

const Sales = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-agro-green-dark mb-4">Sales Dashboard</h1>
          <p className="text-gray-600 max-w-3xl">
            Monitor your agricultural business performance with real-time analytics and comprehensive sales reports.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Revenue</CardTitle>
              <CardDescription>Year-to-date earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-agro-green-dark">$245,680</div>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +14.5% from last year
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Profit Margin</CardTitle>
              <CardDescription>Average across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-agro-green-dark">32.8%</div>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +3.2% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Expenses</CardTitle>
              <CardDescription>Year-to-date operational costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-agro-green-dark">$165,240</div>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                +8.3% from last year
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="revenue" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="profit">Profit</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Breakdown by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="livestock" name="Livestock" fill="#4F7942" />
                      <Bar dataKey="crops" name="Crops" fill="#8B4513" />
                      <Bar dataKey="services" name="Services" fill="#2F5233" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profit" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Profit Distribution</CardTitle>
                <CardDescription>Percentage by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expenses" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Monthly expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="livestock" name="Operational" fill="#CD853F" />
                      <Bar dataKey="crops" name="Materials" fill="#8FBC8F" />
                      <Bar dataKey="services" name="Labor" fill="#D2B48C" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performers in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="font-medium">Product</div>
                  <div className="font-medium">Revenue</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-agro-green mr-2"></div>
                    <span>Organic Beef</span>
                  </div>
                  <div>$24,580</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-agro-green mr-2"></div>
                    <span>Free-Range Eggs</span>
                  </div>
                  <div>$18,230</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-agro-brown mr-2"></div>
                    <span>Organic Rice</span>
                  </div>
                  <div>$15,890</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-agro-brown mr-2"></div>
                    <span>Premium Soybeans</span>
                  </div>
                  <div>$12,450</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-agro-green-dark mr-2"></div>
                    <span>Tractor Rental Service</span>
                  </div>
                  <div>$10,780</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Last 5 sales activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="font-medium">Customer</div>
                  <div className="font-medium">Amount</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div>Farm Fresh Co.</div>
                    <div className="text-sm text-gray-500">May 21, 2025</div>
                  </div>
                  <div className="font-medium text-green-600">+$4,280</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div>Green Valley Farms</div>
                    <div className="text-sm text-gray-500">May 20, 2025</div>
                  </div>
                  <div className="font-medium text-green-600">+$3,850</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div>Sunrise Dairy</div>
                    <div className="text-sm text-gray-500">May 18, 2025</div>
                  </div>
                  <div className="font-medium text-green-600">+$2,740</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div>Harvest Supply Co.</div>
                    <div className="text-sm text-gray-500">May 17, 2025</div>
                  </div>
                  <div className="font-medium text-red-600">-$1,590</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div>Natural Foods Market</div>
                    <div className="text-sm text-gray-500">May 15, 2025</div>
                  </div>
                  <div className="font-medium text-green-600">+$5,230</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sales;
