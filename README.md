# FarmDirect — Direct Farmer-to-Buyer Agricultural Marketplace

FarmDirect is a modern agricultural commerce platform designed to eliminate exploitative intermediary markups by connecting farmers directly with household consumers, restaurants, and bulk institutional buyers. 

The platform guarantees price transparency, provides real-time AGMARKNET APMC mandi price benchmarks, delivers agro-meteorological advisories, manages cold-chain logistics, and provides AI-driven crop harvest and pricing guidance powered by Google Gemini.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Key Stakeholder Workflows](#key-stakeholder-workflows)
   - [1. Consumer / Household Shopper](#1-consumer--household-shopper)
   - [2. Farmer / Producer](#2-farmer--producer)
   - [3. B2B Bulk Buyer (Hotels, Restaurants, Caterers)](#3-b2b-bulk-buyer-hotels-restaurants-caterers)
   - [4. Logistics & Fleet Partner](#4-logistics--fleet-partner)
   - [5. Platform Administrator](#5-platform-administrator)
3. [AI Agro-Advisory Workflow (Gemini Integration)](#ai-agro-advisory-workflow-gemini-integration)
4. [Financial & Payment Escrow Lifecycle](#financial--payment-escrow-lifecycle)
5. [Directory & Codebase Map](#directory--codebase-map)
6. [Local Setup & Development Guide](#local-setup--development-guide)

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend (React 19 + Vite)                      │
│  - Role Switcher (Consumer / Farmer / Business / Logistics / Admin)    │
│  - Interactive Marketplace, Farm Map, Mandi Intelligence, Weather     │
│  - Razorpay Modal Simulation & Escrow Tracker                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON API
┌───────────────────────────────────▼────────────────────────────────────┐
│                        Backend (Express + Node.js)                     │
│  - REST Endpoints (/api/products, /api/orders, /api/ai/chat, etc.)     │
│  - Micro-Weather Engine & AGMARKNET Benchmark Cache                   │
│  - Razorpay Order & Payment Signature Verification                     │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
┌───────────────────▼───────────────┐   ┌───────────▼────────────────────┐
│      Google Gemini AI Engine      │   │     In-Memory / Persistent     │
│  - Multi-Model Failover Cascade   │   │         Database Layer         │
│  - Real-time Context Injection    │   │  - Products, Orders, Quotes    │
│  - Grounded Offline Fallback      │   │  - Mandi Rates, Weather Data   │
└───────────────────────────────────┘   └────────────────────────────────┘
```

### Technology Stack
- **Client**: React 19, TypeScript, Tailwind CSS, Lucide React (icons), Motion (transitions).
- **Server**: Node.js, Express, TypeScript runtime (`tsx` in dev, `esbuild` bundled CJS for production).
- **AI / LLM**: Google Gen AI SDK (`@google/genai`) with automatic cascade (`gemini-3.1-flash-lite`, `gemini-flash-latest`, `gemini-3.8-flash`) and agricultural context grounding.
- **Payments**: Razorpay escrow simulation with automated verification signatures.

---

## Key Stakeholder Workflows

### 1. Consumer / Household Shopper
1. **Browse Fresh Produce**: The consumer explores seasonal vegetables, fruits, and grains sorted by freshness, proximity, or price.
2. **Transparent Price Breakdown**: Clicking any product reveals the **Middlemen vs. FarmDirect** price comparison, showing exactly how much goes to the farmer (100% of base price) versus traditional retail markups.
3. **Farm Traceability**: The consumer can view the farmer's name, farm location, harvest date, and farming method (Natural / Organic / Hydroponic).
4. **Checkout with Escrow**:
   - Adds items to the cart.
   - Proceeds through checkout via Razorpay (test mode simulated escrow).
   - Payment is held in secure platform escrow until goods are delivered.
5. **Live Order Tracking**: Real-time milestone tracker shows progress: *Harvested & Packed → Picked Up → In Cold Transit → Delivered*.

---

### 2. Farmer / Producer
1. **List New Crops**: The farmer inputs crop name, category, price per kg, available stock, harvest date, and certification.
2. **Mandi Market Intelligence**:
   - Accesses live AGMARKNET modal rates for local APMC markets (e.g., Kolar, Yeshwanthpur).
   - Compares 7-day price trends (increasing, stable, declining) to time crop harvest for optimal profit.
3. **Agro-Weather Advisory**:
   - Checks temperature, rain probability, and humidity.
   - Receives action-oriented advisories (e.g., *"Harvest ripe tomatoes today to avoid moisture spoilage from tomorrow's rains"*).
4. **Fulfill B2B Bulk Requirements**:
   - Views open procurement tenders posted by restaurants and retailers.
   - Submits bids/quotations with custom pricing and delivery timelines.
5. **Payout Settlement**:
   - Once the consumer or business verifies delivery, funds are automatically released from escrow to the farmer's registered account with 0% middleman commission.

---

### 3. B2B Bulk Buyer (Hotels, Restaurants, Caterers)
1. **Post Bulk Procurement Request**:
   - Specifies commodity (e.g., 200 kg Hybrid Tomatoes), target price per kg, and required delivery date.
2. **Receive Competitive Farmer Quotations**:
   - Multiple verified local farmers submit direct quotations.
3. **Contract Acceptance**:
   - The buyer accepts the best bid, placing funds into escrow.
   - Secures farm-fresh produce with guaranteed harvest traceability.

---

### 4. Logistics & Fleet Partner
1. **Dispatch Overview**:
   - Views orders requiring cold-storage or ambient transport from farms to urban hubs.
2. **Milestone Progression**:
   - Updates order states: *Driver Assigned → Picked Up from Farm → Arrived at Sorting Hub → Out for Delivery → Delivered*.
3. **Delivery Confirmation**:
   - Triggers the escrow release upon final delivery scan.

---

### 5. Platform Administrator
1. **System Health & Metrics**:
   - Tracks Gross Merchandise Value (GMV), active farmer listings, completed orders, and active buyers.
2. **Direct Farmer Impact**:
   - Monitors the **Farmer Income Uplift** metric (average +28% to +35% higher earnings compared to traditional APMC wholesale).
3. **Price Compression Index**:
   - Evaluates how much consumer savings have been generated by eliminating multi-tiered middlemen.

---

## AI Agro-Advisory Workflow (Gemini Integration)

FarmDirect features an integrated AI Agro Advisor built with the Google Gemini API.

```
User Query ("What should I sell today?")
                  │
                  ▼
Express Route: POST /api/ai/chat
                  │
                  ├─► Injects Live System State:
                  │   • Current Farmer Listings & Inventory
                  │   • Real AGMARKNET APMC Mandi Modal Prices
                  │   • Microclimate Weather Advisory & Rain Forecast
                  │
                  ▼
Try Multi-Model Cascade:
  1. gemini-3.1-flash-lite (Fast & High Availability)
     └─► If 503/429 high demand:
  2. gemini-flash-latest
     └─► If unavailable:
  3. gemini-3.8-flash
                  │
                  ├─► Success: Return AI grounded recommendation
                  │
                  └─► If no API key / offline:
                      Built-in Agricultural Intelligence Engine
                      synthesizes live DB data into structured advice
```

---

## Financial & Payment Escrow Lifecycle

```
[Buyer Places Order]
        │
        ▼
[Razorpay Payment Authorization]
  - Funds held in Platform Escrow
  - Order status: "CONFIRMED"
        │
        ▼
[Farmer Packs & Logistics Dispatches]
  - Order status: "PICKED_UP" -> "IN_TRANSIT"
        │
        ▼
[Delivery Verified by Buyer]
  - Order status: "DELIVERED"
        │
        ▼
[Automatic Escrow Disbursement]
  - 100% of crop value remitted to Farmer
  - Minimal logistics fee routed to fleet partner
```

---

## Directory & Codebase Map

```
├── .env.example            # Environment variables template
├── metadata.json           # Application name, permissions & capabilities
├── package.json            # Scripts & dependencies
├── server.ts               # Express API server & Vite middleware integration
├── server/
│   ├── aiService.ts        # Gemini AI integration with multi-model failover
│   ├── db.ts               # In-memory database with sample data & CRUD helpers
│   ├── paymentService.ts   # Razorpay order generation & escrow simulation
│   └── weatherService.ts   # Agro-meteorological advisory provider
├── src/
│   ├── App.tsx             # Root component with role switcher & modals
│   ├── types.ts            # TypeScript interfaces (Product, Order, MandiPrice, etc.)
│   ├── services/
│   │   └── api.ts          # Frontend API client with fallback resilience
│   └── components/
│       ├── Navbar.tsx               # Navigation bar with role toggle & cart
│       ├── MarketplaceView.tsx      # Consumer produce catalog & filters
│       ├── FarmerDashboard.tsx      # Crop listings, inventory & order fulfillment
│       ├── BusinessDashboard.tsx    # B2B bulk procurement contracts & quotations
│       ├── LogisticsDashboard.tsx   # Dispatch fleet & transit management
│       ├── AdminDashboard.tsx       # Platform GMV & farmer impact analytics
│       ├── MarketIntelligenceView.tsx# AGMARKNET APMC prices & trends
│       ├── WeatherDashboard.tsx     # Microclimate forecast & farming advisory
│       ├── AIAssistantModal.tsx     # Gemini AI chat interface
│       ├── CartDrawer.tsx           # Shopping cart slide-over
│       ├── CheckoutModal.tsx        # Razorpay escrow checkout flow
│       ├── OrderTrackingModal.tsx   # Live order progression & milestones
│       ├── FarmMap.tsx              # Interactive map of verified local farms
│       ├── PriceTransparencyCard.tsx# Breakdown of farmer vs middleman margins
│       └── ImpactModal.tsx          # Community sustainability & economic impact
```

---

## Local Setup & Development Guide

### Prerequisites
- Node.js 18+ (Node 20+ or 22+ recommended)
- npm or bun

### 1. Installation
Clone the repository or extract your downloaded ZIP file, then run:
```bash
npm install
```

### 2. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
Open `.env` and configure your keys:
```env
# Optional: Live Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Live OpenWeather API Key (simulated data is used if omitted)
OPENWEATHER_API_KEY=your_openweather_key_here
```
*(Note: FarmDirect functions completely out of the box in test/mock mode even without external API keys).*

### 3. Running Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 4. Building for Production
```bash
npm run build
npm start
```
This builds the client assets using Vite and bundles the Express server using `esbuild` into a single, high-performance Node.js executable in `dist/server.cjs`.
