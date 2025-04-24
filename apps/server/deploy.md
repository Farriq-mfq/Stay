# How To Deploy

## Prerequisite
- Python3
- build-essential
- g++ atau c++
- Node JS 18.20 (NVM)

## Deploy
1. Setup
    - Corepack (PNPM)
    ```bash
    corepack enable
    ```
    - Install Depedencies
    ```bash
    pnpm install
    ```
    - Setup Prisma (Database)
    ```bash
    pnpm dlx prisma db push
    pnpm dlx prisma db generate
    ```
2.Seeding
- Create Developer Account
    ```bash
    pnpm dlx prisma db push
    pnpm 
    ```

3.Deploy
- Install PM2
    ```bash
    pnpm pm2
    ```

## Install NVM
- [Windows, Linux, and Mac](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)