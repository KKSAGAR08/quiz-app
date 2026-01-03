import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { supabase } from "@/lib/supabase";

export default function EditQuiz() {
  const navigate = useNavigate();
  const { id: quizId } = useParams();

  const [quizData, setQuizData] = useState({
    title: "",
    status: "draft",
    description: "",
  });

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeQuestionIds = (questions) =>
    questions.map((q, index) => ({
      ...q,
      question_no: `Q${index + 1}`,
    }));

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);

      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .single();

      if (quizError) {
        alert("Quiz not found");
        navigate("/dashboard");
        return;
      }

      setQuizData({
        title: quiz.title,
        description: quiz.description,
        status: quiz.quiz_status ? "active" : "draft",
      });

      const { data: questions } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("id");

      const formatted = questions.map((q, i) => ({
        question_no: `Q${i + 1}`,
        question_title: q.question_title,
        required: true,
        options: {
          A: q.A,
          B: q.B,
          C: q.C,
          D: q.D,
        },
        ans: q.ans,
      }));

      setQuizQuestions(formatted);
      setLoading(false);
    };

    fetchQuiz();
  }, [quizId, navigate]);

  const addQuestions = () => {
    setQuizQuestions((prev) => [
      ...prev,
      {
        question_no: `Q${prev.length + 1}`,
        question_title: "",
        required: true,
        options: { A: "", B: "", C: "", D: "" },
        ans: null,
      },
    ]);
  };

  const removeQuestion = (id) => {
    const filtered = quizQuestions.filter((q) => q.question_no !== id);
    setQuizQuestions(normalizeQuestionIds(filtered));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await supabase
        .from("quizzes")
        .update({
          title: quizData.title,
          description: quizData.description,
          quiz_status: quizData.status === "active",
        })
        .eq("id", quizId);

      await supabase.from("quiz_questions").delete().eq("quiz_id", quizId);

      const payload = quizQuestions.map((q) => ({
        quiz_id: quizId,
        question_title: q.question_title,
        A: q.options.A,
        B: q.options.B,
        C: q.options.C,
        D: q.options.D,
        ans: q.ans,
      }));

      await supabase.from("quiz_questions").insert(payload);

      alert("Quiz updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update quiz");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-5">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Edit Quiz</h2>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Quiz Title</Label>
                <Input
                  value={quizData.title}
                  onChange={(e) =>
                    setQuizData((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={quizData.status}
                  onValueChange={(v) =>
                    setQuizData((p) => ({ ...p, status: v }))
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

            <div className="mt-6">
              <Label>Description</Label>
              <Textarea
                value={quizData.description}
                onChange={(e) =>
                  setQuizData((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {console.log(quizQuestions)}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Quiz Questions</h2>
            <Button variant="outline" onClick={addQuestions}>
              <Plus className="h-4 w-4 mr-2" /> Add Question
            </Button>
          </CardHeader>

          {quizQuestions.map((question, index) => (
            <Card key={question.question_no} className="mx-6 mb-4">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex gap-4 font-bold items-center">
                    <p>Q{index + 1}</p>
                    <p>{question.question_title}</p>
                  </div>
                  <div>
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
                      value={question.question_title}
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
                        <SelectItem value="A">Option A</SelectItem>
                        <SelectItem value="B">Option B</SelectItem>
                        <SelectItem value="C">Option C</SelectItem>
                        <SelectItem value="D">Option D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {["A", "B", "C", "D"].map((opt) => (
                    <Input
                      key={opt}
                      placeholder={`Option ${opt}`}
                      value={question.options[opt]}
                      onChange={(e) =>
                        setQuizQuestions((prev) =>
                          prev.map((q) =>
                            q.question_no === question.question_no
                              ? {
                                  ...q,
                                  options: {
                                    ...q.options,
                                    [opt]: e.target.value,
                                  },
                                }
                              : q
                          )
                        )
                      }
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Update Quiz
          </Button>
          <Link to="/dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
