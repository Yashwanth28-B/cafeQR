import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, X, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "@/services/api";
import { useApi } from "@/hooks/useApi";

interface OrderItem {
  menuItem: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  customerName?: string;
  createdAt: string;
}

const OrdersPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: orders,
    loading,
    refetch,
  } = useApi<Order[]>(() => Promise.resolve(orderAPI.getOrders()));

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      await orderAPI.updateOrder(orderId, { status: newStatus });
      refetch();
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markAsDelivered = async (orderId: string) => {
    try {
      await orderAPI.markAsDelivered(orderId);
      refetch();
      toast({
        title: "Success",
        description: "Order marked as delivered",
      });
    } catch (error) {
      console.error("Error marking as delivered:", error);
      toast({
        title: "Error",
        description: "Failed to mark order as delivered. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "destructive";
      case "preparing":
        return "default";
      case "ready":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusActions = (order: Order) => {
    switch (order.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => updateOrderStatus(order._id, "preparing")}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateOrderStatus(order._id, "cancelled")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      case "preparing":
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order._id, "ready")}
          >
            Mark Ready
          </Button>
        );
      case "ready":
        return (
          <Button size="sm" onClick={() => markAsDelivered(order._id)}>
            <Check className="h-4 w-4" />
            Mark Delivered
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  const activeOrders =
    orders?.filter((order) =>
      ["pending", "preparing", "ready"].includes(order.status)
    ) || [];

  const completedOrders =
    orders?.filter((order) =>
      ["completed", "cancelled"].includes(order.status)
    ) || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Orders Management</h1>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Active Orders ({activeOrders.length})
          </h2>
          <div className="grid gap-4">
            {activeOrders.map((order) => (
              <Card key={order._id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <Badge>Table {order.tableNumber}</Badge>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleTimeString()}
                        {order.customerName && (
                          <span>• Customer: {order.customerName}</span>
                        )}
                      </div>
                    </div>
                    {getStatusActions(order)}
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span>
                          ${(item.quantity * item.menuItem.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-2 font-semibold text-right">
                    Total: ${order.total.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            ))}
            {activeOrders.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No active orders
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Recent Completed Orders
          </h2>
          <div className="grid gap-4">
            {completedOrders.slice(0, 5).map((order) => (
              <Card key={order._id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          Order #{order._id.slice(-6)}
                        </span>
                        <Badge>Table {order.tableNumber}</Badge>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleTimeString()} - $
                        {order.total.toFixed(2)}
                        {order.customerName && ` • ${order.customerName}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
