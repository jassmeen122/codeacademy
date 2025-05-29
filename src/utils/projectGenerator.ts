
import { ProjectSpecs } from "@/types/project";

export const generateSimplePageHTML = (specs: ProjectSpecs): string => {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${specs.projectName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background-color: ${specs.primaryColor};
            color: white;
            padding: 60px 0;
            text-align: center;
        }
        
        header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        header p {
            font-size: 1.3rem;
            opacity: 0.9;
        }
        
        section {
            padding: 60px 0;
        }
        
        section:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        section h2 {
            color: ${specs.secondaryColor};
            font-size: 2.5rem;
            margin-bottom: 2rem;
            text-align: center;
        }
        
        section p {
            font-size: 1.2rem;
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }
        
        footer {
            background-color: ${specs.secondaryColor};
            color: white;
            text-align: center;
            padding: 40px 0;
        }
        
        @media (max-width: 768px) {
            header h1 {
                font-size: 2rem;
            }
            
            section h2 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>${specs.projectName}</h1>
            <p>${specs.description}</p>
        </div>
    </header>
    
    <main>
${specs.sections.map(section => {
  if (section === "À propos") {
    return `        <section>
            <div class="container">
                <h2>À propos</h2>
                <p>Découvrez notre histoire et notre mission. Nous sommes passionnés par ce que nous faisons et nous nous engageons à vous offrir le meilleur service possible.</p>
            </div>
        </section>`;
  }
  if (section === "Services") {
    return `        <section>
            <div class="container">
                <h2>Nos Services</h2>
                <p>Nous offrons une gamme complète de services de qualité. Notre équipe expérimentée est là pour répondre à tous vos besoins.</p>
            </div>
        </section>`;
  }
  if (section === "Contact") {
    return `        <section>
            <div class="container">
                <h2>Contact</h2>
                <p>Contactez-nous dès aujourd'hui pour discuter de votre projet. Nous serons ravis de vous aider à concrétiser vos idées.</p>
            </div>
        </section>`;
  }
  return "";
}).join('\n\n')}
    </main>
    
    <footer>
        <div class="container">
            <p>&copy; 2024 ${specs.projectName}. Tous droits réservés.</p>
        </div>
    </footer>
</body>
</html>`;
};

export const downloadHTMLFile = (htmlCode: string, projectName: string) => {
  const blob = new Blob([htmlCode], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
