/*import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderApi, tableApi, menuApi } from "../../services/api";
import Card from "../../components/UI/Card";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  Coffee,
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalRevenue: number;
  occupiedTables: number;
  popularItems: Array<{ name: string; count: number }>;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    occupiedTables: 0,
    popularItems: [],
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getAll(),
  });

  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: () => tableApi.getAll(),
  });

  const { data: menuItems } = useQuery({
    queryKey: ["menu"],
    queryFn: () => menuApi.getAll(),
  });

  useEffect(() => {
    if (orders?.data && tables?.data) {
      const allOrders = orders.data;
      const allTables = tables.data;

      const activeOrders = allOrders.filter(
        (order: any) => order.status === "active"
      );
      const completedOrders = allOrders.filter(
        (order: any) => order.status === "completed"
      );
      const totalRevenue = completedOrders.reduce(
        (sum: number, order: any) => sum + order.totalAmount,
        0
      );
      const occupiedTables = allTables.filter(
        (table: any) => table.status === "occupied"
      ).length;

      // Calculate popular items
      const itemCounts: { [key: string]: number } = {};
      allOrders.forEach((order: any) => {
        order.items.forEach((item: any) => {
          const itemName = item.menuItem?.name || "Unknown";
          itemCounts[itemName] = (itemCounts[itemName] || 0) + item.quantity;
        });
      });

      const popularItems = Object.entries(itemCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalOrders: allOrders.length,
        activeOrders: activeOrders.length,
        totalRevenue,
        occupiedTables,
        popularItems,
      });
    }
  }, [orders, tables]);

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: Clock,
      color: "bg-amber-500",
      change: "+5%",
    },
    {
      title: "Revenue Today",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
      change: "+18%",
    },
    {
      title: "Occupied Tables",
      value: stats.occupiedTables,
      icon: Users,
      color: "bg-purple-500",
      change: "60%",
    },
  ];

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to QR Café Dashboard
        </h1>
        <p className="text-amber-100">
          Here's an overview of your café's performance today
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Items
          </h3>
          <div className="space-y-3">
            {stats.popularItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Coffee className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-600">
                  {item.count} orders
                </span>
              </div>
            ))}
          </div>
        </Card>

        
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">View Active Orders</span>
                <span className="text-sm text-amber-600">
                  {stats.activeOrders} active
                </span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Manage Menu Items</span>
                <span className="text-sm text-gray-500">
                  {menuItems?.data?.length || 0} items
                </span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Table Management</span>
                <span className="text-sm text-purple-600">
                  {stats.occupiedTables} occupied
                </span>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
*/
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Coffee,
  Clock,
  CheckCircle,
} from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="/admin/menu">Manage Menu</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin/orders">View Orders</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin/tables">Manage Tables</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">$12,426</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Orders Today
                  </p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Tables
                  </p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth</p>
                  <p className="text-2xl font-bold">+23%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((order) => (
                  <div
                    key={order}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Coffee className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium">Order #{1000 + order}</p>
                        <p className="text-sm text-gray-600">Table {order}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          order <= 2
                            ? "default"
                            : order <= 4
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {order <= 2
                          ? "Preparing"
                          : order <= 4
                          ? "Ready"
                          : "Delivered"}
                      </Badge>
                      <span className="font-medium">
                        ${(15 + order * 5).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <a href="/admin/menu">
                  <Coffee className="mr-2 h-4 w-4" />
                  Add New Menu Item
                </a>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <a href="/admin/tables">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Tables
                </a>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <a href="/admin/orders">
                  <Clock className="mr-2 h-4 w-4" />
                  View Pending Orders
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Orders Complete
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
