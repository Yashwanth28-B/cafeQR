import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { menuAPI, orderAPI } from "@/services/api";
import { useApi } from "@/hooks/useApi";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

const MenuPage = () => {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const { toast } = useToast();

  const { data: menuItems, loading } = useApi<MenuItem[]>(() =>
    Promise.resolve(menuAPI.getItems())
  );

  const tableNum = parseInt(tableNumber?.replace("table-", "") || "0");

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.menuItem._id === item._id
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.menuItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { menuItem: item, quantity: 1 }]);
    }

    toast({
      title: "Added to cart",
      description: `${item.name} added to cart`,
    });
  };

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.menuItem._id === itemId
    );

    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.menuItem._id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      setCart(cart.filter((cartItem) => cartItem.menuItem._id !== itemId));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setIsOrdering(true);
    try {
      const orderData = {
        tableNumber: tableNum,
        items: cart.map((item) => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
        })),
        total: getTotalPrice(),
        customerName: customerName || `Table ${tableNum}`,
      };

      await orderAPI.createOrder(orderData);

      toast({
        title: "Order placed successfully!",
        description: "Your order has been sent to the kitchen",
      });

      setCart([]);
      setShowCart(false);
      setCustomerName("");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  const groupedItems =
    menuItems?.reduce((acc: Record<string, MenuItem[]>, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {}) || {};

  if (loading) {
    return <div className="container mx-auto p-6">Loading menu...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">QR Cafe Menu</h1>
          <p className="text-gray-600">Table {tableNum}</p>
        </div>
        <Button onClick={() => setShowCart(!showCart)} className="relative">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart ({getTotalItems()})
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </div>

      {showCart && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div
                      key={item.menuItem._id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.menuItem.name}</h4>
                        <p className="text-sm text-gray-600">
                          ${item.menuItem.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.menuItem._id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-1 bg-gray-100 rounded">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(item.menuItem)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="ml-2 font-semibold">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold mb-4">
                    <span>Total: ${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <Button
                      onClick={placeOrder}
                      disabled={isOrdering}
                      className="w-full"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {isOrdering ? "Placing Order..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items
                .filter((item) => item.available)
                .map((item) => (
                  <Card key={item._id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className="text-lg font-bold text-green-600">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <Button
                        onClick={() => addToCart(item)}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedItems).length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">
              No menu items available at the moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuPage;
