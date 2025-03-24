
// This is a script to manually run to seed the database with the beginner questions
// Not actually used in the application, but provides the questions data

const beginnerQuestions = [
  {
    question: "Qui a créé le langage Python ?",
    correct_answer: "Guido van Rossum",
    option1: "James Gosling",
    option2: "Bjarne Stroustrup",
    option3: "Guido van Rossum",
    option4: "Dennis Ritchie",
    explanation: "Python a été créé en 1989 par Guido van Rossum, un programmeur néerlandais. Il voulait un langage simple et lisible.",
    difficulty: "Beginner"
  },
  {
    question: "Quel langage est utilisé pour développer Android ?",
    correct_answer: "Java",
    option1: "Java",
    option2: "C#",
    option3: "Python",
    option4: "Swift",
    explanation: "Java est le langage principal pour Android. Kotlin est aussi populaire aujourd'hui.",
    difficulty: "Beginner"
  },
  {
    question: "Quel langage est surnommé \"le langage du web\" ?",
    correct_answer: "JavaScript",
    option1: "JavaScript",
    option2: "C",
    option3: "Python",
    option4: "Ruby",
    explanation: "JavaScript est utilisé pour le développement front-end et back-end sur le web. Il est né en 1995 avec Netscape.",
    difficulty: "Beginner"
  },
  {
    question: "Quel langage a été conçu pour les bases de données ?",
    correct_answer: "SQL",
    option1: "SQL",
    option2: "C++",
    option3: "Python",
    option4: "PHP",
    explanation: "SQL (Structured Query Language) est utilisé pour gérer et interroger les bases de données relationnelles.",
    difficulty: "Beginner"
  },
  {
    question: "Lequel de ces langages est compilé ?",
    correct_answer: "C",
    option1: "Python",
    option2: "PHP",
    option3: "C",
    option4: "JavaScript",
    explanation: "C est un langage compilé qui se transforme en code machine avant d'être exécuté.",
    difficulty: "Beginner"
  },
  {
    question: "Quel langage est souvent utilisé pour le développement de sites web dynamiques ?",
    correct_answer: "PHP",
    option1: "PHP",
    option2: "C",
    option3: "Java",
    option4: "Swift",
    explanation: "PHP est un langage serveur très utilisé pour créer des sites dynamiques comme WordPress, Facebook ou Wikipedia.",
    difficulty: "Beginner"
  },
  {
    question: "Quel langage a introduit le concept de \"Classes et Objets\" ?",
    correct_answer: "C++",
    option1: "Java",
    option2: "Python",
    option3: "C++",
    option4: "C",
    explanation: "C++, conçu par Bjarne Stroustrup en 1983, a introduit la programmation orientée objet.",
    difficulty: "Beginner"
  },
  {
    question: "En quelle année JavaScript a-t-il été créé ?",
    correct_answer: "1995",
    option1: "1985",
    option2: "1995",
    option3: "2001",
    option4: "2010",
    explanation: "JavaScript a été créé en 1995 par Brendan Eich en seulement 10 jours !",
    difficulty: "Beginner"
  },
  {
    question: "Quel langage est souvent utilisé pour l'intelligence artificielle ?",
    correct_answer: "Python",
    option1: "Java",
    option2: "Python",
    option3: "C++",
    option4: "PHP",
    explanation: "Python est largement utilisé en IA grâce à ses bibliothèques comme TensorFlow, Keras et PyTorch.",
    difficulty: "Beginner"
  },
  {
    question: "Qui a inventé le langage C ?",
    correct_answer: "Dennis Ritchie",
    option1: "James Gosling",
    option2: "Bjarne Stroustrup",
    option3: "Dennis Ritchie",
    option4: "Linus Torvalds",
    explanation: "Dennis Ritchie a créé C en 1972 chez Bell Labs. C'est un langage fondamental pour les systèmes d'exploitation comme Unix et Linux.",
    difficulty: "Beginner"
  }
];

// Insert the questions into the database
async function seedQuizQuestions() {
  try {
    // Code to insert the questions into your database
    // This would typically use supabase or another database client
    
    /*
    Example with Supabase:
    
    import { supabase } from '@/integrations/supabase/client';
    
    const { data, error } = await supabase
      .from('coding_quiz')
      .insert(beginnerQuestions);
      
    if (error) {
      console.error('Error seeding questions:', error);
    } else {
      console.log('Successfully seeded questions:', data);
    }
    */
    
    console.log('Questions ready for seeding');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Export the questions for use in supabase seeding scripts
module.exports = {
  beginnerQuestions
};
