/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
        text: '#122128',
        background: '#fafafa',
        primary: '#ADEDFF',
        secondary: '#E0E0E0',
        accent: '#122D3B',
        white: '#ffffff',
        black: '#000000',
        reject: '#ff0000',
        accept: '#00FF00',
        logout: '#FF0000',
        gray: '#808080',
        tbg: '#57666f'
    },
    fontSize: {
        sm: '0.600rem',
        base: '0.8rem',
        xl: '1.066rem',
        '2xl': '1.421rem',
        '3xl': '1.894rem',
        '4xl': '2.525rem',
        '5xl': '3.366rem'
    },
    fontFamily: {
        heading: 'Poppins',
        body: 'Poppins'
    },
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '1000'
    }
},
plugins: []
}


