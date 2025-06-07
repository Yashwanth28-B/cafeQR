import React, { useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import { orderApi } from "../../services/api";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { X, Minus, Plus, ShoppingCart, QrCode } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface CartProps {
  tableId: string;
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ tableId, isOpen, onClose }) => {
  const { items, total, updateQuantity, removeItem, clearCart, updateNotes } =
    useCartStore();
  const [customerName, setCustomerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        tableId,
        customerName: customerName || "Guest",
        items: items.map((item) => ({
          menuItem: item.id,
          quantity: item.quantity,
          notes: item.notes || "",
        })),
      };

      await orderApi.create(orderData);

      toast({
        title: "Order placed successfully!",
        description: "Your order has been sent to the kitchen",
      });

      setShowPayment(true);
    } catch (error: any) {
      toast({
        title: "Failed to place order",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    clearCart();
    setShowPayment(false);
    onClose();

    toast({
      title: "Payment simulated!",
      description: "Thank you for your order. Your receipt has been generated.",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-lg sm:rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {showPayment ? (
          // Payment Screen
          <div className="p-6 text-center">
            <QrCode className="h-16 w-16 mx-auto mb-4 text-amber-600" />
            <h3 className="text-lg font-semibold mb-2">Scan to Pay</h3>
            <p className="text-gray-600 mb-4">Total: ${total.toFixed(2)}</p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                This is a demo QR code for payment simulation
              </p>
            </div>
            <Button onClick={handlePayment} className="w-full">
              Simulate Payment Complete
            </Button>
          </div>
        ) : (
          // Cart Screen
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Your Order
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <Input
                        placeholder="Special instructions (optional)"
                        value={item.notes || ""}
                        onChange={(e) => updateNotes(item.id, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <Input
                  placeholder="Your name (optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  isLoading={isLoading}
                  className="w-full"
                >
                  Place Order
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
