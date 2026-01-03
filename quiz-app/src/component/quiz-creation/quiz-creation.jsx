import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  SquarePen,
  Plus,
  MessageSquare,
  Trash2,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function CreateQuiz() {
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({
    title: "",
    status: "draft",
    description: "",
  });

  const [quizQuestions, setQuizQuestions] = useState([
    {
      question_no: "Q1",
      question_title: "",
      required: true,
      options: {
        A: "",
        B: "",
        C: "",
        D: "",
      },
      ans: null,
    },
  ]);

  const normalizeQuestionIds = (questions) =>
    questions.map((q, index) => ({
      ...q,
      question_no: `Q${index + 1}`,
    }));

  const addQuestions = () => {
    const newQuestion = {
      question_no: "Q" + (quizQuestions.length + 1),
      question_title: "",
      required: true,
      options: {
        A: "",
        B: "",
        C: "",
        D: "",
      },
      ans: null,
    };

    setQuizQuestions([...quizQuestions, newQuestion]);
  };

  const removeQuestion = (id) => {
    const filtered = quizQuestions.filter((q) => q.question_no !== id);
    const updatedList = normalizeQuestionIds(filtered);
    setQuizQuestions(updatedList);
  };

  const checkQuestion = () => {
    for (let quiz of quizQuestions) {
      if (quiz.ans === null) {
        alert("Select Answer for Every Question");
        return false;
      }
    }
    return true;
  };

  const handSubmit = async (e) => {
    e.preventDefault();

    if (!checkQuestion()) {
      return;
    }

    console.log(quizData);
    console.log(quizQuestions);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("User not logged in");
        return;
      }

      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          user_email: user.email,
          title: quizData.title,
          description: quizData.description,
          quiz_status: quizData.status === "active",
          total_response: 0,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      const questionsPayload = quizQuestions.map((q) => ({
        quiz_id: quiz.id,
        question_title: q.question_title,
        A: q.options.A,
        B: q.options.B,
        C: q.options.C,
        D: q.options.D,
        ans: q.ans,
      }));

      const { error: questionError } = await supabase
        .from("quiz_questions")
        .insert(questionsPayload);

      if (questionError) throw questionError;

      alert("Quiz created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error creating quiz", error);
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="max-w-4xl px-5 mx-auto">
          <form className="space-y-8" onSubmit={handSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  Quiz Details
                </h2>
                <span className="text-sm text-muted-foreground">
                  Basic information about your Quiz creation
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="mb-3">
                      Quiz Title
                    </Label>
                    <Input
                      id="title"
                      className="capitalize"
                      placeholder="Enter quiz title"
                      onChange={(e) =>
                        setQuizData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      value={quizData.title}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="status" className="mb-3">
                      Status
                    </Label>
                    <Select
                      id="form-status"
                      className="w-full"
                      value={quizData.status}
                      onValueChange={(value) =>
                        setQuizData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 mt-7 ">
                  <Label htmlFor="description" className="">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Describe what this quiz is for"
                    onChange={(e) =>
                      setQuizData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    value={quizData.description}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <div className="flex justify-between items-center mx-6">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold">
                    Quiz Questions
                  </h2>
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    Add Multiple Choice Questions here
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={addQuestions}
                >
                  <Plus className="h-4 w-4 mr-0 sm:mr-2" />
                  <span className="hidden sm:block">Add Question</span>
                </Button>
              </div>

              {quizQuestions.map((question, index) => (
                <Card key={question.question_no} className="mx-3 sm:mx-6">
                  <CardHeader className="px-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-7">
                          {question.question_no}
                        </Badge>
                        <div className="flex items-center gap-1">
                          Question {question.question_no}
                        </div>
                      </div>
                      {quizQuestions.length > 1 && (
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => removeQuestion(question.question_no)}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="mb-3">
                          Question Text
                        </Label>
                        <Input
                          id="title"
                          className="capitalize"
                          placeholder={`Enter question ${index + 1} `}
                          onChange={(e) =>
                            setQuizQuestions((prev) =>
                              prev.map((q) =>
                                q.question_no === question.question_no
                                  ? { ...q, question_title: e.target.value }
                                  : q
                              )
                            )
                          }
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="status" className="mb-3">
                          Question Answer
                        </Label>
                        <Select
                          className="w-full"
                          value={question.ans}
                          onValueChange={(value) =>
                            setQuizQuestions((prev) =>
                              prev.map((q) =>
                                q.question_no === question.question_no
                                  ? { ...q, ans: value }
                                  : q
                              )
                            )
                          }
                        >
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>Select Answer</SelectItem>
                            <SelectItem value="A">Option A</SelectItem>
                            <SelectItem value="B">Option B</SelectItem>
                            <SelectItem value="C">Option C</SelectItem>
                            <SelectItem value="D">Option D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      {["A", "B", "C", "D"].map((optionKey) => (
                        <div key={optionKey} className="space-y-2">
                          <Label>Option {optionKey}</Label>
                          <Input
                            placeholder={`Enter option ${optionKey}`}
                            value={question.options[optionKey]}
                            onChange={(e) =>
                              setQuizQuestions((prev) =>
                                prev.map((q) =>
                                  q.question_no === question.question_no
                                    ? {
                                        ...q,
                                        options: {
                                          ...q.options,
                                          [optionKey]: e.target.value,
                                        },
                                      }
                                    : q
                                )
                              )
                            }
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Card>

            <div className="flex gap-4 mb-8">
              <Button type="submit" className="flex-1 h-11 cursor-pointer">
                Create Form
              </Button>
              <Link to="/dashboard">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 cursor-pointer"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
