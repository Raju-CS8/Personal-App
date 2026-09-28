/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, Task, AlertItem, CalendarEvent } from './types';
import {
  INITIAL_TASKS,
  INITIAL_ALERTS,
  INITIAL_SYNC_EVENTS,
} from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayScreen } from './components/screens/TodayScreen';
import { TasksScreen } from './components/screens/TasksScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { SearchModal } from './components/modals/SearchModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { ChecklistModal } from './components/modals/ChecklistModal';
import { ParticleProvider } from './components/ParticleBurst';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [syncEvents, setSyncEvents] = useState<CalendarEvent[]>(INITIAL_SYNC_EVENTS);
  const [activeDay, setActiveDay] = useState<string>('24'); // Oct 24 as in mockup

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isDesktopPreview, setIsDesktopPreview] = useState(true);

  // Global Keyboard Shortcuts (Cmd+K for search, 1-4 for tabs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Tasks
  const handleToggleTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          const isNowCompleted = t.status !== 'completed';
          return {
            ...t,
            status: isNowCompleted ? 'completed' : 'in_progress',
            completedAt: isNowCompleted ? 'Just now' : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          const completedCount = updatedSubtasks.filter((s) => s.completed).length;
          return {
            ...t,
            subtasks: updatedSubtasks,
            progress: t.progress
              ? { current: completedCount, total: t.progress.total }
              : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTaskPartial: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskPartial.title || 'Untitled Horizon Task',
      description: newTaskPartial.description || '',
      priority: newTaskPartial.priority || 'medium',
      tag: newTaskPartial.tag || '#Sprint',
      category: newTaskPartial.category || 'all',
      status: newTaskPartial.status || 'in_progress',
      durationEstimate: newTaskPartial.durationEstimate || '30m',
      dueText: newTaskPartial.dueText || 'Today',
      hasReminder: newTaskPartial.hasReminder || false,
      isPriorityHorizon: newTaskPartial.isPriorityHorizon ?? true,
      subtasks: newTaskPartial.subtasks,
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  // Handlers for Alerts
  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCompleteAlert = (id: string) => {
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 450);
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  // Handlers for Calendar Chimes
  const handleToggleChime = (eventId: string) => {
    setSyncEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, chimeActive: !ev.chimeActive } : ev))
    );
  };

  return (
    <ParticleProvider>
      <div className="min-h-screen bg-[#0f131c] text-[#dfe2ef] flex flex-col items-center justify-start w-full selection:bg-[#38bdf8]/30 selection:text-[#c4e7ff]">
        {/* Responsive Frame Shell Container */}
        <div
          className={`w-full flex flex-col min-h-screen relative transition-all duration-300 ${
            isDesktopPreview
              ? 'max-w-[430px] border-x border-white/[0.04] shadow-[0_0_50px_rgba(0,0,0,0.8)]'
              : 'max-w-2xl px-2'
          }`}
        >
          {/* Fixed Sticky Header */}
          <Header
            activeTab={activeTab}
            unreadAlertsCount={alerts.length}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsProfileOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />

          {/* Main View Area */}
          <main className="flex-1 w-full pt-16 pb-28 px-5">
            {activeTab === 'today' && (
              <TodayScreen
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                syncEvents={syncEvents}
                onToggleChime={handleToggleChime}
                activeDay={activeDay}
                onSelectDay={(day) => setActiveDay(day)}
              />
            )}

            {activeTab === 'tasks' && (
              <TasksScreen
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onToggleSubtask={handleToggleSubtask}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsScreen
                alerts={alerts}
                onDismissAlert={handleDismissAlert}
                onCompleteAlert={handleCompleteAlert}
                onClearAllAlerts={handleClearAllAlerts}
                onOpenChecklistModal={() => setIsChecklistOpen(true)}
                onViewAnalytics={() => setActiveTab('insights')}
              />
            )}

            {activeTab === 'insights' && <InsightsScreen />}
          </main>

          {/* Floating Island Tab Bar */}
          <BottomNav
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            alertsCount={alerts.length}
          />
        </div>

        {/* Overlays and Modals */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddTask={handleAddTask}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          tasks={tasks}
          alerts={alerts}
          syncEvents={syncEvents}
          onSelectTask={(id) => {
            const task = tasks.find((t) => t.id === id);
            if (task?.isPriorityHorizon) {
              setActiveTab('today');
            } else {
              setActiveTab('tasks');
            }
          }}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          isDesktopPreview={isDesktopPreview}
          onToggleDesktopPreview={() => setIsDesktopPreview(!isDesktopPreview)}
        />

        <ChecklistModal
          isOpen={isChecklistOpen}
          onClose={() => setIsChecklistOpen(false)}
        />
      </div>
    </ParticleProvider>
  );
}
