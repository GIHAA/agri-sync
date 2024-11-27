/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')
const { parseColor } = require('tailwindcss/lib/util/color')

/** Converts HEX color to RGB */
const toRGB = (value) => {
  return parseColor(value).color.join(' ')
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#202020',
        // secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        pending: 'rgb(var(--color-pending) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        // light: 'rgb(var(--color-light) / <alpha-value>)',
        dark: 'rgb(var(--color-dark) / <alpha-value>)',
        darkmode: {
          50: 'rgb(var(--color-darkmode-50) / <alpha-value>)',
          100: 'rgb(var(--color-darkmode-100) / <alpha-value>)',
          200: 'rgb(var(--color-darkmode-200) / <alpha-value>)',
          300: 'rgb(var(--color-darkmode-300) / <alpha-value>)',
          400: 'rgb(var(--color-darkmode-400) / <alpha-value>)',
          500: 'rgb(var(--color-darkmode-500) / <alpha-value>)',
          600: 'rgb(var(--color-darkmode-600) / <alpha-value>)',
          700: 'rgb(var(--color-darkmode-700) / <alpha-value>)',
          800: 'rgb(var(--color-darkmode-800) / <alpha-value>)',
          900: 'rgb(var(--color-darkmode-900) / <alpha-value>)',
        },
      },
      fontFamily: {
        roboto: ['Roboto'],
      },
      container: {
        center: true,
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
      },
      strokeWidth: {
        0.5: 0.5,
        1.5: 1.5,
        2.5: 2.5,
      },
      backgroundImage: {
        'menu-corner':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='259.51' height='259.52' viewBox='0 0 259.51 259.52'%3E%3Cpath id='Path_143' data-name='Path 143' d='M8659.507,423.965c-.167-2.608.05-5.319-.19-8.211-.084-1.012-.031-2.15-.118-3.12-.113-1.25-.1-2.682-.236-4.061-.172-1.722-.179-3.757-.365-5.394-.328-2.889-.478-5.857-.854-8.61-.509-3.714-.825-7.252-1.38-10.543-.934-5.535-2.009-11.312-3.189-16.692-.855-3.9-1.772-7.416-2.752-11.2-1.1-4.256-2.394-8.149-3.687-12.381-1.1-3.615-2.366-6.893-3.623-10.493-1.3-3.739-2.917-7.26-4.284-10.7-1.708-4.295-3.674-8.078-5.485-12.023-1.145-2.493-2.5-4.932-3.727-7.387-1.318-2.646-2.9-5.214-4.152-7.518-1.716-3.16-3.517-5.946-5.274-8.873-1.692-2.818-3.589-5.645-5.355-8.334-2.326-3.542-4.637-6.581-7.039-9.848-2.064-2.809-4.017-5.255-6.088-7.828-2.394-2.974-4.937-5.936-7.292-8.589-3.027-3.411-6.049-6.744-9.055-9.763-2.4-2.412-4.776-4.822-7.108-6.975-3-2.767-5.836-5.471-8.692-7.854-3.332-2.779-6.657-5.663-9.815-8.028-2.958-2.216-5.784-4.613-8.7-6.6-3.161-2.159-6.251-4.414-9.219-6.254-3.814-2.365-7.533-4.882-11.168-6.89-4.213-2.327-8.513-4.909-12.478-6.834-4.61-2.239-9.234-4.619-13.51-6.416-4.1-1.725-8.11-3.505-11.874-4.888-4.5-1.652-8.506-3.191-12.584-4.47-6.045-1.9-12.071-3.678-17.431-5-9.228-2.284-17.608-3.757-24.951-4.9-7.123-1.112-13.437-1.64-18.271-2.035l-2.405-.2c-1.638-.136-3.508-.237-4.633-.3a115.051,115.051,0,0,0-12.526-.227h259.51Z' transform='translate(-8399.997 -164.445)' fill='%23f1f5f8'/%3E%3C/svg%3E%0A\")",
        'menu-corner-dark':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='259.51' height='259.52' viewBox='0 0 259.51 259.52'%3E%3Cpath id='Path_143' data-name='Path 143' d='M8659.507,423.965c-.167-2.608.05-5.319-.19-8.211-.084-1.012-.031-2.15-.118-3.12-.113-1.25-.1-2.682-.236-4.061-.172-1.722-.179-3.757-.365-5.394-.328-2.889-.478-5.857-.854-8.61-.509-3.714-.825-7.252-1.38-10.543-.934-5.535-2.009-11.312-3.189-16.692-.855-3.9-1.772-7.416-2.752-11.2-1.1-4.256-2.394-8.149-3.687-12.381-1.1-3.615-2.366-6.893-3.623-10.493-1.3-3.739-2.917-7.26-4.284-10.7-1.708-4.295-3.674-8.078-5.485-12.023-1.145-2.493-2.5-4.932-3.727-7.387-1.318-2.646-2.9-5.214-4.152-7.518-1.716-3.16-3.517-5.946-5.274-8.873-1.692-2.818-3.589-5.645-5.355-8.334-2.326-3.542-4.637-6.581-7.039-9.848-2.064-2.809-4.017-5.255-6.088-7.828-2.394-2.974-4.937-5.936-7.292-8.589-3.027-3.411-6.049-6.744-9.055-9.763-2.4-2.412-4.776-4.822-7.108-6.975-3-2.767-5.836-5.471-8.692-7.854-3.332-2.779-6.657-5.663-9.815-8.028-2.958-2.216-5.784-4.613-8.7-6.6-3.161-2.159-6.251-4.414-9.219-6.254-3.814-2.365-7.533-4.882-11.168-6.89-4.213-2.327-8.513-4.909-12.478-6.834-4.61-2.239-9.234-4.619-13.51-6.416-4.1-1.725-8.11-3.505-11.874-4.888-4.5-1.652-8.506-3.191-12.584-4.47-6.045-1.9-12.071-3.678-17.431-5-9.228-2.284-17.608-3.757-24.951-4.9-7.123-1.112-13.437-1.64-18.271-2.035l-2.405-.2c-1.638-.136-3.508-.237-4.633-.3a115.051,115.051,0,0,0-12.526-.227h259.51Z' transform='translate(-8399.997 -164.445)' fill='%23232e45'/%3E%3C/svg%3E%0A\")",
        'bredcrumb-chevron-dark':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right breadcrumb__icon'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E\")",
        'bredcrumb-chevron-light':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e8eeff' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right breadcrumb__icon'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E\")",
        'bredcrumb-chevron-darkmode':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right breadcrumb__icon'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function pluginColors({ addBase }) {
      addBase({
        // Default colors
        ':root': {
          '--color-primary': toRGB(colors.black),
          '--color-secondary': toRGB(colors.slate['200']),
          '--color-success': toRGB(colors.lime['500']),
          '--color-info': toRGB(colors.cyan['500']),
          '--color-warning': toRGB(colors.yellow['400']),
          '--color-pending': toRGB(colors.orange['500']),
          '--color-danger': toRGB(colors.red['600']),
          '--color-light': toRGB(colors.slate['100']),
          '--color-dark': toRGB(colors.slate['800']),
        },
        // Default dark-mode colors
        '.dark': {
          '--color-primary': toRGB(colors.blue['700']),
          '--color-darkmode-50': '87 103 132',
          '--color-darkmode-100': '74 90 121',
          '--color-darkmode-200': '65 81 114',
          '--color-darkmode-300': '53 69 103',
          '--color-darkmode-400': '48 61 93',
          '--color-darkmode-500': '41 53 82',
          '--color-darkmode-600': '40 51 78',
          '--color-darkmode-700': '35 45 69',
          '--color-darkmode-800': '27 37 59',
          '--color-darkmode-900': '15 23 42',
        },
        // Theme 1 colors
        '.theme-1': {
          '--color-primary': toRGB(colors.emerald['900']),
          '--color-secondary': toRGB(colors.slate['200']),
          '--color-success': toRGB(colors.emerald['600']),
          '--color-info': toRGB(colors.cyan['500']),
          '--color-warning': toRGB(colors.yellow['400']),
          '--color-pending': toRGB(colors.amber['500']),
          '--color-danger': toRGB(colors.rose['600']),
          '--color-light': toRGB(colors.slate['100']),
          '--color-dark': toRGB(colors.slate['800']),
          '&.dark': {
            '--color-primary': toRGB(colors.emerald['800']),
          },
        },
        // Theme 2 colors
        '.theme-2': {
          '--color-primary': toRGB(colors.blue['900']),
          '--color-secondary': toRGB(colors.slate['200']),
          '--color-success': toRGB(colors.teal['600']),
          '--color-info': toRGB(colors.cyan['500']),
          '--color-warning': toRGB(colors.amber['500']),
          '--color-pending': toRGB(colors.orange['500']),
          '--color-danger': toRGB(colors.red['700']),
          '--color-light': toRGB(colors.slate['100']),
          '--color-dark': toRGB(colors.slate['800']),
          '&.dark': {
            '--color-primary': toRGB(colors.blue['800']),
          },
        },
        // Theme 3 colors
        '.theme-3': {
          '--color-primary': toRGB(colors.cyan['900']),
          '--color-secondary': toRGB(colors.slate['200']),
          '--color-success': toRGB(colors.teal['600']),
          '--color-info': toRGB(colors.cyan['500']),
          '--color-warning': toRGB(colors.amber['500']),
          '--color-pending': toRGB(colors.amber['600']),
          '--color-danger': toRGB(colors.red['700']),
          '--color-light': toRGB(colors.slate['100']),
          '--color-dark': toRGB(colors.slate['800']),
          '&.dark': {
            '--color-primary': toRGB(colors.cyan['800']),
          },
        },
        // Theme 4 colors
        '.theme-4': {
          '--color-primary': toRGB(colors.indigo['900']),
          '--color-secondary': toRGB(colors.slate['200']),
          '--color-success': toRGB(colors.emerald['600']),
          '--color-info': toRGB(colors.cyan['500']),
          '--color-warning': toRGB(colors.yellow['500']),
          '--color-pending': toRGB(colors.orange['600']),
          '--color-danger': toRGB(colors.red['700']),
          '--color-light': toRGB(colors.slate['100']),
          '--color-dark': toRGB(colors.slate['800']),
          '&.dark': {
            '--color-primary': toRGB(colors.indigo['700']),
          },
        },
      })
    }),
  ],
  variants: {
    extend: {
      boxShadow: ['dark'],
    },
  },
}
