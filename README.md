# Expo NextJS NestJS tRPC Turborepo

Expo, NextJS, NestJS, tRPC in one single monorepo.

## Steps:

1. Prerequisites
    - Node v20.10.0
    - NPM
    - PNPM v8.15.0

2. Clone the repository

    Clone this repository to your local machine.

3. Setup dependencies
    ```bash
    # Install dependencies
    pnpm i
    ```

4. Build all the packages & apps
    ```bash
    pnpm build
    ```

5. Running the apps:
    1. Run "TRPC Playground"
        1. Run below command to start server (nestjs + fastify + tRPC) app:
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
         4. Run all or each operation one by one, they should be performed successfully.
    2. Run "nextjs" backend and web app
        ```bash
        pnpm -F nextjs dev
        ```
    3. Run "expo" react-native app with "nextjs" backend
       
        In "Terminal 1", run "nextjs" app:
        ```bash
        pnpm -F nextjs dev
        ```
        In "Terminal 2", run "expo" app:
        ```bash
        pnpm -F expo dev
        ```
    4. Run "expo" react-native app with "nestjs + fastify" backend
  
        First change the port from `3000` to `4000` [here](https://github.com/akashdevcc/expo-nextjs-nestjs-trpc-turborepo/blob/main/apps/expo/src/api/index.tsx#L36) in your code!
       
        In "Terminal 1", run "nestjs" app:
        ```bash
        pnpm -F server dev
        ```
        In "Terminal 2", run "expo" app:
        ```bash
        pnpm -F expo dev
        ```
        
## Generated from t3-oss/create-t3-turbo

This monorepo is an fork and upgraded version of [t3-oss/create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).

Read more about it [here](https://github.com/t3-oss/create-t3-turbo/blob/main/README.md).
