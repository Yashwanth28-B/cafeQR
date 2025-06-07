import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { menuApi, tableApi } from "../../services/api";
import { useCartStore } from "../../store/useCartStore";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Cart from "../../components/Customer/Cart";
import { Plus, Star, Clock, AlertCircle } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

const MenuPage = () => {
  const { tableId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCart, setShowCart] = useState(false);
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: () => menuApi.getAll({ available: true }),
  });

  const { data: table } = useQuery({
    queryKey: ["table", tableId],
    queryFn: () => tableApi.getById(tableId!),
    enabled: !!tableId,
  });

  const categories = [
    { id: "all", name: "All Items" },
    { id: "appetizers", name: "Appetizers" },
    { id: "main-course", name: "Main Course" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
    { id: "specials", name: "Specials" },
  ];

  const filteredItems =
    menuItems?.data?.filter(
      (item: any) =>
        selectedCategory === "all" || item.category === selectedCategory
    ) || [];

  const handleAddToCart = (item: any) => {
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Table Info */}
      {table?.data && (
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to QR Café
              </h1>
              <p className="text-gray-600">Table: {table.data.tableNumber}</p>
            </div>
            <Button onClick={() => setShowCart(true)}>View Cart</Button>
          </div>
        </Card>
      )}

      {/* Category Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-amber-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item: any) => (
          <Card key={item._id} className="hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={item.image || "/api/placeholder/300/200"}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {item.preparationTime} min
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                4.5
              </div>
            </div>

            {item.allergens && item.allergens.length > 0 && (
              <div className="flex items-center mb-3 text-xs text-orange-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                Contains: {item.allergens.join(", ")}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-amber-600">
                ${item.price.toFixed(2)}
              </span>
              <Button
                size="sm"
                onClick={() => handleAddToCart(item)}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items available in this category.</p>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <Cart
          tableId={tableId!}
          isOpen={showCart}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
};

export default MenuPage;
