import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import StudentLayout from './layouts/StudentLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import StudentsPage from './pages/admin/StudentsPage.jsx';
import CoursesPage from './pages/admin/CoursesPage.jsx';
import ExamsPage from './pages/admin/ExamsPage.jsx';
import QuestionsPage from './pages/admin/QuestionsPage.jsx';
import ExamResultsPage from './pages/admin/ExamResultsPage.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import TakeExamPage from './pages/student/TakeExamPage.jsx';
import ResultPage from './pages/student/ResultPage.jsx';
import MyResultsPage from './pages/student/MyResultsPage.jsx';

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={!user ? '/login' : user.role === 'admin' ? '/admin' : '/student'} replace />;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute role="admin" />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentsPage />} />
        <Route path="/admin/courses" element={<CoursesPage />} />
        <Route path="/admin/exams" element={<ExamsPage />} />
        <Route path="/admin/exams/:id/questions" element={<QuestionsPage />} />
        <Route path="/admin/exams/:id/results" element={<ExamResultsPage />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute role="student" />}>
      <Route element={<StudentLayout />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/exams/:id" element={<TakeExamPage />} />
        <Route path="/student/exams/:id/result" element={<ResultPage />} />
        <Route path="/student/results" element={<MyResultsPage />} />
      </Route>
    </Route>
    <Route path="*" element={<HomeRedirect />} />
  </Routes>;
}
