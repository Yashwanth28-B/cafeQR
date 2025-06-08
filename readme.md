# QR Café - Full-Stack MERN Application

A comprehensive QR code-based café management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### Admin Panel

- 🔐 **Authentication**: Secure login/register system with JWT
- 📋 **Menu Management**: Complete CRUD operations for menu items
- 📊 **Order Management**: Real-time order tracking and status updates
- 🪑 **Table Management**: QR code generation and table status monitoring
- 📈 **Dashboard**: Analytics and performance metrics
- 🧾 **Receipt Generation**: Automated receipt creation with tax calculations

### Customer Interface

- 📱 **QR Code Access**: Scan table QR codes to access digital menu
- 🍽️ **Digital Menu**: Category-filtered, responsive menu display
- 🛒 **Shopping Cart**: Add items, customize quantities, and special instructions
- 💳 **Order Placement**: Seamless ordering with payment simulation
- ⏱️ **Order Tracking**: Real-time order status updates

## Technology Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **React Query** for server state management
- **Lucide React** for icons

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS** and **Helmet** for security

### DevOps & Deployment

- **Docker** for containerization
- **Kubernetes** for orchestration
- **GitHub Actions** for CI/CD
- **Prometheus** & **Grafana** for monitoring

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (provided connection string)
- Docker (optional, for containerization)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd qr-cafe
   ```

2. **Install dependencies**

   ```bash
   # Frontend dependencies
   npm install

   # Backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Configuration**

   ```bash
   # Backend environment (server/.env)
   PORT=5000
   MONGODB_URI=mongodb+srv://appuy8164:RqxOW1X2Z67DrebQ@cafeqr.crpmnjk.mongodb.net/?retryWrites=true&w=majority&appName=cafeqr
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Seed the database**

   ```bash
   cd server
   npm run seed
   ```

5. **Start development servers**

   ```bash
   # Terminal 1 - Backend server
   cd server
   npm run dev

   # Terminal 2 - Frontend server
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:5173/admin/login

### Default Credentials

- **Admin**: admin@qrcafe.com / admin123
- **Staff**: staff@qrcafe.com / staff123

## Database Collections Structure

### Users Collection

```json
{
  "_id": "ObjectId",
  "username": "admin",
  "email": "admin@qrcafe.com",
  "password": "hashed_password",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### MenuItems Collection

```json
{
  "_id": "ObjectId",
  "name": "Classic Burger",
  "description": "Juicy beef patty with lettuce, tomato, and our special sauce",
  "price": 12.99,
  "category": "main-course",
  "image": "/images/burger.jpg",
  "isAvailable": true,
  "preparationTime": 15,
  "ingredients": ["beef patty", "lettuce", "tomato", "cheese", "bun"],
  "allergens": ["gluten", "dairy"],
  "nutritionInfo": {
    "calories": 650,
    "protein": 25,
    "carbs": 45,
    "fat": 35
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Tables Collection

```json
{
  "_id": "ObjectId",
  "tableNumber": "T01",
  "qrCode": "QR_TABLE_1",
  "capacity": 4,
  "status": "available",
  "currentSession": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Orders Collection

```json
{
  "_id": "ObjectId",
  "tableId": "ObjectId",
  "customerName": "John Doe",
  "items": [
    {
      "menuItem": "ObjectId",
      "quantity": 2,
      "price": 12.99,
      "status": "pending",
      "notes": "No onions please"
    }
  ],
  "totalAmount": 25.98,
  "status": "active",
  "paymentStatus": "pending",
  "paymentMethod": "qr",
  "sessionStartTime": "2024-01-01T12:00:00.000Z",
  "sessionEndTime": null,
  "receipt": {
    "receiptNumber": "RCP-1704110400000",
    "generatedAt": "2024-01-01T13:00:00.000Z",
    "items": [...],
    "subtotal": 25.98,
    "tax": 2.60,
    "total": 28.58
  },
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T13:00:00.000Z"
}
```

## Docker Deployment

### Build and run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services included:

- **qr-cafe-app**: Main application (port 5000)
- **prometheus**: Metrics collection (port 9090)
- **grafana**: Monitoring dashboard (port 3000)
- **node-exporter**: System metrics (port 9100)

## Kubernetes Deployment

### Deploy to Kubernetes cluster

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n qr-cafe

# Check services
kubectl get services -n qr-cafe

# View logs
kubectl logs -f deployment/qr-cafe-app -n qr-cafe
```

## Monitoring

### Prometheus Metrics

- Application health and performance
- HTTP request metrics
- Database connection status
- Custom business metrics

### Grafana Dashboard

- Real-time application monitoring
- System resource usage
- Business intelligence dashboards
- Alert management

Access Grafana at http://localhost:3000 (admin/admin)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Menu Management

- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Orders

- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create new order
- `GET /api/orders/table/:tableId` - Get orders by table
- `POST /api/orders/:id/complete` - Complete order

### Tables

- `GET /api/tables` - Get all tables
- `GET /api/tables/qr/:qrCode` - Get table by QR code
- `POST /api/tables` - Create table (admin)

## Project Structure

```
qr-cafe/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # State management
│   └── hooks/             # Custom React hooks
├── server/                # Backend Node.js application
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── scripts/           # Utility scripts
├── k8s/                   # Kubernetes manifests
├── monitoring/            # Prometheus & Grafana config
├── .github/workflows/     # CI/CD pipelines
├── docker-compose.yml     # Docker Compose configuration
└── Dockerfile            # Container definition
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@qrcafe.com or create an issue in the repository.
