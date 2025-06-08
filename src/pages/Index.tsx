import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Menu, Clock, Star } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-800">QR Café</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/admin/login">Admin Login</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to QR Café
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience modern dining with our QR code ordering system. Scan,
          order, and enjoy your favorite coffee and meals with ease.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
            <QrCode className="mr-2 h-5 w-5" />
            Scan QR to Order
          </Button>
          <Button size="lg" variant="outline">
            <Menu className="mr-2 h-5 w-5" />
            View Menu
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Choose QR Café?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <QrCode className="h-12 w-12 text-amber-600 mb-4" />
              <CardTitle>Easy Ordering</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Simply scan the QR code at your table to access our digital menu
                and place your order instantly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-12 w-12 text-amber-600 mb-4" />
              <CardTitle>Fast Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Skip the wait! Your order goes directly to our kitchen, ensuring
                faster preparation and delivery.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-12 w-12 text-amber-600 mb-4" />
              <CardTitle>Premium Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We use only the finest ingredients to craft exceptional coffee
                and meals that exceed your expectations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sample Menu Preview */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">
            Featured Items
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg mb-2">
                  Signature Cappuccino
                </h4>
                <p className="text-gray-600 mb-4">
                  Rich espresso with perfectly steamed milk and artistic foam
                </p>
                <div className="text-xl font-bold text-amber-600">$3.50</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg mb-2">
                  Artisan Croissant
                </h4>
                <p className="text-gray-600 mb-4">
                  Freshly baked, buttery croissant with your choice of filling
                </p>
                <div className="text-xl font-bold text-amber-600">$4.25</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg mb-2">Gourmet Sandwich</h4>
                <p className="text-gray-600 mb-4">
                  Premium ingredients on artisan bread, made to order
                </p>
                <div className="text-xl font-bold text-amber-600">$8.95</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 QR Café. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            Experience the future of dining with our QR ordering system
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
