import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Student, GradeEntry } from '../types/school';

export interface PDFExportOptions {
  filename: string;
  orientation?: 'p' | 'portrait' | 'l' | 'landscape';
  format?: 'a4' | 'letter';
}

/**
 * Captures any HTML container element and triggers a real PDF file download.
 * Handles mobile viewport scaling and crisp multi-page or single-page fitting.
 */
export async function downloadElementAsPDF(
  element: HTMLElement,
  options: PDFExportOptions
): Promise<boolean> {
  try {
    // Temporarily ensure element styles are optimal for canvas rendering
    const originalScrollTop = element.scrollTop;
    element.scrollTop = 0;

    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolution for retina/print crispness
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: Math.max(element.scrollWidth, 900),
    });

    element.scrollTop = originalScrollTop;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const orientation = options.orientation || 'portrait';
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: options.format || 'a4',
      compress: true
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      // Perfect fit on a single page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      // If it fits within a single page with a slight scale down (up to 20%),
      // scale down to maintain single-page certificate presentation
      if (imgHeight <= pageHeight * 1.25) {
        const scaledWidth = (pageHeight * canvas.width) / canvas.height;
        const xOffset = Math.max(0, (pageWidth - scaledWidth) / 2);
        pdf.addImage(imgData, 'JPEG', xOffset, 0, scaledWidth, pageHeight);
      } else {
        // Multi-page slicing for longer documents
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
    }

    const cleanFilename = options.filename.endsWith('.pdf')
      ? options.filename
      : `${options.filename}.pdf`;

    pdf.save(cleanFilename);
    return true;
  } catch (error) {
    console.error('Canvas capture failed, falling back to programmatic PDF generation:', error);
    return false;
  }
}

/**
 * Programmatic vector fallback to generate official CBSE Report Card PDF
 * directly without relying on DOM canvas (100% reliable on all mobile devices & browsers).
 */
export function generateDirectReportCardPDF(
  student: Student,
  grades: GradeEntry[],
  overallGrade: string,
  percentage: string,
  attendedDays: number
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Page Border
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pageWidth - 16, 281);

  doc.setDrawColor(180, 140, 60);
  doc.setLineWidth(0.3);
  doc.rect(9.5, 9.5, pageWidth - 19, 278);

  // Header Letterhead
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('DELHI PUBLIC INTERNATIONAL ACADEMY', pageWidth / 2, 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Affiliated to Central Board of Secondary Education (CBSE), New Delhi', pageWidth / 2, 25, { align: 'center' });
  doc.text('Sector-IV, Institutional Area, Pushp Vihar, New Delhi - 110017', pageWidth / 2, 29, { align: 'center' });
  doc.text('CBSE Affiliation No: 2130894  |  School Code: 70142  |  Estd. 1988', pageWidth / 2, 33, { align: 'center' });

  // Divider
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);
  doc.line(12, 36, pageWidth - 12, 36);

  // Title Box
  doc.setFillColor(15, 23, 42);
  doc.rect(pageWidth / 2 - 45, 39, 90, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL CBSE ANNUAL REPORT CARD', pageWidth / 2, 44.5, { align: 'center' });

  // Scholar Bio Box
  doc.setFillColor(248, 250, 252);
  doc.rect(12, 50, pageWidth - 24, 30, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(12, 50, pageWidth - 24, 30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  doc.text(`Scholar Name: ${student.firstName} ${student.lastName}`, 16, 56);
  doc.text(`CBSE Roll No: ${student.rollNo || '12101'}`, 16, 62);
  doc.text(`Admission No: ${student.admissionNo}`, 16, 68);
  doc.text(`Class & Stream: ${student.class || `Class ${student.grade}`} (${student.stream})`, 16, 74);

  doc.text(`Father's Name: ${student.fatherName || student.guardianName}`, 110, 56);
  doc.text(`Mother's Name: ${student.motherName || 'Prof. Anjali Sharma'}`, 110, 62);
  doc.text(`House: ${student.house || 'Ashoka House'}`, 110, 68);
  doc.text(`Attendance: ${student.attendanceRate}% (${attendedDays}/192 Days)`, 110, 74);

  // Table Header
  let y = 88;
  doc.setFillColor(15, 23, 42);
  doc.rect(12, y, pageWidth - 24, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);

  doc.text('Subject Code & Name', 16, y + 5.5);
  doc.text('PT (20)', 95, y + 5.5, { align: 'center' });
  doc.text('Half-Yr (80)', 115, y + 5.5, { align: 'center' });
  doc.text('Prac (20)', 135, y + 5.5, { align: 'center' });
  doc.text('Annual (80)', 155, y + 5.5, { align: 'center' });
  doc.text('Total (100)', 175, y + 5.5, { align: 'center' });
  doc.text('Grade', 190, y + 5.5, { align: 'center' });

  y += 8;

  // Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  grades.forEach((g, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(12, y, pageWidth - 24, 8, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(12, y + 8, pageWidth - 12, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.text(`${g.courseCode}: ${g.courseName.split('(')[0]}`, 16, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.text(String(g.assignments), 95, y + 5.5, { align: 'center' });
    doc.text(String(g.midterm), 115, y + 5.5, { align: 'center' });
    doc.text(String(g.project), 135, y + 5.5, { align: 'center' });
    doc.text(String(g.finalExam), 155, y + 5.5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(String(g.totalScore), 175, y + 5.5, { align: 'center' });
    doc.text(g.letterGrade, 190, y + 5.5, { align: 'center' });

    y += 8;
  });

  // Grand Total Row
  doc.setFillColor(241, 245, 249);
  doc.rect(12, y, pageWidth - 24, 9, 'F');
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.rect(12, y, pageWidth - 24, 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('GRAND TOTAL & PERCENTAGE:', 16, y + 6);
  doc.text(`${percentage}% (Overall Grade: ${overallGrade})`, 140, y + 6);
  doc.text(`CGPA: ${(Number(percentage) / 9.5).toFixed(1)}/10`, 190, y + 6, { align: 'right' });

  y += 15;

  // Part 2 Co-Scholastic & Discipline
  doc.setFillColor(248, 250, 252);
  doc.rect(12, y, 90, 32, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(12, y, 90, 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Part 2: Co-Scholastic Areas', 16, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('• Work Education (Robotics & AI): Grade A', 16, y + 12);
  doc.text('• Art Education (Visual & Performing): Grade A', 16, y + 18);
  doc.text('• Health & Physical Education: Grade A', 16, y + 24);
  doc.text('• Scientific Inquiry & Debating: Grade A', 16, y + 30);

  // Part 3 Discipline
  doc.setFillColor(248, 250, 252);
  doc.rect(106, y, pageWidth - 118, 32, 'F');
  doc.rect(106, y, pageWidth - 118, 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Part 3: Discipline & Annual Status', 110, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`• Attendance Discipline: Exemplary (${student.attendanceRate}%)`, 110, y + 12);
  doc.text('• Moral Values & Sincerity: Grade A', 110, y + 18);
  doc.text('• Annual Result: PASSED WITH DISTINCTION', 110, y + 24);
  doc.text('• Promotional Status: Promoted to Higher Cohort', 110, y + 30);

  y += 38;

  // Remarks
  doc.setFillColor(254, 252, 232);
  doc.rect(12, y, pageWidth - 24, 16, 'F');
  doc.setDrawColor(254, 240, 138);
  doc.rect(12, y, pageWidth - 24, 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(113, 63, 18);
  doc.text('Principal & Academic Council Observations:', 16, y + 5);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(68, 64, 60);
  doc.text(
    `"${student.remarks || `${student.firstName} has shown exemplary performance, high discipline, and remarkable aptitude in CBSE coursework.`}"`,
    16,
    y + 11
  );

  y += 24;

  // Signatures
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(16, y + 10, 60, y + 10);
  doc.line(pageWidth - 60, y + 10, pageWidth - 16, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. Rajeshwar Sharma', 16, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Class Teacher / Mentor', 16, y + 19);

  // Seal in center
  doc.setDrawColor(180, 140, 60);
  doc.setLineWidth(0.6);
  doc.circle(pageWidth / 2, y + 12, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(161, 98, 7);
  doc.text('DPIA DELHI', pageWidth / 2, y + 10, { align: 'center' });
  doc.text('OFFICIAL SEAL', pageWidth / 2, y + 13, { align: 'center' });
  doc.text('CBSE: 2130894', pageWidth / 2, y + 16, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. Nandita Sen, Ph.D.', pageWidth - 16, y + 15, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Principal & Member Secretary', pageWidth - 16, y + 19, { align: 'right' });

  // Footer date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Issued on: 06-Nov-2026 | Central Board of Secondary Education Official Record | New Delhi', pageWidth / 2, 282, { align: 'center' });

  doc.save(`CBSE_Report_Card_${student.firstName}_${student.lastName}_${student.rollNo || '12101'}.pdf`);
}
