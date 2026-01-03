import React, { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function DashBoard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      // setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not logged in");
        return;
      }

      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });

      setQuizzes(data);

      if (error) {
        console.error("Error fetching quizzes:", error.message);
      } else {
        setQuizzes(data);
      }

      // setLoading(false);
    };

    fetchQuizzes();
  }, []);

  console.log(quizzes);

  const copyQuizLink = (id) => {
    const url = `${window.location.origin}/quiz-response/${id}`;
    navigator.clipboard.writeText(url);
    alert("Quiz link copied to clipboard!");
  };

  return (
    <>
      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 mb-8 mt-6 mx-6 gap-4">
          {quizzes?.map((quiz, index) => (
            <Card className="hover:shadow-2xl transition-shadow" key={index}>
              <CardHeader className="flex flex-row items-center justify-between">
                <Badge variant="default" className=" capitalize">
                  {quiz.quiz_status === "true" ? "Active" : "Draft"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyQuizLink(quiz.id)}
                  className="h-8 w-8"
                  title="Copy quiz link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardHeader>
                <CardTitle className="font-semibold capitalize">
                  {quiz.title}
                </CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Responses</span>
                  <span className="font-medium">{quiz.total_response}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(quiz.created_at).toDateString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="w-full">
                <Link to={`/quiz/${quiz.id}`} className="w-full">
                  <Button className="w-full cursor-pointer">Edit Quiz</Button>
                </Link>
                
              </CardFooter>
              <span className="px-4 text-muted-foreground">Click on the Copy icon above and share the link to user</span>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <p className="text-lg font-semibold">No quizzes yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start by creating your first quiz
          </p>
          <Button className="mt-4" onClick={() => navigate("/create-quiz")}>
            Create Quiz
          </Button>
        </div>
      )}
    </>
  );
}
