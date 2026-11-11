# Delhi Public International Academy (DPIA) — Indian CBSE School Management System

An authentic, modern, mobile-first Indian School ERP & Management Suite built for **Delhi Public International Academy, Pushp Vihar, New Delhi** (Affiliated with the Central Board of Secondary Education - CBSE, Affiliation No: `2130894`, School Code: `70142`).

Built with **React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Lucide Icons + jsPDF + html2canvas**.

---

## 🌟 Key Features

1. **Official CBSE Report Card & Academic Transcript (CCE 9-Point Scale)**:
   - Dynamic marks calculation for Periodic Tests (20), Half-Yearly (80), Practicals (20), and Annual Board scaling.
   - Part 1 Scholastic, Part 2 Co-Scholastic (Work Ed, Art Ed, Physical Ed, Scientific Quizzing), and Part 3 Discipline.
   - Dynamic real attendance days ratio (`attendedDays / 192 Days`).
   - Digital Principal (`Dr. Nandita Sen`) & Class Teacher signatures with official gold DPIA school seal.
   - **True 1-Click PDF Download** (`jspdf` + `html2canvas`) and print preview.

2. **CBSE Board Exam Admit Card / Hall Ticket**:
   - Official roll number slip for AISSE (Class 10) & AISSCE (Class 12).
   - Allotted examination center (`Kendriya Vidyalaya, R.K. Puram, Center No. 811042`), reporting guidelines, subject timetable datesheet, and superintendent seal.
   - Direct PDF download.

3. **Smart RFID Student ID Card with Barcode**:
   - Dual-sided student ID card with DPIA school crest, blood group, parent contact, bus route, and scannable barcode.
   - Direct PDF download.

4. **CBSE Transfer Certificate / TC (Rule 17)**:
   - Official 20-point school leaving annexure under CBSE Affiliation Bye-Laws.
   - Direct PDF download.

5. **School Bus Fleet & Live GPS Tracking**:
   - 18 AC buses covering Delhi-NCR routes (Vasant Vihar, Vasant Kunj, Munirka, Rohini, Dwarka, Noida, Golf Links).
   - Driver & conductor badges, live speed limiter status, stop schedules, and emergency SOS hotline.

6. **Daily Roll Call & Monthly Muster Roll**:
   - Mobile-first attendance marking cards (Present, Late, Absent, Leave).
   - 30-day monthly muster roll register.
   - CBSE mandatory 75% attendance shortage tracker with automated parent SMS/WhatsApp notice generation.

7. **Tuition Fee & Billing (₹ INR)**:
   - Fee invoice generation in Indian Rupees (`₹`).
   - Payment recording via UPI, NEFT, RTGS, Demand Draft, and Cheque.
   - Printable fee receipts with stamp.

8. **Timetable & Rotating Periods**:
   - 7-period daily school schedule, zero period, and laboratory practical sessions.

---

## 🚀 Quick Start (Local Setup)

```bash
# 1. Clone or extract the repository
cd dpia-cbse-school-management-system

# 2. Install dependencies
npm install

# 3. Start development server (Port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 How to Upload to GitHub (Step-by-Step)

### Option 1: Using Git Terminal (Recommended)

1. Open your terminal in the extracted project folder.
2. Run the following commands:
   ```bash
   # Initialize git repository
   git init

   # Stage all files
   git add .

   # Commit changes
   git commit -m "feat: complete DPIA CBSE School Management System"

   # Set branch to main
   git branch -M main

   # Add your GitHub repository link (create one at https://github.com/new)
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

   # Push to GitHub
   git push -u origin main
   ```

### Option 2: Upload Directly on GitHub.com (No Terminal Needed)

1. Go to [https://github.com/new](https://github.com/new) and create a new repository (e.g., `dpia-school-management`).
2. On the repository page, click the link: **"uploading an existing file"**.
3. Drag and drop all extracted project files & folders into GitHub.
4. Click **"Commit changes"**.

---

## 🌐 Free 1-Click Deployment (Hosting)

### Deploy on Vercel (Recommended):
1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New Project"** and select your repository.
3. Vercel will automatically detect:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**. Your live site is active in under 30 seconds!

---

## 🛠️ Tech Stack

- **Framework**: React 19, TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **PDF Generation**: jsPDF, html2canvas
- **Storage**: Browser LocalStorage with persistent initial CBSE mock datasets

---

## 📄 License

MIT License — Feel free to use and adapt for schools, colleges, and educational institutions.
