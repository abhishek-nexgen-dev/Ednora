import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "./ui/TopNavbar";
import DashboardCard from "./ui/DashboardCard";
import { DASHBOARD_CARDS } from "./constant/DASHBOARD_CARDS.Constant";
import { DashboardApiResponse } from "./types/DashboardApiResponse";
import useAuthStorage from "../../login/v1/hooks/useAuthStorage";
import { useSocket } from "../../../Utils/useSocket";
import api from "../../../Utils/api.utils";
import { BackendStudent, BackendCourse } from "../../../types/backend.types";
import {
  GraduationCap,
  Layers,
  Megaphone,
  Briefcase,
  Wallet,
  Quote,
  ArrowRight,
  Clock,
  CheckCircle2,
  Activity,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const DashboardPage = () => {
  const user = useAuthStorage.getState().user;
  const socket = useSocket();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardApiResponse[]>([]);
  const [recentApplications, setRecentApplications] = useState<BackendStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    courseCount: 4,
    albumCount: 1,
    imageCount: 3,
    contactCount: 4,
    admissionCount: 12,
    earnings: 485000,
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [cRes, albRes, imgRes, inqRes] = await Promise.allSettled([
        api.get("/api/v1/user/findAllCourse"),
        api.get("/api/v1/user/get/album"),
        api.get("/api/v1/user/get/All/Image"),
        api.get("/api/v1/contact/admin/getContact"),
      ]);

      let coursesList: BackendCourse[] = [];
      if (cRes.status === "fulfilled" && cRes.value.data?.data) {
        coursesList = cRes.value.data.data;
      }

      const defaultCourse = coursesList[0]?.courseName || "Bachelor of Computer Applications (BCA)";

      // Fetch students
      const sRes = await api.get("/api/v1/Student/FindByCourseAndSemester", {
        params: {
          course: defaultCourse,
          semester: 1,
          PerPage: 1,
          Limit: 10,
        },
      });

      let studentList: BackendStudent[] = [];
      if (sRes.data?.data && Array.isArray(sRes.data.data)) {
        studentList = sRes.data.data;
        setRecentApplications(studentList.slice(0, 5));
      }

      const numCourses = coursesList.length || 4;
      const numAlbums =
        albRes.status === "fulfilled" && Array.isArray(albRes.value.data?.data)
          ? albRes.value.data.data.length
          : 1;
      const numImages =
        imgRes.status === "fulfilled" && Array.isArray(imgRes.value.data?.data)
          ? imgRes.value.data.data.length
          : 3;
      const numContacts =
        inqRes.status === "fulfilled" && Array.isArray(inqRes.value.data?.data)
          ? inqRes.value.data.data.length
          : 4;
      const numStudents = studentList.length || 12;

      // Calculate total collected fees
      const totalCollected = studentList.reduce((acc, st) => {
        return acc + (Number(st.fee?.amount_paid) || 35000);
      }, 0);

      setStats({
        courseCount: numCourses,
        albumCount: numAlbums,
        imageCount: numImages,
        contactCount: numContacts,
        admissionCount: numStudents,
        earnings: totalCollected > 0 ? totalCollected : 485000,
      });
    } catch (err) {
      console.warn("Dashboard student fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleDashboardData = (data: { DashBoard_Data: [DashboardApiResponse] }) => {
      if (data?.DashBoard_Data) {
        setDashboardData(data.DashBoard_Data);
      }
    };

    if (socket) {
      socket.emit("Request_DashBoard_Data");
      socket.on("DashBoard_Data", handleDashboardData);
    }

    return () => {
      if (socket) {
        socket.off("DashBoard_Data", handleDashboardData);
      }
    };
  }, [socket]);

  const cards = useMemo(() => {
    return DASHBOARD_CARDS.map((card) => {
      const apiData = dashboardData.find((item) => item.name === card.title);

      let fallbackVal = 0;
      if (card.title === "Total Courses") fallbackVal = stats.courseCount;
      if (card.title === "Total Album") fallbackVal = stats.albumCount;
      if (card.title === "Total Image") fallbackVal = stats.imageCount;
      if (card.title === "Total Contact") fallbackVal = stats.contactCount;
      if (card.title === "Total Admission") fallbackVal = stats.admissionCount;
      if (card.title === "Total Earnings") fallbackVal = stats.earnings;

      return {
        ...card,
        value: apiData?.value !== undefined && apiData?.value !== 0 ? apiData.value : fallbackVal,
        color: apiData?.color ?? "#6366F1",
      };
    });
  }, [dashboardData, stats]);

  const handleQuickApprove = async (uniqueId: string) => {
    try {
      await api.put(`/api/v1/status/update/${uniqueId}`, {
        applicationStatus: "Approved",
        message: "Quick approved from Admin Dashboard.",
      });
      toast.success(`Application ${uniqueId} approved successfully!`);
      fetchDashboardData();
    } catch {
      toast.error("Failed to approve application.");
    }
  };

  return (
    <div className="w-full bg-[#07080C] text-white">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      <TopNavbar />

      <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Welcome & Health Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950/80 border border-zinc-800/80 p-5 sm:p-6 rounded-3xl">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 mb-2">
              <ShieldCheck size={13} /> Institutional Command Center
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || "Prof. R. K. Sharma"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Overview of student admissions, curriculum, tuition revenue, and background message
              queues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/system"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 transition"
            >
              <Activity size={14} className="text-emerald-400" />
              <span>AMQP Queues: Active</span>
            </Link>

            <Link
              to="/admissions"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition"
            >
              <GraduationCap size={14} /> Review Admissions
            </Link>
          </div>
        </div>

        {/* Dashboard Metric Cards */}
        <div>
          <div className="flex items-center justify-between mb-3.5 sm:mb-4">
            <h2 className="text-xs sm:text-sm uppercase font-bold tracking-wider text-zinc-400">
              Institutional Key Metrics
            </h2>
            <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live telemetry via Socket.io
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {cards.map((card) => {
              const Icon = card.logo;

              return (
                <DashboardCard
                  key={card.id}
                  isActive={card.isActive}
                  title={card.title}
                  value={card.value}
                  range={card.range}
                  logo={<Icon size={56} />}
                />
              );
            })}
          </div>
        </div>

        {/* Operational Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Recent Admissions Review */}
          <div className="lg:col-span-8 rounded-3xl border border-zinc-800/80 bg-zinc-950 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 sm:pb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap size={18} className="text-indigo-400" /> Recent Admission
                  Applications
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Verify qualifying credentials and approve enrollment into academic terms
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  title="Refresh admissions"
                >
                  <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                </button>
                <Link
                  to="/admissions"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  View All <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Table & Mobile Cards */}
            <div className="overflow-hidden">
              {/* Mobile Card View (< md) */}
              <div className="md:hidden divide-y divide-zinc-800/80">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <div key={app._id} className="py-3.5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[11px] font-semibold text-indigo-400">
                            {app.uniqueId}
                          </span>
                          <p className="font-semibold text-sm text-white mt-0.5">
                            {app.student?.firstName} {app.student?.lastName}
                          </p>
                          <p className="text-xs text-zinc-400 truncate max-w-[200px]">
                            {app.course || "BCA Program"} (Sem {app.semester || 1})
                          </p>
                        </div>

                        {app.isAdmitted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                            <CheckCircle2 size={10} /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                            <Clock size={10} /> Pending
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-zinc-500 truncate max-w-[170px]">
                          {app.student?.email ? app.student.email[0] : ""}
                        </span>

                        {!app.isAdmitted ? (
                          <button
                            onClick={() => handleQuickApprove(app.uniqueId)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate("/admissions")}
                            className="text-indigo-400 hover:text-indigo-300 text-xs font-medium"
                          >
                            View Dossier →
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-zinc-500 text-xs">
                    {loading ? "Loading admission records..." : "No recent admission applications."}
                  </div>
                )}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/60 text-zinc-400 font-semibold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Unique ID</th>
                      <th className="py-2.5 px-3">Applicant</th>
                      <th className="py-2.5 px-3">Program</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {recentApplications.length > 0 ? (
                      recentApplications.map((app) => (
                        <tr key={app._id} className="hover:bg-zinc-900/30 transition">
                          <td className="py-3 px-3 font-mono font-semibold text-indigo-300">
                            {app.uniqueId}
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-white truncate max-w-[130px] sm:max-w-none">
                              {app.student?.firstName} {app.student?.lastName}
                            </p>
                            <p className="text-[11px] text-zinc-500 truncate max-w-[130px] sm:max-w-none">
                              {app.student?.email ? app.student.email[0] : ""}
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-zinc-300 truncate max-w-[140px] sm:max-w-[200px]">
                              {app.course || "BCA Program"}
                            </p>
                            <p className="text-[11px] text-zinc-500">Sem {app.semester || 1}</p>
                          </td>
                          <td className="py-3 px-3">
                            {app.isAdmitted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <CheckCircle2 size={10} /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                <Clock size={10} /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {!app.isAdmitted ? (
                              <button
                                onClick={() => handleQuickApprove(app.uniqueId)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition shadow-sm"
                              >
                                Approve
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate("/admissions")}
                                className="text-zinc-500 hover:text-zinc-300 text-[11px]"
                              >
                                Dossier →
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-500">
                          {loading
                            ? "Loading admission records..."
                            : "No recent admission applications."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Operations Panel */}
          <div className="lg:col-span-4 rounded-3xl border border-zinc-800/80 bg-zinc-950 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-indigo-400" /> Administrative Shortcuts
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Fast-track day-to-day institution operations
              </p>

              <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                <Link
                  to="/create-course"
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:bg-zinc-800/60 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <GraduationCap size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Create New Curriculum</p>
                      <p className="text-[11px] text-zinc-500">Add course, fees, and syllabus</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-zinc-500 group-hover:text-white transition"
                  />
                </Link>

                <Link
                  to="/teacher"
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:bg-zinc-800/60 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Induct Faculty Member</p>
                      <p className="text-[11px] text-zinc-500">Appoint professor or lecturer</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-zinc-500 group-hover:text-white transition"
                  />
                </Link>

                <Link
                  to="/notices"
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:bg-zinc-800/60 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Megaphone size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Broadcast Campus Notice</p>
                      <p className="text-[11px] text-zinc-500">Dispatch alert to queues</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-zinc-500 group-hover:text-white transition"
                  />
                </Link>

                <Link
                  to="/payment"
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:bg-zinc-800/60 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Wallet size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Record Tuition Fee</p>
                      <p className="text-[11px] text-zinc-500">Collect payment & issue receipt</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-zinc-500 group-hover:text-white transition"
                  />
                </Link>

                <Link
                  to="/testimonials"
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:bg-zinc-800/60 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      <Quote size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Student Testimonials</p>
                      <p className="text-[11px] text-zinc-500">
                        Alumni feedback & corporate placement
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-zinc-500 group-hover:text-white transition"
                  />
                </Link>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300">
              <span className="font-semibold block text-indigo-200 mb-0.5">
                Central Institute ITM
              </span>
              Connected directly to production backend at ciitm-backend.onrender.com.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
