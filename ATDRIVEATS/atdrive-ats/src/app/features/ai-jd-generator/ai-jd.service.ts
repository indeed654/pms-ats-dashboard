import { Injectable } from '@angular/core';

export interface JobDescriptionInput {
  jobTitle: string;
  department: string;
  experienceLevel: string;
  employmentType: string;
  skills: string[];
  location: string;
  tone: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiJdService {
  constructor() {}

  generateJobDescription(input: JobDescriptionInput): string {
    const { jobTitle, department, experienceLevel, employmentType, skills, location, tone } = input;
    
    // Define tone-specific language styles
    const toneStyles: Record<string, { header: string; bulletPrefix: string; toneWord: string }> = {
      'Professional': { header: 'We are seeking', bulletPrefix: '- ', toneWord: 'professional' },
      'Startup': { header: 'We\'re looking for', bulletPrefix: '• ', toneWord: 'dynamic' },
      'Corporate': { header: 'We are hiring for', bulletPrefix: '→ ', toneWord: 'strategic' },
      'Friendly': { header: 'Come join us as', bulletPrefix: '✓ ', toneWord: 'collaborative' }
    };
    
    const style = toneStyles[tone] || toneStyles['Professional'];
    
    // Generate the job description based on inputs
    const jobDescription = `
# ${jobTitle} - ${department}

## Role Overview
${style.header} a ${experienceLevel.toLowerCase()} ${jobTitle} to join our ${department.toLowerCase()} team as a ${employmentType.toLowerCase()} employee. This is a ${style.toneWord} opportunity for someone with expertise in ${skills.join(', ')}.

## Responsibilities
${style.bulletPrefix}Develop and maintain high-quality software solutions
${style.bulletPrefix}Collaborate with cross-functional teams to define requirements
${style.bulletPrefix}Participate in code reviews and contribute to best practices
${style.bulletPrefix}Troubleshoot and debug issues as they arise
${style.bulletPrefix}Stay up-to-date with emerging technologies and industry trends

## Required Skills
${skills.map(skill => `${style.bulletPrefix}${skill}`).join('\n')}

## Nice-to-Have Skills
${style.bulletPrefix}Experience with cloud platforms (AWS, Azure, or GCP)
${style.bulletPrefix}Knowledge of agile methodologies
${style.bulletPrefix}Familiarity with CI/CD pipelines
${style.bulletPrefix}Experience with testing frameworks

## Benefits
${style.bulletPrefix}Competitive salary and performance bonuses
${style.bulletPrefix}Health, dental, and vision insurance
${style.bulletPrefix}${location.toLowerCase() === 'remote' ? 'Flexible remote work options' : `On-site amenities and ${location.toLowerCase()} work arrangement`}
${style.bulletPrefix}Professional development opportunities
${style.bulletPrefix}Stock options and retirement plans

---

*This job description was generated using AtDrive's AI Job Description Generator. Tailor it to your specific needs before posting.*
    `.trim();

    return jobDescription;
  }
}