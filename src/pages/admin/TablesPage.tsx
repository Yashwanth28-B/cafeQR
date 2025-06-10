/*import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, QrCode, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Table {
  id: string;
  number: number;
  seats: number;
  status: "available" | "occupied" | "reserved" | "maintenance";
  qrCode: string;
}

const TablesPage = () => {
  const [tables, setTables] = useState<Table[]>([
    {
      id: "1",
      number: 1,
      seats: 4,
      status: "available",
      qrCode: "qr-table-1",
    },
    {
      id: "2",
      number: 2,
      seats: 2,
      status: "occupied",
      qrCode: "qr-table-2",
    },
    {
      id: "3",
      number: 3,
      seats: 6,
      status: "available",
      qrCode: "qr-table-3",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTable, setNewTable] = useState({
    number: "",
    seats: "",
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    const table: Table = {
      id: Date.now().toString(),
      number: parseInt(newTable.number),
      seats: parseInt(newTable.seats),
      status: "available",
      qrCode: `qr-table-${newTable.number}`,
    };

    setTables([...tables, table]);
    setNewTable({ number: "", seats: "" });
    setShowAddForm(false);
    toast({
      title: "Success",
      description: "Table added successfully",
    });
  };

  const updateTableStatus = (id: string, newStatus: Table["status"]) => {
    setTables(
      tables.map((table) =>
        table.id === id ? { ...table, status: newStatus } : table
      )
    );
    toast({
      title: "Success",
      description: "Table status updated",
    });
  };

  const deleteTable = (id: string) => {
    setTables(tables.filter((table) => table.id !== id));
    toast({
      title: "Success",
      description: "Table deleted successfully",
    });
  };

  const generateQRCode = (table: Table) => {
    // Simple QR code placeholder - shows the URL that would be encoded
    setSelectedTable(table);
    setShowQRModal(true);
    toast({
      title: "QR Code Generated",
      description: `QR code for Table ${table.number} is ready`,
    });
  };

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "default";
      case "occupied":
        return "destructive";
      case "reserved":
        return "secondary";
      case "maintenance":
        return "outline";
      default:
        return "default";
    }
  };

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
          <h1 className="text-3xl font-bold">Tables Management</h1>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Table</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTable} className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number">Table Number</Label>
                <Input
                  id="number"
                  type="number"
                  value={newTable.number}
                  onChange={(e) =>
                    setNewTable({ ...newTable, number: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="seats">Number of Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  value={newTable.seats}
                  onChange={(e) =>
                    setNewTable({ ...newTable, seats: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button type="submit">Add Table</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Card key={table.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Table {table.number}
                  </h3>
                  <p className="text-gray-600">{table.seats} seats</p>
                </div>
                <Badge variant={getStatusColor(table.status)}>
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={table.status}
                    onChange={(e) =>
                      updateTableStatus(
                        table.id,
                        e.target.value as Table["status"]
                      )
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => generateQRCode(table)}
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    QR Code
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTable(table.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      
      {showQRModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>QR Code for Table {selectedTable.number}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4 p-8 bg-gray-100 rounded-lg">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-sm text-gray-600">QR Code Placeholder</p>
                <p className="text-xs text-gray-500 mt-2">
                  URL: {window.location.origin}/menu/table-
                  {selectedTable.number}
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code to access the menu for Table{" "}
                {selectedTable.number}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setShowQRModal(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TablesPage;
*/
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, QrCode, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { tableAPI } from "@/services/api";

interface Table {
  _id: string;
  tableNumber: string;
  capacity: number;
  qrCode: string;
  status: "available" | "occupied" | "reserved" | "maintenance";
  currentSession?: string | null;
}

const TablesPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTable, setNewTable] = useState({ tableNumber: "", capacity: "" });
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      const response = await tableAPI.getTables();
      setTables(response.data as Table[]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load tables" });
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedCapacity = parseInt(newTable.capacity.trim(), 10);
      const formattedTableNumber = newTable.tableNumber.trim().toUpperCase(); // e.g., T01

      const newTablePayload = {
        tableNumber: formattedTableNumber,
        capacity: formattedCapacity,
        qrCode: `QR_${formattedTableNumber}`,
        status: "available",
      };

      const res = await tableAPI.createTable(newTablePayload);
      setTables([...tables, res.data]);
      setNewTable({ tableNumber: "", capacity: "" });
      setShowAddForm(false);
      toast({ title: "Success", description: "Table added successfully" });
    } catch (err) {
      console.error("Add table error:", err);
      toast({ title: "Error", description: "Failed to add table" });
    }
  };

  const deleteTable = async (id: string) => {
    try {
      await tableAPI.deleteTable(id);
      toast({ title: "Deleted", description: "Table deleted successfully" });
      fetchTables();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete table" });
    }
  };

  const generateQRCode = (table: Table) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "default";
      case "occupied":
        return "destructive";
      case "reserved":
        return "secondary";
      case "maintenance":
        return "outline";
      default:
        return "default";
    }
  };

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
          <h1 className="text-3xl font-bold">Tables Management</h1>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Table</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTable} className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tableNumber">Table Number (e.g. T01)</Label>
                <Input
                  id="tableNumber"
                  type="text"
                  value={newTable.tableNumber}
                  onChange={(e) =>
                    setNewTable({ ...newTable, tableNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacity">Number of Seats</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) =>
                    setNewTable({ ...newTable, capacity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button type="submit">Add Table</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Card key={table._id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Table {table.tableNumber}
                  </h3>
                  <p className="text-gray-600">{table.capacity} seats</p>
                </div>
                <Badge variant={getStatusColor(table.status)}>
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => generateQRCode(table)}
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    QR Code
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTable(table._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>
                QR Code for Table {selectedTable.tableNumber}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4 p-4 bg-white rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://localhost:8081/menu/${selectedTable._id}`}
                  alt="QR Code"
                  className="mx-auto"
                />
                <p className="text-xs text-gray-500 mt-2">
                  URL: http://localhost:8081/menu/{selectedTable._id}
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setShowQRModal(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TablesPage;
