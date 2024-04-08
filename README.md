# Acme monorepo

An attempt to combine Expo, NextJS, tRPC, NestJS in one single monorepo.

## The issue:

Gets following errors at multiple places in apps "nextjs" and "expo":

```bash
Property createClient does not exist on type
 in your router collides with a built-in method, rename this router or procedure on your backend." | "The property useUtils' in your router collides with a built-in method, rename this router or procedure on your backend." | ... 4 more ... | "The property useDehydratedState' in your route...'.
```

**However, the server part successfully compiles and tRPC query works perfectly in the tRPC playground.**

## Expectation:

The client apps "nextjs" & "expo" should have properly inferred the types from `AppRouter` without any TypeScript errors. Instead, the client apps fails to build and run.

## Reproduction steps:

To reproduce the issue, follow the steps below:

### 1. Prerequisites

- Node v20.10.0
- NPM
- PNPM v8.15.0

### 2. Clone the repository

Clone this repository to your local machine.

### 3. Setup dependencies

```bash
# Install dependencies
pnpm i
```

### 4. Build all the packages & apps

```bash
pnpm build
```

Except "nextjs" and "expo" apps, everything else should have been built successfully. "nextjs" build fails with error (most probably due to the same issue, described on top).

### 5. Review "PROBLEMS" tab section

In VSCode's "PROBLEMS" tab section, you will find the same issue mentioned below at multiple places.

```bash
Property createClient does not exist on type
 in your router collides with a built-in method, rename this router or procedure on your backend." | "The property useUtils' in your router collides with a built-in method, rename this router or procedure on your backend." | ... 4 more ... | "The property useDehydratedState' in your route...'.
```

### 6. Check server app and tRPC Playground

The server apps compile successfully and tRPC Playground works perfectly.

1. Run below command:

   ```bash
   pnpm -F server dev
   ```

2. Go to url: http://localhost:4000/playground

3. Paste the below queries/mutations on the left side.

   ```bash
   await trpc.greeting.hello.query({ name: "acme" })

   await trpc.post.all.query()

   await trpc.post.byId.query({ id: 2 })

   await trpc.post.create.mutate({ title: "new post title", content: "new post content" })

   await trpc.post.delete.mutate(3)

   export {}
   ```

4. Run each operation one by one, they should be performed successfully.

## Generated from t3-oss/create-t3-turbo

This monorepo is an fork and upgraded version of [t3-oss/create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).

Read more about it [here](https://github.com/t3-oss/create-t3-turbo/blob/main/README.md).
