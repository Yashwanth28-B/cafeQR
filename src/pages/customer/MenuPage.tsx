/*import React, { useState } from "react";
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
  isAvailable: boolean;
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

  const { data: menuItems, loading } = useApi<MenuItem[]>(async () => {
    const res = await menuAPI.getItems();
    //console.log("Menu API response:", res);
    return res.data; // ✅ Extract only the actual data
  });

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
                .filter((item) => item.isAvailable)
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
*/
/*
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { menuAPI } from "@/services/api";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

const CustomerMenuPage = () => {
  const { data: menuItems, loading } = useApi<MenuItem[]>(() =>
    Promise.resolve(menuAPI.getItems())
  );

  if (loading) return <div className="p-6">Loading menu...</div>;

  const availableItems = menuItems?.filter((item) => item.isAvailable) || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
      <div className="grid gap-4">
        {availableItems.map((item) => (
          <Card key={item._id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <p className="text-lg font-bold">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            No menu items are currently available.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerMenuPage;
*/
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { menuAPI, orderAPI } from "@/services/api";
import { X } from "lucide-react";

const CustomerMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await menuAPI.getItems();
      const items = response.data as Array<{
        _id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        isAvailable: boolean;
      }>;
      setMenuItems(items.filter((item) => item.isAvailable));
    };
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((cartItem) => cartItem._id === item._id);
      if (existing) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };
  /*
  const placeOrder = async () => {
    const orderItems = cart.map(({ _id, name, price, quantity }) => ({
      itemId: _id,
      name,
      price,
      quantity,
    }));
    await orderAPI.createOrder({ table: 1, items: orderItems });
    setCart([]);
    setShowCart(false);
    alert("Order placed successfully!");
  };
*/

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      const orderPayload = {
        tableId: tableId, // from URL or useState
        customerName: "Guest",
        items: cart.map((item) => ({
          menuItem: item._id, // important: must match backend expectation
          quantity: item.quantity,
          notes: "", // optional
        })),
      };

      const response = await orderAPI.createOrder(orderPayload);
      alert("Order placed successfully!");
      console.log("Order Response:", response.data);

      setCart([]); // Clear cart
      setShowCart(false); // Hide cart
    } catch (error: any) {
      console.error("Order Error:", error.response?.data || error.message);
      alert(
        "Failed to place order: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <p className="text-lg font-bold">₹{item.price.toFixed(2)}</p>
                </div>
                <Button className="mt-4" onClick={() => addToCart(item)}>
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Cart Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full px-6 py-3 shadow-xl z-50"
        onClick={() => setShowCart(true)}
      >
        View Cart ({cart.length})
      </Button>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-lg p-6 z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <Button variant="ghost" onClick={() => setShowCart(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item._id} className="border-b pb-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      onClick={() => updateQuantity(item._id, -1)}
                      size="sm"
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      onClick={() => updateQuantity(item._id, 1)}
                      size="sm"
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => removeFromCart(item._id)}
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-xl font-bold">
                Total: ₹{totalPrice.toFixed(2)}
              </div>
              <Button className="mt-4 w-full" onClick={placeOrder}>
                Place Order
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerMenuPage;
