
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, AlertCircle, CheckCircle2, Pencil, Eye, Save } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  moduleId: string;
  passingScore: number;
}

interface CourseQuizEditorProps {
  courseId: string;
  moduleId: string;
  quiz: Quiz | null;
  onQuizChange: (quiz: Quiz) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const CourseQuizEditor = ({
  courseId,
  moduleId,
  quiz,
  onQuizChange,
  onSave,
  isSaving = false
}: CourseQuizEditorProps) => {
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  
  // Create a default quiz if none exists
  const currentQuiz = quiz || {
    id: `temp-quiz-${Date.now()}`,
    title: "New Quiz",
    description: "Quiz description",
    questions: [],
    moduleId,
    passingScore: 70
  };

  const handleQuizChange = (field: string, value: any) => {
    onQuizChange({
      ...currentQuiz,
      [field]: value
    });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `temp-question-${Date.now()}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      type: 'multiple-choice'
    };
    
    const updatedQuestions = [...currentQuiz.questions, newQuestion];
    onQuizChange({
      ...currentQuiz,
      questions: updatedQuestions
    });
    
    // Automatically start editing the new question
    setEditingQuestionIndex(updatedQuestions.length - 1);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...currentQuiz.questions];
    updatedQuestions.splice(index, 1);
    
    onQuizChange({
      ...currentQuiz,
      questions: updatedQuestions
    });
    
    // Reset editing state if the question being edited is removed
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null);
    } else if (editingQuestionIndex !== null && editingQuestionIndex > index) {
      setEditingQuestionIndex(editingQuestionIndex - 1);
    }
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...currentQuiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    onQuizChange({
      ...currentQuiz,
      questions: updatedQuestions
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...currentQuiz.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };
    
    onQuizChange({
      ...currentQuiz,
      questions: updatedQuestions
    });
  };

  const changeQuestionType = (questionIndex: number, type: 'multiple-choice' | 'true-false' | 'short-answer') => {
    const updatedQuestions = [...currentQuiz.questions];
    const question = { ...updatedQuestions[questionIndex] };
    
    // Adjust options based on the question type
    if (type === 'true-false') {
      question.options = ['True', 'False'];
      if (question.correctAnswer >= 2) {
        question.correctAnswer = 0;
      }
    } else if (type === 'multiple-choice') {
      if (question.options.length < 4) {
        question.options = [...question.options];
        while (question.options.length < 4) {
          question.options.push('');
        }
      }
    } else if (type === 'short-answer') {
      question.options = [''];
      question.correctAnswer = 0;
    }
    
    question.type = type;
    updatedQuestions[questionIndex] = question;
    
    onQuizChange({
      ...currentQuiz,
      questions: updatedQuestions
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Module Assessment</CardTitle>
        <CardDescription>Create a quiz to test students' understanding of this module</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input
                  id="quiz-title"
                  value={currentQuiz.title}
                  onChange={(e) => handleQuizChange('title', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="quiz-description">Description</Label>
                <Textarea
                  id="quiz-description"
                  value={currentQuiz.description}
                  onChange={(e) => handleQuizChange('description', e.target.value)}
                  className="mt-1"
                  placeholder="Explain what this quiz will assess"
                />
              </div>
              
              <div>
                <Label htmlFor="passing-score">Passing Score (%)</Label>
                <Input
                  id="passing-score"
                  type="number"
                  min="0"
                  max="100"
                  value={currentQuiz.passingScore}
                  onChange={(e) => handleQuizChange('passingScore', parseInt(e.target.value))}
                  className="mt-1 w-24"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Questions</h4>
                <Button 
                  onClick={addQuestion} 
                  variant="outline" 
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
              
              {currentQuiz.questions.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-muted/30">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No questions added yet.</p>
                  <Button 
                    onClick={addQuestion} 
                    variant="outline" 
                    className="mt-4"
                    size="sm"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentQuiz.questions.map((question, questionIndex) => (
                    <Card key={question.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Question {questionIndex + 1}</div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => editingQuestionIndex === questionIndex 
                                ? setEditingQuestionIndex(null) 
                                : setEditingQuestionIndex(questionIndex)
                              }
                            >
                              {editingQuestionIndex === questionIndex ? "Done" : "Edit"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              onClick={() => removeQuestion(questionIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {editingQuestionIndex === questionIndex ? (
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Question Type</Label>
                            <Select 
                              value={question.type} 
                              onValueChange={(value) => changeQuestionType(
                                questionIndex, 
                                value as 'multiple-choice' | 'true-false' | 'short-answer'
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                <SelectItem value="true-false">True/False</SelectItem>
                                <SelectItem value="short-answer">Short Answer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Question</Label>
                            <Textarea
                              value={question.question}
                              onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                              placeholder="Enter your question here"
                            />
                          </div>
                          
                          {question.type !== 'short-answer' && (
                            <div className="space-y-3">
                              <Label>Options</Label>
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <RadioGroup 
                                    value={question.correctAnswer.toString()} 
                                    onValueChange={(value) => updateQuestion(questionIndex, 'correctAnswer', parseInt(value))}
                                    className="flex-shrink-0"
                                  >
                                    <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-option${optionIndex}`} />
                                  </RadioGroup>
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="flex-1"
                                  />
                                  {question.type === 'multiple-choice' && question.options.length > 2 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 flex-shrink-0"
                                      onClick={() => {
                                        const updatedQuestions = [...currentQuiz.questions];
                                        const updatedOptions = [...updatedQuestions[questionIndex].options];
                                        updatedOptions.splice(optionIndex, 1);
                                        
                                        // Adjust correct answer if needed
                                        let correctAnswer = updatedQuestions[questionIndex].correctAnswer;
                                        if (correctAnswer === optionIndex) {
                                          correctAnswer = 0;
                                        } else if (correctAnswer > optionIndex) {
                                          correctAnswer--;
                                        }
                                        
                                        updatedQuestions[questionIndex] = {
                                          ...updatedQuestions[questionIndex],
                                          options: updatedOptions,
                                          correctAnswer
                                        };
                                        
                                        onQuizChange({
                                          ...currentQuiz,
                                          questions: updatedQuestions
                                        });
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              
                              {question.type === 'multiple-choice' && question.options.length < 6 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const updatedQuestions = [...currentQuiz.questions];
                                    updatedQuestions[questionIndex] = {
                                      ...updatedQuestions[questionIndex],
                                      options: [...updatedQuestions[questionIndex].options, '']
                                    };
                                    
                                    onQuizChange({
                                      ...currentQuiz,
                                      questions: updatedQuestions
                                    });
                                  }}
                                >
                                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                                  Add Option
                                </Button>
                              )}
                            </div>
                          )}
                          
                          <div>
                            <Label>Explanation (Optional)</Label>
                            <Textarea
                              value={question.explanation}
                              onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                              placeholder="Explain why the correct answer is right"
                            />
                          </div>
                        </CardContent>
                      ) : (
                        <CardContent>
                          <p className="mb-2">{question.question || <span className="text-muted-foreground italic">No question text</span>}</p>
                          
                          {question.type !== 'short-answer' ? (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <CheckCircle2 
                                    className={`h-4 w-4 ${
                                      question.correctAnswer === optionIndex 
                                        ? 'text-primary' 
                                        : 'text-muted-foreground opacity-0'
                                    }`} 
                                  />
                                  <span>{option || <span className="text-muted-foreground italic">Empty option</span>}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="border rounded-md p-2 bg-muted/20 text-muted-foreground italic">
                              Short answer question
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={onSave} 
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Quiz'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-lg p-6 bg-white">
              {currentQuiz.questions.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No Questions Added</h3>
                  <p className="text-muted-foreground">
                    Add questions in the Edit tab to preview how your quiz will look to students.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">{currentQuiz.title}</h2>
                    <p className="text-muted-foreground mt-1">{currentQuiz.description}</p>
                    <p className="text-sm mt-4">Passing score: {currentQuiz.passingScore}%</p>
                  </div>
                  
                  <div className="space-y-8">
                    {currentQuiz.questions.map((question, index) => (
                      <div key={question.id} className="border-t pt-6">
                        <h3 className="font-medium mb-3">Question {index + 1}: {question.question}</h3>
                        
                        {question.type === 'short-answer' ? (
                          <Textarea 
                            placeholder="Enter your answer here" 
                            className="mt-2"
                            disabled
                          />
                        ) : (
                          <RadioGroup disabled className="space-y-3">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={optionIndex.toString()} id={`preview-q${index}-option${optionIndex}`} />
                                <Label htmlFor={`preview-q${index}-option${optionIndex}`} className="cursor-pointer">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button disabled className="w-full sm:w-auto">Submit Quiz</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
