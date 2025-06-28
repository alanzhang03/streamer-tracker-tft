# 🎮 StreamerTracker TFT

**Track your favorite TFT streamers' latest matches and comps!**

A comprehensive tracking application for Teamfight Tactics streamers, featuring real-time statistics, match history analysis, and team composition insights with a stunning glassmorphism UI design.

🌐 **Live Demo**: [streamer-tracker-tft.vercel.app](https://streamer-tracker-tft.vercel.app/)

## 🚀 Overview

StreamerTracker TFT is a specialized tracking application designed for Teamfight Tactics content creators and viewers. Monitor your favorite streamers' performance, analyze their strategies, and discover winning team compositions through an intuitive, modern interface.

## ✨ Key Features

### 📊 **Comprehensive Streamer Analytics**
- **Real-time Rank Tracking**: Monitor current LP, rank, and tier progression
- **Performance Metrics**: Win rates, average placement, and recent game statistics
- **Interactive Match History**: Detailed breakdowns of recent 50+ matches
- **Placement Visualization**: Color-coded placement history for quick analysis

### 🎯 **Strategic Insights**
- **Favorite Compositions**: Top 5 most played team comps with frequency data
- **Item Analysis**: Most frequently used items with usage statistics
- **Synergy Tracking**: Augment and trait combinations per match
- **Advanced Filtering**: Filter matches by compositions and items for deep analysis

### 🎨 **Modern User Experience**
- **Glassmorphism Design**: Beautiful backdrop blur effects and translucent components
- **Dynamic Color System**: Cost-based champion borders and placement-based styling
- **Responsive Layout**: Optimized for desktop, tablet, and mobile viewing
- **Smooth Animations**: Micro-interactions and hover effects throughout the interface

### 🔄 **Real-time Data Management**
- **Live Updates**: Manual refresh functionality with timestamps
- **Efficient Caching**: Optimized data retrieval and storage
- **Error Handling**: Robust error states and loading indicators
- **API Integration**: Seamless Riot Games API integration

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14**: React-based framework with server-side rendering
- **SCSS**: Advanced styling with custom glassmorphism components
- **GSAP**: High-performance animations and transitions
- **Responsive Design**: Mobile-first approach with breakpoint optimization

### **Backend**
- **Python & Flask**: Lightweight, scalable API development
- **RESTful Architecture**: Clean, organized endpoint structure
- **Data Processing**: Intricate match data analysis and statistics generation
- **Riot Games API**: Official TFT match and player data integration

### **Database**
- **PostgreSQL**: Robust relational database management
- **Neon Integration**: Cloud-native PostgreSQL for optimal performance
- **Efficient Queries**: Optimized data retrieval for streamer statistics
- **Data Modeling**: Structured storage for matches, players, and analytics

### **Deployment**
- **Vercel**: Frontend deployment with automatic CI/CD
- **Cloud Hosting**: Scalable backend infrastructure
- **CDN Integration**: Fast asset delivery worldwide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL database
- Riot Games API key

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/streamertracker-tft.git
   cd streamertracker-tft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your configuration:
   ```env
   RIOT_API_KEY=your_riot_api_key
   DATABASE_URL=your_neon_postgresql_url
   FLASK_ENV=development
   ```

4. **Run Flask application**
   ```bash
   flask run
   ```

## 🎮 Usage Guide

### Exploring Streamers
1. **Browse Streamers**: Use the "Explore Streamers" feature to discover tracked content creators
2. **View Statistics**: Click on any streamer to see their detailed analytics
3. **Analyze Performance**: Review recent match history and performance trends

### Advanced Analysis
- **Composition Filtering**: Click on favorite comps to filter match history
- **Item Analysis**: Select specific items to see usage patterns
- **Combined Filters**: Use multiple filters for detailed strategic analysis
- **Export Data**: Save insights for further analysis

### Data Updates
- **Manual Refresh**: Use the "Update Data" button for latest match information
- **Automatic Sync**: Backend processes update streamer data periodically
- **Real-time Feedback**: Loading states and timestamps show data freshness

## 🤝 Contributing

We welcome contributions from the TFT community! Here's how you can help:

### **Getting Started**
1. **Fork the repository** and create a feature branch
2. **Follow the coding standards** established in the codebase
3. **Test thoroughly** on multiple screen sizes and browsers
4. **Document new features** with clear comments and README updates

### **Areas for Contribution**
- **New Streamer Integrations**: Add support for additional content creators
- **Enhanced Analytics**: Develop new statistical insights and visualizations
- **UI/UX Improvements**: Refine the glassmorphism design system
- **Performance Optimization**: Improve loading times and data efficiency
- **Mobile Experience**: Enhance responsive design and touch interactions

### **Development Guidelines**
- Maintain the existing glassmorphism design language
- Follow component-based architecture patterns
- Add proper error handling and loading states
- Ensure accessibility compliance
- Write meaningful commit messages

## 📈 Future Roadmap

- **Multi-Region Support**: Expand beyond NA to include all TFT regions
- **Live Streaming Integration**: Real-time match tracking during streams
- **Community Features**: User accounts, favorites, and sharing
- **Advanced Analytics**: Meta analysis, patch impact tracking
- **Mobile App**: Native iOS and Android applications
- **Tournament Tracking**: Support for competitive events and tournaments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Riot Games** for providing the TFT API and game assets
- **TFT Community** for feedback, testing, and feature requests
- **Content Creators** who make TFT streaming entertaining and educational
- **Open Source Contributors** who help improve the platform

## 📞 Support & Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/streamertracker-tft/issues)
- **Discord Community**: Join our community for real-time support
- **Documentation**: Comprehensive guides available in the `/docs` folder
- **Email Support**: Contact us for partnership inquiries

---

**Built with ❤️ for the TFT streaming community**

*StreamerTracker TFT isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.*
