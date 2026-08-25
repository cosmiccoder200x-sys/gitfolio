import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData, GitHubUser, GitHubRepo, PortfolioTheme, PortfolioSettings } from '../types';

export async function exportResumeToPdf(elementId: string, fileName: string = 'ATS_Resume.pdf'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume element with ID "${elementId}" not found`);
  }

  // Create canvas from the resume preview element
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution for crisp PDF text
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate height to fit page width
  const ratio = canvasHeight / canvasWidth;
  const renderHeight = pdfWidth * ratio;

  if (renderHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderHeight);
  } else {
    // Multi-page handling if content exceeds one page
    let heightLeft = renderHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, renderHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - renderHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, renderHeight);
      heightLeft -= pdfHeight;
    }
  }

  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
}

export function exportToJsonResume(resume: ResumeData): void {
  const jsonResumeFormat = {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: resume.personal.fullName,
      label: resume.personal.title,
      email: resume.personal.email,
      phone: resume.personal.phone,
      url: resume.personal.website,
      summary: resume.personal.summary,
      location: {
        address: resume.personal.location,
      },
      profiles: [
        {
          network: 'GitHub',
          username: resume.personal.githubUrl.split('/').pop(),
          url: resume.personal.githubUrl,
        },
        {
          network: 'LinkedIn',
          username: resume.personal.linkedinUrl.split('/').pop(),
          url: resume.personal.linkedinUrl,
        },
      ].filter((p) => p.url),
    },
    work: resume.experience.map((exp) => ({
      name: exp.company,
      position: exp.role,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.isCurrent ? 'Present' : exp.endDate,
      highlights: exp.bullets,
    })),
    projects: resume.projects.map((proj) => ({
      name: proj.name,
      description: proj.description,
      highlights: proj.bullets,
      keywords: proj.techStack,
      url: proj.liveUrl || proj.githubUrl,
    })),
    skills: [
      { name: 'Languages', keywords: resume.skills.languages },
      { name: 'Frameworks & Libraries', keywords: resume.skills.frameworks },
      { name: 'Cloud & DevOps', keywords: resume.skills.cloudAndDevOps },
      { name: 'Databases & Tools', keywords: resume.skills.databasesAndTools },
      { name: 'Core Concepts', keywords: resume.skills.concepts },
    ].filter((s) => s.keywords && s.keywords.length > 0),
    education: resume.education.map((edu) => ({
      institution: edu.institution,
      area: edu.degree,
      endDate: edu.graduationYear,
      score: edu.gpa,
      courses: edu.honors ? [edu.honors] : [],
    })),
    certificates: resume.certifications.map((cert) => ({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.issueDate,
      url: cert.credentialUrl,
    })),
  };

  const blob = new Blob([JSON.stringify(jsonResumeFormat, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resume.personal.fullName.replace(/\s+/g, '_')}_Resume.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateStandalonePortfolioHtml(
  user: GitHubUser,
  repos: GitHubRepo[],
  resume: ResumeData,
  theme: PortfolioTheme,
  settings: PortfolioSettings
): string {
  const selectedRepos = repos.filter((r) => r.selectedForPortfolio);
  const name = resume.personal.fullName || user.name || user.login;
  const title = settings.customTagline || resume.personal.title || user.bio || 'Software Engineer';
  const bio = resume.personal.summary || user.bio || 'Welcome to my developer portfolio.';
  const email = settings.contactEmail || resume.personal.email || user.email || 'developer@example.com';
  const location = resume.personal.location || user.location || '';
  const githubUrl = user.html_url || resume.personal.githubUrl || `https://github.com/${user.login}`;
  const linkedinUrl = resume.personal.linkedinUrl || '#';
  const website = resume.personal.website || user.blog || '#';

  // Theme-specific styles
  let themeCss = '';
  let themeClass = '';

  if (theme === 'minimalist' || theme === 'editorial') {
    themeClass = 'theme-minimalist';
    themeCss = `
      body { background-color: #faf9f6; color: #18181b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
      h1, h2, h3, .heading-font { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; letter-spacing: -0.02em; color: #09090b; }
      p, span, .body-font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .card { background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      .card:hover { border-color: #18181b; box-shadow: 0 8px 20px -4px rgba(0,0,0,0.08); transform: translateY(-2px); }
      .accent-text { color: #18181b; text-decoration: underline; text-decoration-color: #a1a1aa; text-underline-offset: 6px; }
      .badge { background: #f4f4f5; color: #3f3f46; border: 1px solid #e4e4e7; font-size: 11px; font-weight: 500; }
      .btn-primary { background: #18181b; color: #fafafa; border-radius: 6px; font-weight: 600; }
      .btn-primary:hover { background: #27272a; }
      .nav-bar { background: rgba(250, 249, 246, 0.92); backdrop-filter: blur(12px); border-bottom: 1px solid #e4e4e7; }
    `;
  } else if (theme === 'professional' || theme === 'clean') {
    themeClass = 'theme-professional';
    themeCss = `
      body { background-color: #0b0f19; color: #f1f5f9; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      h1, h2, h3, .heading-font { font-family: 'Inter', system-ui, sans-serif; font-weight: 800; letter-spacing: -0.03em; }
      .card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); transition: all 0.25s ease; }
      .card:hover { border-color: #3b82f6; transform: translateY(-3px); box-shadow: 0 15px 35px -5px rgba(59, 130, 246, 0.15); }
      .accent-text { color: #60a5fa; }
      .badge { background: rgba(37, 99, 235, 0.12); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); font-weight: 600; font-size: 11px; }
      .btn-primary { background: #2563eb; color: #ffffff; border-radius: 8px; font-weight: 700; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); }
      .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
      .nav-bar { background: rgba(11, 15, 25, 0.9); backdrop-filter: blur(16px); border-bottom: 1px solid #1f2937; }
    `;
  } else if (theme === 'creative' || theme === 'neobrutalist') {
    themeClass = 'theme-creative';
    themeCss = `
      body { background-color: #090614; color: #f5f3ff; font-family: 'Space Grotesk', system-ui, sans-serif; }
      h1, h2, h3, .heading-font { font-family: 'Space Grotesk', system-ui, sans-serif; font-weight: 800; letter-spacing: -0.02em; }
      .card { background: #120d26; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.12); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
      .card:hover { border-color: #c084fc; box-shadow: 0 12px 40px rgba(168, 85, 247, 0.25); transform: translateY(-4px) scale(1.01); }
      .accent-text { background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; }
      .badge { background: rgba(168, 85, 247, 0.15); color: #e9d5ff; border: 1px solid rgba(168, 85, 247, 0.35); font-weight: 700; font-size: 11px; }
      .btn-primary { background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: #ffffff; border-radius: 12px; font-weight: 800; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4); border: 1px solid rgba(255, 255, 255, 0.15); }
      .btn-primary:hover { opacity: 0.95; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(219, 39, 119, 0.5); }
      .nav-bar { background: rgba(9, 6, 20, 0.88); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(139, 92, 246, 0.25); }
    `;
  } else {
    // Default fallback: Terminal
    themeClass = 'theme-terminal';
    themeCss = `
      body { background-color: #0d1117; color: #58a6ff; font-family: 'JetBrains Mono', 'Fira Code', monospace; }
      .card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; transition: transform 0.2s, border-color 0.2s; }
      .card:hover { border-color: #58a6ff; transform: translateY(-2px); }
      .accent-text { color: #3fb950; }
      .badge { background: #21262d; color: #79c0ff; border: 1px solid #30363d; }
      .btn-primary { background: #238636; color: #ffffff; border: 1px solid rgba(240,246,252,0.1); }
      .btn-primary:hover { background: #2ea043; }
      .nav-bar { background: rgba(13,17,23,0.9); border-bottom: 1px solid #30363d; }
      .cmd-prefix { color: #8b949e; }
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} | Developer Portfolio & Systems Architect</title>
  <meta name="description" content="${bio.slice(0, 160)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${themeCss}
    html { scroll-behavior: smooth; }
  </style>
</head>
<body class="${themeClass} min-h-screen antialiased">

  <!-- Navigation -->
  <nav class="nav-bar sticky top-0 z-50 px-6 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <a href="#hero" class="text-xl font-bold tracking-tight flex items-center gap-2">
        <span>${theme === 'terminal' ? '$ ~/dev/' + user.login : name}</span>
      </a>
      <div class="flex items-center gap-6 text-sm font-medium">
        <a href="#projects" class="hover:underline">Projects</a>
        <a href="#experience" class="hover:underline">Experience</a>
        <a href="#skills" class="hover:underline">Skills</a>
        <a href="#contact" class="btn-primary px-4 py-2 rounded-md font-semibold transition">Get in Touch</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header id="hero" class="max-w-6xl mx-auto px-6 pt-16 pb-12">
    <div class="flex flex-col md:flex-row items-center gap-8 justify-between">
      <div class="flex-1 space-y-4">
        ${
          theme === 'terminal'
            ? '<p class="text-sm cmd-prefix font-mono">// System architect & open source contributor</p>'
            : ''
        }
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
          Hi, I'm <span class="accent-text">${name}</span>
        </h1>
        <p class="text-xl opacity-90 leading-relaxed font-medium max-w-2xl">
          ${title}
        </p>
        <p class="text-base opacity-75 max-w-2xl leading-relaxed">
          ${bio}
        </p>
        <div class="pt-4 flex flex-wrap gap-4 items-center">
          <a href="#contact" class="btn-primary px-6 py-3 rounded-md font-semibold inline-flex items-center gap-2 transition">
            Contact Me
          </a>
          <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="card px-5 py-3 font-semibold inline-flex items-center gap-2">
            GitHub Profile (${user.public_repos} Repos)
          </a>
        </div>
      </div>
      ${
        user.avatar_url
          ? `<div class="relative">
              <img src="${user.avatar_url}" alt="${name}" class="w-44 h-44 md:w-52 md:h-52 rounded-full object-cover shadow-2xl border-4 ${
                theme === 'creative'
                  ? 'border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                  : theme === 'professional'
                  ? 'border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.3)]'
                  : 'border-zinc-300 shadow-lg'
              }">
              <div class="absolute -bottom-2 -right-2 card px-3 py-1 text-xs font-bold rounded-full">
                ★ ${repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)} Stars
              </div>
            </div>`
          : ''
      }
    </div>
  </header>

  <!-- Featured Projects -->
  <section id="projects" class="max-w-6xl mx-auto px-6 py-12">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Featured Repositories & Projects</h2>
        <p class="text-sm opacity-70 mt-1">Live software solutions, open-source engines, and tooling</p>
      </div>
      <a href="${githubUrl}?tab=repositories" target="_blank" class="text-sm font-semibold hover:underline">
        View all on GitHub →
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${selectedRepos
        .map(
          (repo) => `
        <div class="card p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-4 mb-2">
              <h3 class="text-lg font-bold">
                <a href="${repo.html_url}" target="_blank" class="hover:underline flex items-center gap-1.5">
                  ${repo.name}
                </a>
              </h3>
              <span class="badge px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                ★ ${repo.stargazers_count}
              </span>
            </div>
            <p class="text-sm opacity-80 mb-4 leading-relaxed">
              ${repo.description || 'Modern software project with automated testing and deployment.'}
            </p>
            ${
              repo.customBullets && repo.customBullets.length > 0
                ? `<ul class="list-disc list-inside text-xs opacity-90 space-y-1 mb-4">
                    ${repo.customBullets.map((b) => `<li>${b}</li>`).join('')}
                  </ul>`
                : ''
            }
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-200/20">
            <div class="flex flex-wrap gap-1.5">
              ${(repo.topics && repo.topics.length > 0 ? repo.topics : [repo.language || 'Code'])
                .slice(0, 4)
                .map((t) => `<span class="badge px-2 py-0.5 text-xs rounded">${t}</span>`)
                .join('')}
            </div>
            <a href="${repo.html_url}" target="_blank" class="text-xs font-bold hover:underline">
              Code & Docs ↗
            </a>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  </section>

  <!-- Work Experience -->
  ${
    resume.experience && resume.experience.length > 0
      ? `
    <section id="experience" class="max-w-6xl mx-auto px-6 py-12">
      <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-8">Work Experience</h2>
      <div class="space-y-6">
        ${resume.experience
          .map(
            (exp) => `
          <div class="card p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
              <div>
                <h3 class="text-lg font-bold">${exp.role}</h3>
                <p class="text-sm opacity-80 font-medium">${exp.company} • ${exp.location}</p>
              </div>
              <span class="badge px-3 py-1 rounded text-xs font-semibold self-start md:self-auto">
                ${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}
              </span>
            </div>
            <ul class="list-disc list-inside space-y-1.5 text-sm opacity-90 leading-relaxed mb-4">
              ${exp.bullets.map((b) => `<li>${b}</li>`).join('')}
            </ul>
            ${
              exp.techStack && exp.techStack.length > 0
                ? `<div class="flex flex-wrap gap-1.5 pt-2">
                    ${exp.techStack.map((t) => `<span class="badge px-2 py-0.5 text-xs rounded">${t}</span>`).join('')}
                  </div>`
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>
    </section>
  `
      : ''
  }

  <!-- Skills & Competencies -->
  <section id="skills" class="max-w-6xl mx-auto px-6 py-12">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-8">Technical Proficiencies</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-5">
        <h3 class="text-sm font-bold uppercase tracking-wider mb-3 opacity-70">Languages</h3>
        <div class="flex flex-wrap gap-1.5">
          ${resume.skills.languages.map((l) => `<span class="badge px-2.5 py-1 text-xs rounded-md">${l}</span>`).join('')}
        </div>
      </div>
      <div class="card p-5">
        <h3 class="text-sm font-bold uppercase tracking-wider mb-3 opacity-70">Frameworks</h3>
        <div class="flex flex-wrap gap-1.5">
          ${resume.skills.frameworks.map((f) => `<span class="badge px-2.5 py-1 text-xs rounded-md">${f}</span>`).join('')}
        </div>
      </div>
      <div class="card p-5">
        <h3 class="text-sm font-bold uppercase tracking-wider mb-3 opacity-70">Cloud & DevOps</h3>
        <div class="flex flex-wrap gap-1.5">
          ${resume.skills.cloudAndDevOps.map((c) => `<span class="badge px-2.5 py-1 text-xs rounded-md">${c}</span>`).join('')}
        </div>
      </div>
      <div class="card p-5">
        <h3 class="text-sm font-bold uppercase tracking-wider mb-3 opacity-70">Databases & Tools</h3>
        <div class="flex flex-wrap gap-1.5">
          ${resume.skills.databasesAndTools.map((d) => `<span class="badge px-2.5 py-1 text-xs rounded-md">${d}</span>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- Contact & Footer -->
  <footer id="contact" class="max-w-6xl mx-auto px-6 py-16 text-center border-t border-gray-200/20">
    <h2 class="text-3xl font-bold mb-4">Let's build something remarkable together.</h2>
    <p class="text-base opacity-80 mb-6 max-w-lg mx-auto">
      I'm currently exploring high-impact engineering opportunities and open-source collaborations.
    </p>
    <div class="flex flex-wrap justify-center gap-4 mb-8">
      <a href="mailto:${email}" class="btn-primary px-6 py-3 rounded-md font-semibold transition">
        Email: ${email}
      </a>
      <a href="${githubUrl}" target="_blank" class="card px-5 py-3 font-semibold">
        GitHub
      </a>
      ${linkedinUrl !== '#' ? `<a href="${linkedinUrl}" target="_blank" class="card px-5 py-3 font-semibold">LinkedIn</a>` : ''}
    </div>
    <p class="text-xs opacity-50">
      Generated automatically with <span class="font-bold">GitFolio & ATS Resume Architect</span> • ${new Date().getFullYear()}
    </p>
  </footer>

</body>
</html>`;
}
