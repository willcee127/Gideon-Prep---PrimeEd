# Gideon Prep – PrimeED

A beautiful, modern educational platform built with React, Vite, and Tailwind CSS. This application features a sophisticated learning system with Photonic States, Identity Strikes, and a comprehensive Mastery Engine for GED mathematics curriculum.

## Features

### 🧠 Neuro-System
- **Three Photonic States**: VERVE (Lavender), AURA (Deep Blue), FORGE (Molten Gold)
- **Dynamic Blur Effects**: 30px → 15px → 0px based on mode
- **Golden Heartbeat**: FORGE mode features pulsing border animation
- **Identity Strike**: Spectacular gold particle explosion effects

### 🗺️ Mastery Engine
- **GED Curriculum**: 10 progressive nodes from Number Sense to Data & Statistics
- **Skill Tree Visualization**: High-tech star map with pan/zoom capabilities
- **Prerequisite System**: Connected learning paths with XP requirements
- **Interactive Nodes**: Click to practice, hover for details
- **Sector Organization**: 5 color-coded curriculum areas

### 🎯 Practice System
- **Dynamic Sanctuary Card**: Transforms between welcome and practice modes
- **Node-Specific Practice**: Tailored content for each curriculum topic
- **Progress Tracking**: Visual feedback for mastery levels
- **Smooth Transitions**: Framer Motion animations throughout

## Technologies Used

- **React 18** - Modern component architecture
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first styling framework
- **Framer Motion** - Advanced animation library
- **Supabase** - Backend database and authentication

## Project Structure

```
gideon-prep-prime/
├── src/
│   ├── components/
│   │   ├── IdentityStrike.jsx    # Gold particle explosion effects
│   │   ├── MasteryMap.jsx       # Interactive skill tree
│   │   └── SanctuaryCard.jsx    # Main UI component
│   ├── context/
│   │   └── NeuroProvider.jsx     # Global state management
│   ├── data/
│   │   └── GEDMasteryPath.json # Curriculum data
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── public/
│   └── index.html               # HTML template
├── .env                       # Environment variables
├── package.json               # Dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
└── README.md                 # This file
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials
   - Set `VITE_APP_NAME=Gideon Prep – PrimeED`

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Open Application**:
   - Navigate to `http://localhost:5173`
   - Click "🗺️ Mastery Map" to view curriculum
   - Select nodes to enter practice mode

## Brand Guidelines

### Typography
- **"Gideon Prep"**: Clean sans-serif font, professional weight
- **"PrimeED"**: Bolder weight with glowing gold effect
- **Consistent Spacing**: Use en dash (–) in brand name

### Color Palette
- **VERVE Mode**: Lavender (#E6E6FA) with 30px blur
- **AURA Mode**: Deep Blue (#00008B) with 15px blur  
- **FORGE Mode**: Molten Gold (#FFD700) with no blur
- **Accent Colors**: Sector-based coding system

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_APP_NAME` - Application brand name
- `VITE_ENV` - Environment (development/production)

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ and ⚡ for the future of education**
