import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { useSandbox } from "../../features/sandbox/hooks/useSandbox.js";
import PublicNavbar from "../components/PublicNavbar.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import ProjectCard from "../components/dashboard/ProjectCard.jsx";
import EmptyProjectsState from "../components/dashboard/EmptyProjectsState.jsx";
import NewProjectModal from "../components/dashboard/NewProjectModal.jsx";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.sandbox);
  const { getUserAllProjects, createProject, createSandbox, isLoading, error } =
    useSandbox();

  const [modalOpen, setModalOpen] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  // Fetch all projects on mount (once)
  useEffect(() => {
    if (!fetchedOnce) {
      setFetchedOnce(true);
      getUserAllProjects();
    }
  }, [fetchedOnce, getUserAllProjects]);

  // Handler: open the create project modal
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // Handler: create a project — hook handles navigation
  const handleCreateProject = async (title) => {
    await createProject({ title });
    setModalOpen(false);
  };

  // Handler: launch a sandbox for existing project
  const handleLaunch = async (projectId) => {
    await createSandbox(projectId);
    // createSandbox in the hook already navigates to /chats/:sandboxId
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col overflow-y-auto">
      {/* Ambient glows */}
      <div
        className="fixed -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[180px] opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #c9a84c 0%, #1e2540 60%, transparent 100%)",
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-[200px] opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #2c529f 0%, #0a0e1a 70%, transparent 100%)",
        }}
      />

      {/* Navbar */}
      <PublicNavbar />

      {/* Page Body */}
      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-10 pb-16">
        {/* Header */}
        <DashboardHeader
          user={user}
          projectCount={projects?.length ?? 0}
          onNewProject={handleOpenModal}
          isLoading={isLoading}
        />

        {/* Loading skeleton */}
        {isLoading && (!projects || projects.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-gold" />
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
              Fetching workspaces...
            </p>
          </div>
        ) : !projects || projects.length === 0 ? (
          /* Empty state */
          <EmptyProjectsState onNewProject={handleOpenModal} isLoading={isLoading} />
        ) : (
          /* Project grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onLaunch={handleLaunch}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateProject}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Dashboard;
