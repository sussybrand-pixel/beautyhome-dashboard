'use client';

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Toast } from "@/components/Toast";
import DashboardHome from "@/components/DashboardHome";
import ContentManager from "@/components/ContentManager";
import TextEditor from "@/components/TextEditor";
import ImageManager from "@/components/ImageManager";
import SettingsPage from "@/components/SettingsPage";
import BookingsPage from "@/components/BookingsPage";

export default function DashboardApp() {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [editorSection, setEditorSection] = useState<string>("home");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const [pendingCount, setPendingCount] = useState<number | undefined>(undefined);

  const refreshPending = async () => {
    try {
      const res = await fetch("/api/bookings/count/pending", { credentials: "include" });
      const data = await res.json();
      if (res.ok) setPendingCount(data.count);
    } catch {
      /* ignore badge errors */
    }
  };

  useEffect(() => {
    refreshPending();
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleNavigate = (page: string, section?: string) => {
    setCurrentPage(page);
    if (section) setEditorSection(section);
  };

  const handleSaveContent = () => {
    showToast("Content saved and published successfully!", "success");
    setTimeout(() => setCurrentPage("content"), 1500);
  };

  const handleSaveSettings = () => showToast("Settings updated successfully!", "success");
  const handleDeleteImage = () => showToast("Image deleted successfully!", "success");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} pendingCount={pendingCount} />
      <Navbar />

      <main className="ml-64 mt-20 p-8 space-y-6">
        {currentPage === "dashboard" && <DashboardHome onNavigate={handleNavigate} />}
        {currentPage === "content" && <ContentManager onNavigate={handleNavigate} />}
        {currentPage === "editor" && (
          <TextEditor section={editorSection} onNavigate={handleNavigate} onSave={handleSaveContent} />
        )}
        {currentPage === "images" && <ImageManager onDelete={handleDeleteImage} />}
        {currentPage === "settings" && <SettingsPage onSave={handleSaveSettings} />}
        {currentPage === "bookings" && <BookingsPage onRefreshPending={refreshPending} />}
      </main>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
