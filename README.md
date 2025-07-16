# RegexLab

A comprehensive regex playground application designed to help users learn, practice, and master regular expressions.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm
- Docker (for local PostgreSQL)

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd RegexLab

# Run the setup script (recommended)
./setup.sh

# Or manually install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
npx playwright install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Validate environment
./validate-env.sh

# Start services
docker-compose up -d  # PostgreSQL
cd backend && npm run start:dev  # Backend
cd frontend && npm run dev  # Frontend
```

## 🏗️ Architecture

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, TypeORM, PostgreSQL
- **Testing**: Jest, Playwright
- **Deployment**: Vercel (Frontend), Railway (Backend)
- **Authentication**: NextAuth.js with Google OAuth

## 📁 Project Structure

```
RegexLab/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend API
├── e2e/              # End-to-end tests
├── .github/          # GitHub Actions workflows
├── setup.sh          # Setup script
├── validate-env.sh   # Environment validation
└── docker-compose.yml # Local development services
```

## 🔧 Development

### Scripts
- `./setup.sh` - Complete setup and validation
- `./validate-env.sh` - Validate environment variables
- `npm test` - Run all tests
- `npm run test:e2e` - Run E2E tests

### Environment Variables
See `.env.example` for required environment variables.

## 🚀 Deployment

The application uses GitHub Actions for CI/CD:
- **Frontend**: Automatically deployed to Vercel
- **Backend**: Automatically deployed to Railway
- **Database**: PostgreSQL on Railway

## 🧪 Testing

- **Unit Tests**: Jest for frontend and backend
- **E2E Tests**: Playwright for full application testing
- **Coverage**: Automatic coverage reporting

## 📚 Documentation

- [Environment Setup](ENVIRONMENT_VARIABLES.md)
- [Local Development](LOCAL_ENVIRONMENT.md)
- [Testing Guide](README-TESTING.md)

## 🚨 Common Issues & Solutions

### Environment Variables
- **Issue**: "NO_SECRET" errors in NextAuth
- **Solution**: Ensure `NEXTAUTH_SECRET` is set in `.env.local`

### Database Connection
- **Issue**: "password authentication failed"
- **Solution**: Check `DATABASE_URL` format and credentials

### Playwright Tests
- **Issue**: "Executable doesn't exist"
- **Solution**: Run `npx playwright install` to install browsers

### Dependencies
- **Issue**: Missing dependencies
- **Solution**: Run `./setup.sh` for complete setup

## 🔒 Security

- Environment files (`.env.local`) are ignored by git
- Production secrets are stored in GitHub repository secrets
- Database credentials are managed securely through Railway

