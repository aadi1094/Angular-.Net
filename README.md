# Housing Platform

A full-stack housing platform built with Angular and .NET Core.

## Technologies Used
- Frontend: Angular 17
- Backend: .NET 8
- Database: MySQL
- Authentication: JWT

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- .NET 8 SDK
- MySQL Server
- Angular CLI

### Backend Setup
```bash
cd Backend
dotnet restore
dotnet run
```

### Frontend Setup
```bash
cd First-app
npm install
ng serve
```

### Environment Configuration
1. Copy `.env.example` to `.env` in the Backend directory
2. Copy `environment.example.ts` to `environment.ts` in the Frontend directory
3. Update the configuration values as needed

### Database Setup
1. Create a MySQL database
2. Update connection string in `.env` file
3. Run migrations: `dotnet ef database update`

## Features
- User Authentication (Login/Register)
- Property Listing
- Property Search
- Image Upload
- User Dashboard
- Admin Features
