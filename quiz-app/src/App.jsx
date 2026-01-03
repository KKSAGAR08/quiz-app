import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./component/authentication-page/loginPage";
import SignupPage from "./component/authentication-page/signupPage";
import Dashboard from "./component/dashboard/dashbaord";
import SideBarLayout from "./components/sidebar-layout";
import QuizAnalytics from "./component/analytics/quiz-analytics"
import CreateQuiz from "./component/quiz-creation/quiz-creation";
import EditQuiz from "./component/quiz-edit/editquiz";
import Profile from "./component/profile/profile";
import Response from "./component/quiz-response/response";
import LandingPage from "./component/landing/home-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<SideBarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<QuizAnalytics />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz/:id" element={<EditQuiz />} />
        </Route>


        <Route path="/quiz-response/:id" element={<Response/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
