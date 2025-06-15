# PayOff - Purchase Worth Calculator

PayOff is a Vue 3 application that helps users determine if a purchase is worth it by calculating how much work time it costs based on their net income.

## Features

- Calculate work time needed to afford purchases
- Multiple salary profiles with monthly/yearly options
- Philippine tax and contribution calculations
- Dark/Light theme support
- Local storage for saving profiles and settings
- Responsive design for all devices

## Tech Stack

- Vue 3 (Composition API)
- Vuex for state management
- Tailwind CSS for styling
- Vite for build tooling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Usage

1. Add a salary profile with your income details
2. Enter the price of an item you want to purchase
3. Click "Reveal Time to Pay Off" to see how long it would take to afford the item
4. Toggle settings to include/exclude Philippine taxes and contributions
5. Switch between light and dark themes as preferred

## Local Storage

The app uses the following localStorage keys:

- `payoffProfiles`: Array of salary profiles
- `payoffActiveProfile`: ID of the currently selected profile
- `payoffSettings`: App settings (theme, tax calculations)

## License

MIT 
