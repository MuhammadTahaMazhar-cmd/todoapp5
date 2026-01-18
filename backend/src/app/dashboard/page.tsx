'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Menu,
  CheckCircle2,
  Filter,
  List,
  Grid,
  Circle,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { TaskProvider } from '@/contexts/TaskContext';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TaskTrendsChart } from '@/components/dashboard/TaskTrendsChart';
import { WeeklyActivityChart } from '@/components/dashboard/WeeklyActivityChart';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { TaskList } from '@/components/tasks/TaskList';
import { cn } from '@/lib/utils';

type ViewMode = 'overview' | 'tasks';

function DashboardContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { tasks, loading, fetchTasks } = useTasks();
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Fetch tasks on mount
  useEffect(() => {
    if (isAuthenticated && !loading && tasks.length === 0) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate this week's added tasks
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const thisWeekAdded = tasks.filter(task => {
      if (!task.created_at) return false;
      const taskDate = new Date(task.created_at);
      return taskDate >= weekStart;
    }).length;

    return {
      total,
      completed,
      active,
      completionRate,
      thisWeekAdded,
      activeTrend: active > 0 ? `${((active / total) * 100).toFixed(1)}% active` : '0%',
      completedTrend: completionRate > 0 ? `${completionRate}% completed` : '0%',
    };
  }, [tasks]);

  // Filter tasks based on selected filter
  const filteredTasks = useMemo(() => {
    if (taskFilter === 'all') return tasks;
    if (taskFilter === 'active') return tasks.filter((t) => !t.completed);
    return tasks.filter((t) => t.completed);
  }, [tasks, taskFilter]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onCreateTask={() => setShowCreateModal(true)}
      />

      <main className="lg:pl-64 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-zinc-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-playfair underline-gradient">
                    Welcome, {user?.name || user?.email?.split('@')[0] || 'User'}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Manage your tasks and boost your productivity
                  </p>
                </div>
          </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('overview')}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                      viewMode === 'overview'
                        ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    <Grid className="w-4 h-4 inline mr-1.5" />
                    Overview
                  </button>
                  <button
                    onClick={() => setViewMode('tasks')}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                      viewMode === 'tasks'
                        ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    <List className="w-4 h-4 inline mr-1.5" />
                    Tasks
                  </button>
                </div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  size="sm"
                  className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg"
                >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Task
          </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {viewMode === 'overview' ? (
            <>
          {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
                  title="Active Tasks"
              value={stats.active}
              icon={Circle}
              iconColor="text-purple-400 dark:text-purple-300"
              trend={{ value: stats.activeTrend, isPositive: true }}
            />
            <StatsCard
                  title="Completed Tasks"
              value={stats.completed}
              icon={CheckCircle2}
              iconColor="text-green-400 dark:text-green-300"
              trend={{ value: stats.completedTrend, isPositive: true }}
            />
            <StatsCard
                  title="Total Tasks"
              value={stats.total}
              icon={BarChart3}
              iconColor="text-purple-400 dark:text-purple-300"
            />
                <StatsCard
                  title="Added This Week"
                  value={stats.thisWeekAdded}
                  icon={Calendar}
                  iconColor="text-purple-400 dark:text-purple-300"
                />
          </div>

          {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TaskTrendsChart tasks={tasks} />
            <WeeklyActivityChart tasks={tasks} />
          </div>

              {/* Hero Section with Logo */}
              <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 dark:from-zinc-900 dark:via-purple-950 dark:to-zinc-900 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 md:p-12 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 dark:bg-purple-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 font-playfair underline-gradient">
                      Boost Your Productivity
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg mb-6">
                      Organize your tasks and achieve your goals with TaskMaster
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Task
                      </Button>
                      <button
                        onClick={() => router.push('/calendar')}
                        className="px-4 py-2 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-500 dark:text-purple-300 font-medium transition-colors"
                      >
                        View Task Calendar
                      </button>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-2xl transform transition-transform duration-300 group-hover:scale-110">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                            <path d="M8 14h.01"></path>
                            <path d="M12 14h.01"></path>
                            <path d="M16 14h.01"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {/* Task Filter */}
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 p-3">
                <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <div className="flex items-center gap-1">
                  {(['all', 'active', 'completed'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTaskFilter(filter)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-md transition-all capitalize',
                        taskFilter === filter
                          ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:underline decoration-purple-300/50'
                      )}
                    >
                      {filter === 'active' ? 'Active' : filter}
                    </button>
                  ))}
                </div>
                <div className="ml-auto text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </div>
              </div>

              {/* Task List */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-slate-400 dark:text-zinc-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 font-playfair underline-purple">
                      No {taskFilter === 'all' ? '' : taskFilter === 'active' ? 'active' : taskFilter} tasks
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {taskFilter === 'all'
                        ? 'Add your first task to get started!'
                        : `No ${taskFilter === 'active' ? 'active' : taskFilter} tasks at the moment.`}
                    </p>
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add Task
                    </Button>
                  </div>
                ) : (
                  <TaskList tasks={filteredTasks} />
                )}
              </div>
          </div>
          )}
        </div>
      </main>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
}
