import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Response() {
  const { id: quizId } = useParams();

  const [step, setStep] = useState("loading"); // loading | info | quiz | result | blocked
  const [user, setUser] = useState({ name: "", email: "" });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 STEP 1: Check quiz exists + status
  useEffect(() => {
    const checkQuiz = async () => {
      const { data: quiz, error } = await supabase
        .from("quizzes")
        .select("id, quiz_status")
        .eq("id", quizId)
        .single();

      if (error || !quiz) {
        setErrorMsg("Invalid quiz link.");
        setStep("blocked");
        return;
      }

      if (quiz.quiz_status === "false") {
        setErrorMsg("This quiz is not active yet.");
        setStep("blocked");
        return;
      }

      // Quiz exists & active → fetch questions
      fetchQuestions();
    };

    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("id");

      if (error || !data?.length) {
        setErrorMsg("No questions found for this quiz.");
        setStep("blocked");
        return;
      }

      const formatted = data.map((q) => ({
        question: q.question_title,
        options: [
          { key: "A", value: q.A },
          { key: "B", value: q.B },
          { key: "C", value: q.C },
          { key: "D", value: q.D },
        ],
        correct: q.ans,
      }));

      setQuestions(formatted);
      setStep("info");
    };

    checkQuiz();
  }, [quizId]);

  const handleStartQuiz = async (e) => {
    e.preventDefault();

    const { data} = await supabase
      .from("quiz_responses")
      .select("id")
      .eq("quiz_id", quizId)
      .eq("user_email", user.email)
      .maybeSingle();

    if (data) {
      setErrorMsg("You have already submitted this quiz.");
      setStep("blocked");
      return;
    }

    setStep("quiz");
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((p) => p + 1);
    } else {
      const finalScore = newAnswers.reduce(
        (s, ans, i) => (ans === questions[i].correct ? s + 1 : s),
        0
      );

      setScore(finalScore);
      setStep("result");
      saveResult(finalScore);
    }
  };

  const saveResult = async (finalScore) => {
    await supabase.from("quiz_responses").insert({
      quiz_id: quizId,
      user_name: user.name,
      user_email: user.email,
      score: finalScore,
    });

    const { data, error } = await supabase.rpc("increment_quiz_response", {
      qid: Number(quizId),
    });

    console.log("RPC DATA:", data);
    console.log("RPC ERROR:", error);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        {/* BLOCKED */}
        {step === "blocked" && (
          <Card className="shadow-lg text-center">
            <CardHeader>
              <CardTitle className="text-xl text-red-600">
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{errorMsg}</p>
            </CardContent>
          </Card>
        )}

        {/* INFO */}
        {step === "info" && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Welcome to the Quiz
              </CardTitle>
              <CardDescription>
                Enter your details to start the challenge
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleStartQuiz}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    required
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    required
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full py-6 text-lg my-4">
                  Start Quiz
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* QUIZ */}
        {step === "quiz" && (
          <Card className="shadow-lg border-t-4 border-primary">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-semibold">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}
                  %
                </span>
              </div>

              <Progress
                value={((currentQuestion + 1) / questions.length) * 100}
                className="h-2"
              />

              <CardTitle className="text-xl mt-6">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-3"
              >
                {questions[currentQuestion].options.map((opt) => (
                  <div
                    key={opt.key}
                    className={`flex items-center space-x-3 p-4 rounded-lg border ${
                      selectedAnswer === opt.key
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={opt.key} />
                    <Label className="grow cursor-pointer">{opt.value}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>

            <CardFooter>
              <Button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className="w-full py-6 text-lg"
              >
                {currentQuestion === questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* RESULT */}
        {step === "result" && (
          <Card className="shadow-lg text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Quiz Completed!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black text-primary mb-2">
                {score} / {questions.length}
              </div>
              <p className="text-muted-foreground">
                Thank you for your response. You can close this tab.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
