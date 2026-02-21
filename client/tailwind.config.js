/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#F5F7FA', // Soft background white
                primary: '#FFFFFF', // Pure White base
                accent: {
                    silver: '#C0C0C0', // Metallic silver
                    blue: '#3B82F6', // Performance blue
                },
                text: {
                    main: '#1F2937', // Dark charcoal
                    secondary: '#9CA3AF', // Light gray
                    muted: '#E5E7EB', // Lighter gray for separation
                },
                glass: {
                    white: 'rgba(255, 255, 255, 0.7)',
                    border: 'rgba(255, 255, 255, 0.5)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'sans-serif'], // For headers if needed, or stick to Inter
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
            }
        },
    },
    plugins: [],
}
