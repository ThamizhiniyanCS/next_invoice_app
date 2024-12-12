# Full Stack Invoice App

## Tech Stack

- [Next.js 15](https://nextjs.org)
- [React.js v19](https://react.dev/)
- [Clerk](https://clerk.com/)
- [Xata](https://xata.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/)

## Getting Started

1. First, install the node modules using the following command.

```bash
pnpm install
```

2. Create a `.env.local` file or update the environment variables. You can find the example `.env.local` file [here](./example.env.local)

3. Next, to run the development server, use the following command.

```bash
pnpm dev
```

4. Next, to build the production, use the following command.

```bash
pnpm build
```

5. Next, to run the production server, use the following command.

```bash
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Postgres Database using Xata and Drizzle ORM
- Clerk for Authentication and Organization Management
- React Hook Form in combination with Shadcn/ui
- Custom login forms for clerk using [Clerk Elements and Shadcn/ui](https://clerk.com/docs/customization/elements/examples/shadcn-ui)
- [Stripe Checkout](https://stripe.com/in/payments/checkout) for payments

## Reference

[Build an Invoice App with Next.js 15 by Colby Fayock](https://www.youtube.com/watch?v=Mcw8Mp8PYUE)
