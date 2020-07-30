# aws-sdk-js-v3-workshop

## Table of Contents

- [Set up](#set-up)
  - [Create backend API](#create-backend-api)
  - [Deploy infrastructure](#deploy-infrastructure)
  - [Prepare frontend API](#prepare-backend-api)
  - [Debug frontend](#debug-frontend)
- [Activities](#activities)
  - [Migrate backend from v2 to v3](#migrate-backend-from-v2-to-v3)
  - [Migrate frontend from v2 to v3](#migrate-frontend-from-v2-to-v3)

## Set up

Ensure that you've followed pre-requisites from main [README](../README.md)

### Create backend API

- Run `yarn build:backend`
- This generates bundles to be deployed to lambda.

### Deploy infrastructure

- Run `yarn cdk deploy`
- This command:
  - Creates AWS infrastructure using [AWS Cloud Development Kit](https://aws.amazon.com/cdk/).
  - Deploys backend bundles to lambda
  - Creates resources to be used in the frontend

### Prepare frontend API

- Run `yarn prepare:frontend`
- This command copies AWS resources to the frontend config

### Debug frontend

- Run `yarn start:frontend`
- This command starts ReactApp for testing frontend, and opens the URL in browser.

## Activities

### Migrate backend from v2 to v3

Follow [backend README.md](./backend/README.md)

### Migrate frontend from v2 to v3

Follow [frontend README.md](./frontend/README.md)

## Clean up

The Cloudformation stack can be deleted by running `yarn cdk destroy`
