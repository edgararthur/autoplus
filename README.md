# AutoPlus - Auto Parts Marketplace

A comprehensive online marketplace for auto parts in Ghana, connecting dealers with buyers through a modern, feature-rich platform.

## Features

### Dealer Platform
- Dashboard with KPIs, quick actions, and performance metrics
- Product management (add, edit, inventory tracking)
- Order management and processing
- Financial tracking and reporting
- Shipping and logistics management
- Customer relationship management
- Analytics and reporting

### Buyer Application
- User account management
- Product browsing with advanced filters
- Shopping cart and checkout
- Order tracking
- Communication with dealers
- Reviews and ratings
- Wishlist functionality

### Admin Platform
- Marketplace moderation and management
- Dealer and buyer management
- Product moderation
- Category management
- Platform analytics
- Dispute resolution

## Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API, zustand
- **Backend**: Supabase (Database, Authentication, Storage, Functions)
- **Payment Processing**: MTN Mobile Money and Telecel Cash integration

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/autoplus.git
cd autoplus
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Create your database schema by running the SQL from `supabase/schema.sql` in the Supabase SQL editor

### 4. Configure environment variables

1. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

2. Update the environment variables with your Supabase credentials and other API keys:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_MTN_MOMO_API_KEY=your-mtn-momo-api-key
VITE_MTN_MOMO_USER_ID=your-mtn-momo-user-id
VITE_MTN_MOMO_API_URL=your-mtn-momo-api-url
VITE_TELECEL_CASH_API_KEY=your-telecel-cash-api-key
VITE_TELECEL_CASH_MERCHANT_ID=your-telecel-cash-merchant-id
VITE_TELECEL_CASH_API_URL=your-telecel-cash-api-url
```

### 5. Start the development server

```bash
npm run dev
```

The application should now be running at [http://localhost:5173](http://localhost:5173)

## Project Structure

```
autoplus/
├── src/                    # Source files
│   ├── assets/             # Static assets (images, fonts, etc.)
│   │   ├── common/         # Shared components (buttons, inputs, etc.)
│   │   ├── buyer/          # Buyer app specific components
│   │   ├── dealer/         # Dealer platform specific components
│   │   └── admin/          # Admin platform specific components
│   ├── contexts/           # React context providers
│   ├── layouts/            # Layout components for different sections
│   ├── pages/              # Page components
│   │   ├── landing/        # Landing pages
│   │   ├── auth/           # Authentication pages
│   │   ├── buyer/          # Buyer application pages
│   │   ├── dealer/         # Dealer platform pages
│   │   └── admin/          # Admin platform pages
│   ├── utils/              # Utility functions and services
│   │   ├── supabaseClient.js   # Supabase client configuration
│   │   ├── orderService.js     # Order management service
│   │   ├── productService.js   # Product management service
│   │   └── paymentService.js   # Payment processing service
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # Entry point
├── supabase/               # Supabase configuration
│   └── schema.sql          # Database schema definition
├── public/                 # Public assets
├── index.html              # HTML entry point
├── .env.example            # Example environment variables
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## Deployment

### Build for production

```bash
npm run build
```

This will create optimized production files in the `dist` directory.

### Deploy to hosting service

Deploy the contents of the `dist` directory to your preferred hosting service (Vercel, Netlify, etc.)

## Mobile Money Integration

The platform integrates with MTN Mobile Money and Telecel Cash for payment processing:

1. **MTN Mobile Money**: Uses the MTN MoMo API to process payments
2. **Telecel Cash**: Uses the Telecel Cash API for transaction processing

Refer to the respective API documentation for detailed integration steps and requirements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
