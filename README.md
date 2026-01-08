# CareerSync AI - Intelligent Job Application & Career Development Platform

> **Phase 1 & 2 Implementation**: User Authentication + Application Tracking + Resume Analysis + Cover Letter Generation + Advanced Analytics

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (if running locally)
- PHP 8.2+ (if running locally)
- Python 3.11+ (if running locally)

### Using Docker (Recommended)

```bash
# 1. Clone/navigate to project
cd careersync-ai

# 2. Start all services
docker-compose up -d

# 3. Initialize database (in new terminal)
docker-compose exec backend php artisan migrate

# 4. Seed sample data
docker-compose exec backend php artisan db:seed

# 5. Access applications
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- ML Service: http://localhost:8001
- PostgreSQL: localhost:5432
```

## 📋 Project Structure

```
careersync-ai/
├── backend/                          # Laravel API
│   ├── app/
│   │   ├── Models/                  # Database models
│   │   ├── Http/Controllers/Api/   # API controllers
│   │   └── Services/               # Business logic
│   ├── database/
│   │   └── migrations/             # Database schemas
│   ├── routes/
│   │   └── api.php                # API routes
│   └── .env.example               # Environment template
│
├── frontend/                         # Next.js Dashboard
│   ├── app/
│   │   ├── login/                 # Auth page
│   │   ├── dashboard/             # Main dashboard
│   │   ├── applications/          # Application tracker
│   │   ├── resume-analyzer/       # Resume analysis
│   │   └── cover-letter/          # Cover letter generator
│   ├── lib/
│   │   ├── api.ts                # API client
│   │   └── store.ts              # Zustand store
│   └── package.json
│
├── ml-service/                       # Python ML Service
│   ├── main.py                   # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   └── Dockerfile
│
└── docker-compose.yml            # Multi-container setup
```

## 🎯 Phase 1: MVP Features (✅ Complete)

### User Authentication
- [x] User registration with email/password
- [x] Login with JWT tokens
- [x] Profile management
- [x] Secure token storage

### Application Tracking
- [x] Create, read, update, delete applications
- [x] Track application status (applied, reviewing, interview, rejected, offer)
- [x] Store job description for later reference
- [x] Track salary ranges and job URLs

### Basic Dashboard
- [x] Application summary (counts by status)
- [x] Pagination for application list
- [x] Status filtering
- [x] Date-based tracking

## 🤖 Phase 2: Core AI Features (✅ Complete)

### Resume Analyzer
- [x] ATS Compatibility Score (0-100)
- [x] Keyword gap analysis
- [x] Skills match percentage
- [x] Formatting recommendations
- [x] Actionable improvements

### Success Prediction Model v1
- [x] Resume match scoring
- [x] Market demand analysis
- [x] Company response prediction
- [x] Application timing scoring
- [x] Overall success probability (0-100)

### Cover Letter Generator
- [x] AI-powered personalized content generation
- [x] Tone detection (formal, professional, casual)
- [x] Company-specific customization
- [x] Job description integration
- [x] Copy-to-clipboard functionality

### Advanced Analytics Dashboard
- [x] Funnel conversion rates
  - Application → Response Rate
  - Response → Interview Rate
  - Interview → Offer Rate
- [x] Application trends (last 30 days)
- [x] Average AI score tracking
- [x] Skill gap analysis
- [x] Top performing companies

### LinkedIn Integration (Ready)
- [ ] OAuth setup (configure credentials)
- [ ] Profile import
- [ ] Connection analysis

## 🔧 API Endpoints

### Authentication
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login user
POST   /api/v1/auth/logout            # Logout (protected)
GET    /api/v1/auth/profile           # Get profile (protected)
PUT    /api/v1/auth/profile           # Update profile (protected)
```

### Applications
```
GET    /api/v1/applications           # List applications (protected)
POST   /api/v1/applications           # Create application (protected)
GET    /api/v1/applications/{id}      # Get application (protected)
PUT    /api/v1/applications/{id}      # Update application (protected)
DELETE /api/v1/applications/{id}      # Delete application (protected)
```

### Resume Analysis
```
POST   /api/v1/resume/analyze         # Analyze resume (protected)
GET    /api/v1/resume/analyses        # List analyses (protected)
GET    /api/v1/resume/analyses/{id}   # Get analysis (protected)
```

### Cover Letters
```
POST   /api/v1/cover-letters/generate # Generate letter (protected)
GET    /api/v1/cover-letters          # List letters (protected)
GET    /api/v1/cover-letters/{id}     # Get letter (protected)
```

### Analytics
```
GET    /api/v1/analytics/dashboard    # Dashboard metrics (protected)
GET    /api/v1/analytics/trends       # Application trends (protected)
GET    /api/v1/analytics/skills       # Skill analysis (protected)
```

## 🤖 ML Service Endpoints

### Resume Analysis
```
POST   /api/analyze-resume
Request:
{
  "resume_text": "...",
  "job_description": "..."
}
Response:
{
  "ats_score": 85,
  "keyword_gaps": ["Python", "AWS"],
  "skills_match_percentage": 72,
  "formatting_issues": [...],
  "recommendations": [...]
}
```

### Success Prediction
```
POST   /api/predict-success
Request:
{
  "job_description": "...",
  "user_skills": ["PHP", "Laravel"],
  "company_name": "TechCorp"
}
Response:
{
  "success_probability": 0.72,
  "confidence_score": 0.85
}
```

### Cover Letter Generation
```
POST   /api/generate-cover-letter
Request:
{
  "company_name": "TechCorp",
  "position_title": "Senior Developer",
  "user_profile": {...},
  "company_info": "...",
  "job_description": "..."
}
Response:
{
  "content": "Dear...",
  "tone": "professional"
}
```

## 📊 Database Schema

### Users Table
```sql
- id (UUID Primary Key)
- name, email, password
- current_role, target_role
- years_of_experience
- skills (JSON array)
- career_preferences (JSON)
- encrypted_resume (text)
- timestamps
```

### Applications Table
```sql
- id (UUID Primary Key)
- user_id (Foreign Key)
- company_name, position_title
- status (applied|reviewing|interview|rejected|offer)
- applied_at (timestamp)
- ai_score (decimal)
- job_description, salary_range, job_url
- stage_history (JSON)
- timestamps
```

### Resume Analyses Table
```sql
- id
- user_id (Foreign Key)
- resume_text
- ats_score, skills_match_percentage
- keyword_gaps, formatting_issues, recommendations (JSON)
- version_number
- timestamps
```

### Success Predictions Table
```sql
- id
- application_id (Foreign Key)
- resume_match_score, application_timing_score
- network_connection_score, market_demand_score
- success_probability, confidence_score
- model_version
- timestamps
```

### Additional Tables
- ai_insights
- application_stage_updates
- cover_letters
- learning_paths

## 🔐 Security Features

- [x] JWT/Sanctum authentication
- [x] Protected API routes
- [x] CORS configuration
- [x] Password hashing
- [x] Environment variables
- [ ] HTTPS/SSL (production)
- [ ] Rate limiting
- [ ] GDPR compliance

## 🚀 Deployment

### Using Docker
```bash
# Production build
docker-compose -f docker-compose.yml up -d

# Database migration
docker-compose exec backend php artisan migrate --force

# Restart services
docker-compose restart
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
```
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=careersync_db
DB_USERNAME=careersync_user
DB_PASSWORD=secure_password

ML_SERVICE_URL=http://ml-service:8001

LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

OPENAI_API_KEY=your_api_key
```

## 📈 Performance Metrics

- API Response Time: < 200ms (target)
- ATS Score Calculation: < 500ms
- Resume Analysis: < 2s
- Cover Letter Generation: < 5s
- Database Queries: Indexed for performance

## 🧪 Testing

```bash
# Backend tests
docker-compose exec backend php artisan test

# Frontend tests
docker-compose exec frontend npm test

# API testing
# Use Postman collection at ./docs/postman_collection.json
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check postgres is running
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
docker-compose exec backend php artisan migrate
```

### ML Service Not Responding
```bash
# Check ML service logs
docker-compose logs ml-service

# Restart ML service
docker-compose restart ml-service
```

### Frontend Can't Connect to API
```bash
# Update NEXT_PUBLIC_API_URL in frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Restart frontend
docker-compose restart frontend
```

## 📚 Next Steps (Phase 3)

- [ ] Market intelligence engine
- [ ] Interview performance tracker
- [ ] Learning path recommendations
- [ ] Multi-platform job aggregation
- [ ] Real-time notifications with WebSockets
- [ ] LinkedIn API integration
- [ ] Gmail integration for application tracking
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 📧 Support

For support, email: support@careersync.ai

---

**Built with ❤️ for career success**
