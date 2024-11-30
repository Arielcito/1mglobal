import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", "class"],
  theme: {
  	fontFamily: {
  		inter: ["Inter", "sans-serif"]
  	},
  	container: {
  		center: true,
  		padding: '1rem'
  	},
  	screens: {
  		sm: '575px',
  		md: '768px',
  		lg: '992px',
  		xl: '1200px',
  		'2xl': '1400px'
  	},
  	extend: {
  		colors: {
  			current: 'currentColor',
  			transparent: 'transparent',
  			white: '#FFFFFF',
  			black: '#010101',
  			primary: {
  				DEFAULT: '#ac985f',
  				foreground: '#ffffff'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			stroke: '#EBEFF4',
  			dark: '#1F233A',
  			body: '#79808A',
  			gray: '#F8F9FF',
  			'stroke-dark': '#34374A',
  			background: '#010101',
  			foreground: '#ffffff',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		backgroundImage: {
  			'gradient-1': 'linear-gradient(55.15deg, #8EA5FE -7.09%, #BEB3FD 51.72%, #90D1FF 101.48%)',
  			'gradient-2': 'linear-gradient(120.12deg, #FF8FE8 0%, #FFC960 100%)',
  			'gradient-3': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%)',
  			texture: 'url("/images/graphics/texture.svg")',
  		},
  		screens: {
  			xs: '450px',
  			'3xl': '1500px'
  		},
  		boxShadow: {
  			card: '0px 1px 5px rgba(45, 74, 170, 0.14)',
  			'card-dark': '0px 1px 5px rgba(16, 25, 55, 0.14)',
  			input: '0px 10px 30px rgba(74, 108, 247, 0.08)'
  		},
  		dropShadow: {
  			card: '0px 1px 5px rgba(45, 74, 170, 0.14)',
  			'card-dark': '0px 1px 5px rgba(16, 25, 55, 0.14)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			breathing: {
  				'0%, 100%': { transform: 'scale(1)' },
  				'50%': { transform: 'scale(1.1)' },
  			}
  		},
  		animation: {
  			breathing: 'breathing 3s ease-in-out infinite',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
