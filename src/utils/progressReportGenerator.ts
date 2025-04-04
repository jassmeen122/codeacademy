
import { ProgressReport, ProgressReportOptions, UserSkill, UserMetric } from "@/types/progress";
import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserProfile } from "@/hooks/useAuthState";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export async function generateProgressReport(
  userId: string,
  user: UserProfile,
  options: ProgressReportOptions,
  skills: UserSkill[],
  metrics?: UserMetric | null
): Promise<ProgressReport> {
  // Base report structure
  const report: ProgressReport = {
    user: {
      id: userId,
      name: user.full_name || user.email,
      email: user.email
    },
    summary: {
      completion_percentage: 0,
      total_time_spent: metrics?.total_time_spent || 0,
      course_completions: metrics?.course_completions || 0,
      exercises_completed: metrics?.exercises_completed || 0,
      last_activity: metrics?.updated_at || new Date().toISOString()
    },
    generated_at: new Date().toISOString()
  };

  // Add skill data if requested
  if (options.includeSkills) {
    report.skills = skills;
  }

  // Add courses data if requested
  if (options.includeCourses) {
    const { data: courses } = await supabase
      .from('student_progress')
      .select('course_id, completion_percentage, last_accessed_at')
      .eq('student_id', userId);

    if (courses && courses.length > 0) {
      const courseDetails = await Promise.all(
        courses.map(async (progress) => {
          const { data: course } = await supabase
            .from('courses')
            .select('title')
            .eq('id', progress.course_id)
            .single();

          return {
            id: progress.course_id,
            title: course?.title || 'Unknown Course',
            completion_percentage: progress.completion_percentage,
            last_accessed: progress.last_accessed_at
          };
        })
      );

      report.courses = courseDetails;
    } else {
      report.courses = [];
    }
  }

  // Add activity data if requested
  if (options.includeActivities) {
    const dateRange = options.dateRange || {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      end: new Date()
    };

    const { data: activities } = await supabase
      .from('user_activities')
      .select('created_at, activity_type')
      .eq('user_id', userId)
      .gte('created_at', dateRange.start.toISOString())
      .lte('created_at', dateRange.end.toISOString());

    if (activities && activities.length > 0) {
      // Group by date and activity type
      const activityMap = new Map();
      
      activities.forEach(activity => {
        const date = activity.created_at.split('T')[0];
        const type = activity.activity_type;
        const key = `${date}-${type}`;
        
        if (activityMap.has(key)) {
          activityMap.set(key, {
            date,
            type,
            count: activityMap.get(key).count + 1
          });
        } else {
          activityMap.set(key, {
            date,
            type,
            count: 1
          });
        }
      });
      
      report.activities = Array.from(activityMap.values());
    } else {
      report.activities = [];
    }
  }

  return report;
}

export function downloadProgressReportPdf(report: ProgressReport) {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 128);
  doc.text("Learning Progress Report", 105, 20, { align: "center" });
  
  // Add user info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`User: ${report.user.name}`, 20, 40);
  doc.text(`Email: ${report.user.email}`, 20, 47);
  doc.text(`Generated: ${new Date(report.generated_at).toLocaleDateString()}`, 20, 54);
  
  // Add summary section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 128);
  doc.text("Summary", 20, 70);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Overall Completion: ${report.summary.completion_percentage}%`, 30, 80);
  doc.text(`Total Learning Time: ${report.summary.total_time_spent} hours`, 30, 87);
  doc.text(`Courses Completed: ${report.summary.course_completions}`, 30, 94);
  doc.text(`Exercises Completed: ${report.summary.exercises_completed}`, 30, 101);
  doc.text(`Last Activity: ${new Date(report.summary.last_activity).toLocaleDateString()}`, 30, 108);
  
  let yPos = 125;
  
  // Add skills section if available
  if (report.skills && report.skills.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 128);
    doc.text("Skills Progress", 20, yPos);
    yPos += 10;
    
    doc.autoTable({
      startY: yPos,
      head: [['Skill', 'Progress', 'Last Updated']],
      body: report.skills.map(skill => [
        skill.skill_name,
        `${skill.progress}%`,
        new Date(skill.last_updated).toLocaleDateString()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 128] }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Add courses section if available
  if (report.courses && report.courses.length > 0) {
    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 128);
    doc.text("Course Progress", 20, yPos);
    yPos += 10;
    
    doc.autoTable({
      startY: yPos,
      head: [['Course', 'Completion', 'Last Accessed']],
      body: report.courses.map(course => [
        course.title,
        `${course.completion_percentage}%`,
        new Date(course.last_accessed).toLocaleDateString()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 128] }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`CodeAcademy - Learning Progress Report - Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
  }
  
  // Save the PDF
  doc.save(`progress-report-${report.user.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
  
  return doc;
}
