# NIFTY50 Trading Analysis & Signal Generation Platform

A production-ready web application for real-time NIFTY50 trading analysis, technical indicators, and signal generation built with modern tech stack.

## 🚀 Tech Stack

### Frontend
- **Next.js** with TypeScript and App Router
- **Tailwind CSS** for styling with custom trading theme
- **shadcn/ui** components
- **TradingView** charts integration (ready)
- **React Query** for data management

### Backend (Planned)
- **Node.js** with TypeScript
- **Fastify** web framework
- **WebSocket** for real-time updates
- **PostgreSQL** for data persistence
- **Redis** for caching

### Key Features

- ✅ **Real-time Dashboard** - Live NIFTY50 price updates
- ✅ **Technical Indicators** - 10+ indicators across trend, momentum, volume & volatility
- ✅ **Signal Generation** - Automated BUY/SELL/HOLD signals with confidence scoring
- ✅ **Professional UI** - Dark trading theme with responsive design
- ✅ **Mock Data Provider** - Complete simulation for development
- 🔄 **WebSocket Integration** - Real-time data streaming (planned)
- 🔄 **Alert System** - In-app and email notifications (planned)
- 🔄 **Historical Analysis** - Pattern recognition & backtesting (planned)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── trading/            # Trading-specific components
│       ├── LivePriceCard.tsx
│       ├── SignalsPanel.tsx
│       ├── TechnicalIndicators.tsx
│       └── MarketStatus.tsx
├── hooks/
│   └── use-trading-data.ts # Trading data management
├── lib/
│   ├── trading-data.ts     # Mock data provider
│   └── utils.ts           # Utilities
└── pages/
    └── Dashboard.tsx       # Main trading dashboard
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd nifty50-trader

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see the trading dashboard.

## 🎯 Current Features

### Live Price Card
- Real-time NIFTY50 price with change indicators
- Day high/low, volume, and previous close
- Market status (Open/Closed) with live indicator
- Color-coded bullish/bearish movements

### Signals Panel
- Current trading signal (STRONG_BUY, BUY, HOLD, SELL, STRONG_SELL)
- Confidence percentage and strength rating (1-5)
- Entry, stop-loss, and target levels
- Risk-reward ratio calculation
- Strategy information and duration

### Technical Indicators
- **Trend**: SMA(20,50), MACD, ADX
- **Momentum**: RSI, Stochastic, Williams %R
- **Volume**: OBV, VWAP
- **Volatility**: Bollinger Bands, ATR
- Organized by category with signal strength visualization

### Market Status
- Real-time connection status
- Market hours and next session info
- Last update timestamp

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
# Development settings
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Production settings (when backend is ready)
DATABASE_URL=postgresql://user:pass@localhost:5432/nifty50_trader
REDIS_URL=redis://localhost:6379
ZERODHA_MCP_URL=http://localhost:8080

# Feature flags
ENABLE_PHASE=MVP
ENABLE_EMAIL_ALERTS=false
ENABLE_BACKTESTING=false
```

## 🎨 Design System

The app uses a professional trading theme with:

- **Colors**: Custom bull/bear colors with proper contrast
- **Typography**: Inter font for readability
- **Gradients**: Subtle gradients for modern look
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design

### Custom CSS Classes

```css
.text-bull      /* Bullish green */
.text-bear      /* Bearish red */
.text-neutral   /* Neutral yellow */
.gradient-bull  /* Bull gradient background */
.gradient-bear  /* Bear gradient background */
.shadow-trading /* Professional shadow */
```

## 📊 Mock Data

The app includes a comprehensive mock data provider that simulates:

- Real-time price movements with volatility
- Technical indicator calculations
- Signal generation with various strategies
- Market status and connection states

## 🚧 Roadmap

### Phase 2 - Enhanced Features
- [ ] Historical pattern recognition
- [ ] Email alert system
- [ ] Basic backtesting
- [ ] Performance tracking
- [ ] Multi-timeframe analysis

### Phase 3 - Advanced Features
- [ ] Machine learning signal enhancement
- [ ] Portfolio integration
- [ ] Social features
- [ ] Advanced risk management
- [ ] Public API

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is for educational and analysis purposes only. It does not provide financial advice, and users should conduct their own research before making trading decisions. The developers are not responsible for any financial losses incurred through the use of this software.

## 📞 Support

For support, email support@nifty50trader.com or join our Discord community.

---

Built with ❤️ for the trading community