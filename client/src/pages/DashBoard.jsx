import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, TriangleAlert } from "lucide-react";
import Cookies from "js-cookie";

function DasnhBoard() {
  const token = Cookies.get("authtoken");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };



  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch dashboard stats and pending questions
  async function fetchDashboardData() {
    try {
      setLoading(true);

      // Fetch stats
      const statsData = await Promise.all([
        axios.get(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/questions/status/pending`),
        axios.get(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/questions/status/approved`),
        axios.get(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/questions/status/rejected`, config),
        axios.get(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/questions`, config),
      ]);

      const pending = statsData[0].data.questions.length;
      const approved = statsData[1].data.questions.length;
      const rejected = statsData[2].data.questions.length;
      const total = statsData[3].data.questions.length;
      setStats({ total, approved, rejected, pending });
      setPendingQuestions(statsData[0].data.questions);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  async function updateQuestionStatus(id, action) {
    try {
      const route = action === "approve" ? "approvequestion" : "rejectquestion";
      await axios.put(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/questions/${route}/${id}`,{},
        config
      );
      fetchDashboardData(); 
    } catch (err) {
      console.error(`Error ${action}ing question:`, err);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <TriangleAlert size={100} className="text-rose-900" />
          <h1 className="text-xl">Failed to load dashboard data 🥲</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-screen-2xl mx-auto mt-10">
        <h1 className="text-center text-3xl font-bold my-10">Admin Dashboard</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 px-5">
          {Object.entries(stats).map(([key, value]) => (
            <Card key={key} className="p-5 shadow-lg">
              <h2 className="text-xl font-bold capitalize">{key}</h2>
              <p className="text-3xl font-bold mt-2">{value}</p>
            </Card>
          ))}
        </div>

        {/* Pending Questions Section */}
        <div className="px-5">
          <h2 className="text-2xl font-bold mb-5">Pending Questions</h2>
          {pendingQuestions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {pendingQuestions.map((question) => (
                <Card key={question._id} className="p-5 shadow-md">
                  <h3 className="text-lg font-bold">{question.title}</h3>
                  <p className="text-sm mt-2">{question.description}</p>
                  <div className="flex gap-4 mt-5">
                    <Button
                      variant="success"
                      onClick={() => updateQuestionStatus(question._id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateQuestionStatus(question._id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-lg mt-10">
              No pending questions available.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DasnhBoard;
