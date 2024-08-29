# Cutt.live

This repository has 5 pages.
- The Index page
- The Account page
- The Id page for each live link
- Vitest

### The index page
This is the login page where users can read about the website, login and signup

### The Account page
This page has multiple functions
- A modal to shorten url links -> It take in two inputs. The name for the url and a long url link for it to shorten
- A list of al created short links -> It item in the list includes the name, long url link, shortened url link (cutt.live/<id which is usually a 5 digit string>) total clicks, a downloadable qr code, copy, edit and delete buttons
- An update modal -> The shortened url has a code which can be updated by the user to any thing they like in other to better represent their business on link
  

### The Id page for each live link
The id page is used to get the data for each shortened link, update total clicks and redirect the user to the long link. It also serves as the Error 404 page because it checks for any path that isnt /account in the database and if it doesnt exist a 404 erroris displayed

### Vitest
Vitest was added to include for unit and component testing


- [The link to the live site - cutt.live](https://cutt.live/)




This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
