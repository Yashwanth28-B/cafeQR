import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { menuAPI } from "@/services/api";
import { useApi } from "@/hooks/useApi";

interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

const MenuManagementPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: menuItems,
    loading,
    refetch,
  } = useApi<MenuItem[]>(() => Promise.resolve(menuAPI.getItems()));

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item: MenuItem = {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category,
        isAvailable: true,
      };

      await menuAPI.createItem(item);
      setNewItem({ name: "", description: "", price: "", category: "" });
      setShowAddForm(false);
      refetch();
      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Failed to add menu item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?._id) return;

    try {
      const updatedItem = {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category,
        isAvailable: editingItem.isAvailable,
      };

      await menuAPI.updateItem(editingItem._id, updatedItem);
      setNewItem({ name: "", description: "", price: "", category: "" });
      setEditingItem(null);
      setShowAddForm(false);
      refetch();
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to update menu item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    if (!item._id) return;

    try {
      await menuAPI.updateItem(item._id, {
        ...item,
        isAvailable: !item.isAvailable,
      });
      refetch();
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast({
        title: "Error",
        description: "Failed to update item availability. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await menuAPI.deleteItem(id);
      refetch();
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
    });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({ name: "", description: "", price: "", category: "" });
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Menu Management</h1>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {editingItem ? "Cancel Edit" : "Add Item"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={editingItem ? handleEditItem : handleAddItem}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {menuItems?.map((item) => (
          <Card key={item._id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                      {item.isAvailable ? "Available" : "Out of Stock"}
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAvailability(item)}
                  >
                    {item.isAvailable ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => item._id && deleteItem(item._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!menuItems || menuItems.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">
              No menu items available. Add your first item!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuManagementPage;
