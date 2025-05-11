# EduHub - Platonus Portal Clone

This project is a frontend implementation of the Platonus educational portal interface using Next.js and Tailwind CSS.

## Pages Implemented

- **Login Page** (`/login`): The initial login screen
- **Dashboard** (`/`): Main dashboard with calendar, events, and notifications
- **Site Map** (`/map`): Site map showing all available sections and pages

## Technologies Used

- **Next.js 15**: React framework for building the application
- **React 19**: JavaScript library for building user interfaces
- **Tailwind CSS 4**: Utility-first CSS framework
- **TypeScript**: Typed JavaScript for better developer experience
- **Material Icons**: Google's Material Icons for consistent iconography

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/components/`: Reusable UI components
  - `Sidebar.tsx`: Left sidebar navigation
  - `Header.tsx`: Top header with site map link and user menu
  - `Footer.tsx`: Page footer
- `src/app/login/`: Login page
- `src/app/map/`: Site map page
- `src/app/page.tsx`: Main dashboard page
- `src/app/globals.css`: Global CSS styles
- `src/app/layout.tsx`: Root layout with shared elements

## Features

- Responsive design
- Multilingual support (UI elements for KZ, RU, EN)
- Material Icons integration
- Custom color scheme matching Platonus branding

## Notes

This is a design implementation only and does not include any actual backend functionality. The UI mimics the Platonus educational portal for demonstration purposes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
