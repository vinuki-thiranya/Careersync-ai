from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import logging

app = FastAPI(title="CareerSync ML Service", version="1.0.0")
logger = logging.getLogger(__name__)

# Models
class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None

class ResumeAnalysisResponse(BaseModel):
    ats_score: int
    keyword_gaps: List[str]
    skills_match_percentage: int
    formatting_issues: List[str]
    recommendations: List[str]

class SuccessPredictionRequest(BaseModel):
    job_description: str
    user_skills: Optional[List[str]] = None
    company_name: str

class SuccessPredictionResponse(BaseModel):
    success_probability: float
    confidence_score: float

class CoverLetterRequest(BaseModel):
    company_name: str
    position_title: str
    user_profile: Dict
    company_info: Optional[str] = None
    job_description: Optional[str] = None

class CoverLetterResponse(BaseModel):
    content: str
    tone: str

# Skill database
TECH_SKILLS = {
    'programming': ['Python', 'JavaScript', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Kotlin'],
    'frameworks': ['Django', 'Flask', 'FastAPI', 'React', 'Vue', 'Angular', 'Laravel', 'Spring', 'Express'],
    'databases': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra'],
    'devops': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Jenkins', 'GitLab CI', 'GitHub Actions'],
    'tools': ['Git', 'Linux', 'JIRA', 'Figma', 'VS Code', 'DataDog', 'Grafana', 'Prometheus'],
    'concepts': ['REST API', 'GraphQL', 'Microservices', 'Machine Learning', 'Deep Learning', 'NLP']
}

@app.get("/")
async def root():
    return {
        "service": "CareerSync AI ML Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.post("/api/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(request: ResumeAnalysisRequest):
    """
    Analyze resume for ATS compatibility, keyword gaps, and recommendations
    """
    try:
        resume_text = request.resume_text.lower()
        
        # ATS Score (0-100)
        ats_score = calculate_ats_score(resume_text)
        
        # Extract skills from resume
        resume_skills = extract_skills(resume_text)
        
        # Keyword gaps
        job_description = request.job_description or ""
        job_skills = extract_skills(job_description) if job_description else []
        keyword_gaps = list(set(job_skills) - set(resume_skills))[:5]
        
        # Skills match percentage
        if job_skills:
            skills_match = (len(set(resume_skills) & set(job_skills)) / len(job_skills)) * 100
        else:
            skills_match = 75
        
        # Formatting issues
        formatting_issues = check_formatting_issues(resume_text)
        
        # Recommendations
        recommendations = generate_recommendations(
            ats_score, 
            skills_match, 
            keyword_gaps,
            resume_skills
        )
        
        return ResumeAnalysisResponse(
            ats_score=int(ats_score),
            keyword_gaps=keyword_gaps,
            skills_match_percentage=int(skills_match),
            formatting_issues=formatting_issues,
            recommendations=recommendations
        )
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict-success", response_model=SuccessPredictionResponse)
async def predict_success(request: SuccessPredictionRequest):
    """
    Predict application success probability based on multiple factors
    """
    try:
        # Calculate component scores (0-100)
        job_text = request.job_description or request.position_title
        user_skills = request.user_skills or []
        
        # Resume match score
        resume_match = calculate_resume_match_score(job_text, user_skills)
        
        # Market demand score (based on skill frequency)
        market_demand = calculate_market_demand_score(job_text)
        
        # Company response history score (simulated)
        company_response = get_company_response_score(request.company_name)
        
        # Application timing score
        timing_score = calculate_timing_score()
        
        # Weighted calculation
        weights = {
            'resume_match': 0.35,
            'market_demand': 0.20,
            'company_response': 0.25,
            'timing': 0.20
        }
        
        success_probability = (
            resume_match * weights['resume_match'] +
            market_demand * weights['market_demand'] +
            company_response * weights['company_response'] +
            timing_score * weights['timing']
        ) / 100
        
        # Confidence based on data completeness
        confidence = 0.85 if request.job_description else 0.65
        
        return SuccessPredictionResponse(
            success_probability=round(success_probability, 2),
            confidence_score=round(confidence, 2)
        )
    except Exception as e:
        logger.error(f"Error predicting success: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(request: CoverLetterRequest):
    """
    Generate a personalized cover letter
    """
    try:
        # Parse company info and job description for tone
        tone = determine_tone(request.company_info, request.job_description)
        
        # Generate cover letter content
        content = generate_cover_letter_content(
            request.company_name,
            request.position_title,
            request.user_profile,
            tone
        )
        
        return CoverLetterResponse(
            content=content,
            tone=tone
        )
    except Exception as e:
        logger.error(f"Error generating cover letter: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
def calculate_ats_score(resume_text: str) -> float:
    """Calculate ATS compatibility score"""
    score = 100
    
    # Check for common ATS issues
    if len(resume_text) < 100:
        score -= 20
    if resume_text.count('\n') < 10:
        score -= 15
    if 'contact' not in resume_text:
        score -= 10
    if 'email' not in resume_text:
        score -= 10
    if 'experience' not in resume_text and 'work' not in resume_text:
        score -= 15
    if 'skills' not in resume_text:
        score -= 10
    if 'education' not in resume_text:
        score -= 10
    
    # Boost for good structure
    if 'summary' in resume_text or 'professional' in resume_text:
        score += 5
    
    return max(0, min(100, score))

def extract_skills(text: str) -> List[str]:
    """Extract skills from text"""
    text_lower = text.lower()
    found_skills = []
    
    for category, skills in TECH_SKILLS.items():
        for skill in skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)
    
    return list(set(found_skills))

def check_formatting_issues(resume_text: str) -> List[str]:
    """Check for common formatting issues"""
    issues = []
    
    if resume_text.count('\n') < 5:
        issues.append("Resume appears to have poor structure/formatting")
    if len(resume_text.split()) > 1000:
        issues.append("Resume might be too long (consider keeping it to 1-2 pages)")
    if not any(char.isdigit() for char in resume_text):
        issues.append("Consider adding quantifiable metrics and numbers to achievements")
    
    return issues[:3]

def generate_recommendations(ats_score: int, skills_match: float, 
                            keyword_gaps: List[str], resume_skills: List[str]) -> List[str]:
    """Generate recommendations for resume improvement"""
    recommendations = []
    
    if ats_score < 70:
        recommendations.append("Improve resume structure and formatting for better ATS compatibility")
    
    if skills_match < 50:
        recommendations.append(f"Add missing in-demand skills: {', '.join(keyword_gaps[:3])}")
    
    if len(resume_skills) < 5:
        recommendations.append("Expand technical skills section to showcase broader expertise")
    
    recommendations.append("Add quantifiable achievements and metrics to your experience")
    recommendations.append("Include industry-specific keywords from job descriptions")
    
    return recommendations[:5]

def calculate_resume_match_score(job_text: str, user_skills: List[str]) -> float:
    """Calculate how well resume matches job description"""
    if not user_skills or not job_text:
        return 50.0
    
    job_skills = extract_skills(job_text)
    if not job_skills:
        return 60.0
    
    matched = len(set(user_skills) & set(job_skills))
    score = (matched / len(job_skills)) * 100
    return min(100, score)

def calculate_market_demand_score(job_text: str) -> float:
    """Calculate market demand based on skill frequency"""
    skills = extract_skills(job_text)
    
    # Higher demand for multiple skills mentioned
    demand_boost = min(len(skills) * 10, 40)
    
    # Check for senior roles
    if any(word in job_text.lower() for word in ['senior', 'lead', 'principal', 'architect']):
        demand_boost += 20
    
    return min(100, 50 + demand_boost)

def get_company_response_score(company_name: str) -> float:
    """Get simulated company response score"""
    # In production, this would use historical data
    base_score = 60
    company_lower = company_name.lower()
    
    # Boost for known large companies
    fortune_500 = ['google', 'amazon', 'microsoft', 'apple', 'meta', 'tesla']
    if any(company in company_lower for company in fortune_500):
        base_score -= 15  # Slightly lower due to higher competition
    
    return base_score + np.random.randint(-10, 10)

def calculate_timing_score() -> float:
    """Calculate application timing score"""
    # Weekday applications tend to do better
    from datetime import datetime
    weekday = datetime.now().weekday()
    
    if weekday < 5:  # Weekday
        return 75.0
    else:  # Weekend
        return 65.0

def determine_tone(company_info: Optional[str], job_desc: Optional[str]) -> str:
    """Determine appropriate tone for cover letter"""
    combined_text = (company_info or "") + (job_desc or "")
    text_lower = combined_text.lower()
    
    if any(word in text_lower for word in ['startup', 'innovation', 'creative', 'young']):
        return 'casual'
    elif any(word in text_lower for word in ['enterprise', 'corporate', 'finance', 'law']):
        return 'formal'
    else:
        return 'professional'

def generate_cover_letter_content(company_name: str, position_title: str, 
                                 user_profile: Dict, tone: str) -> str:
    """Generate cover letter content"""
    
    opening_lines = {
        'formal': f"Dear Hiring Manager at {company_name},\n\nI am writing to express my strong interest in the {position_title} position.",
        'professional': f"Dear {company_name} Team,\n\nI am excited to apply for the {position_title} role and bring my experience to your organization.",
        'casual': f"Hi {company_name} Team,\n\nI'm really interested in the {position_title} position and think I'd be a great fit."
    }
    
    middle_section = f"""

With my background in {user_profile.get('role', 'technology')} and expertise in {', '.join(user_profile.get('skills', ['software development'])[:3])}, 
I am confident I can make a significant contribution to your team. Throughout my career, I have demonstrated 
a strong ability to deliver results and collaborate effectively with cross-functional teams.

I am particularly drawn to this opportunity because of {company_name}'s reputation for innovation and excellence. 
I am eager to bring my skills and passion to contribute to your organization's continued success.
"""
    
    closing_lines = {
        'formal': "\nThank you for considering my application. I look forward to discussing how I can contribute to your organization.\n\nSincerely,",
        'professional': "\nThank you for considering my application. I would welcome the opportunity to discuss how I can add value to your team.\n\nBest regards,",
        'casual': "\nThanks for reading my application! I'd love to chat more about how I can help the team.\n\nCheers,"
    }
    
    name = user_profile.get('name', 'Your Name')
    
    return opening_lines[tone] + middle_section + closing_lines[tone] + f"\n{name}"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
