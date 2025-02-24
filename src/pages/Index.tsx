
import Navigation from "@/components/Navigation";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";

const popularCourses = [
  {
    title: "Python for Beginners",
    description: "Start your coding journey with Python, the most beginner-friendly programming language",
    duration: "8 weeks",
    students: 1234,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80",
    difficulty: "Beginner",
    category: "Programming Fundamentals"
  },
  {
    title: "Complete Web Development",
    description: "Master HTML, CSS, and JavaScript to create modern, responsive websites",
    duration: "12 weeks",
    students: 2156,
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80",
    difficulty: "Intermediate",
    category: "Web Development"
  },
  {
    title: "Java Programming Masterclass",
    description: "Learn Java from scratch and build enterprise-level applications",
    duration: "10 weeks",
    students: 1589,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    difficulty: "Advanced",
    category: "Software Engineering"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 text-foreground">
              Learn to Code with
              <span className="text-primary"> Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Join millions of learners and start coding with our interactive platform.
              Master in-demand programming languages with hands-on practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90">
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary text-primary hover:bg-primary/10">
                View Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section id="courses" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Popular Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Begin your coding journey with our most popular courses. Learn from structured
              curriculum designed to help you master programming fundamentals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose CodeAcademy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience a new way of learning with our cutting-edge platform features
              designed to accelerate your growth in programming.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards will be added in next iteration */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
