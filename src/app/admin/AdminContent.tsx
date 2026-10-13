"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PencilIcon, TrashIcon, UploadIcon, VideoIcon } from "@/components/icons";
import type { ModuleRow } from "@/lib/course";

const inputCls =
  "h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3 text-sm font-medium text-ink placeholder:font-normal placeholder:text-muted";

type Draft = { title: string; duration: string; isFree: boolean; videoKey: string };

export function AdminContent({ modules }: { modules: ModuleRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({
    title: "",
    duration: "",
    isFree: false,
    videoKey: "",
  });
  const [newLesson, setNewLesson] = useState({
    moduleId: modules[0]?.id ?? "",
    title: "",
    duration: "",
    isFree: false,
    videoKey: "sample.mp4",
  });
  const [newModule, setNewModule] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  /** Video file ko media/ par bhejta hai aur mila hua videoKey form mein daal deta hai. */
  async function uploadVideo(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Upload nahi hua.");
      setNewLesson((n) => ({ ...n, videoKey: data.videoKey }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload nahi hua.");
    } finally {
      setUploading(false);
    }
  }

  async function call(url: string, method: string, body?: unknown) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Save nahi hua.");
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save nahi hua.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap-reverse items-start gap-5">
      {/* ---------- module + lesson list ---------- */}
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-3">
        {error && (
          <span className="rounded-[10px] bg-danger-soft px-3.5 py-2.5 text-[13.5px] font-semibold text-danger">
            {error}
          </span>
        )}

        {modules.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-[14px] border border-line bg-surface">
            <div className="flex items-center gap-3 border-b border-line bg-surface-muted px-4.5 py-3.5">
              <span className="text-[13px] font-bold text-muted">{m.position}</span>
              <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-ink">
                {m.title}
              </span>
              <span className="text-[12.5px] font-medium whitespace-nowrap text-muted">
                {m.lessons.length} lessons
              </span>
              <button
                type="button"
                title="Delete module"
                disabled={busy}
                onClick={() => {
                  if (!window.confirm(`"${m.title}" aur uske saare lessons delete karein?`)) return;
                  void call(`/api/admin/modules?id=${encodeURIComponent(m.id)}`, "DELETE");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong bg-surface text-muted hover:border-transparent hover:bg-danger-soft hover:text-danger"
              >
                <TrashIcon size={14} />
              </button>
            </div>

            {m.lessons.map((l) =>
              editing === l.id ? (
                <div
                  key={l.id}
                  className="flex flex-wrap items-center gap-2.5 border-b border-line-soft px-4.5 py-3"
                >
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="Lesson title"
                    className="h-10 flex-[1_1_200px] rounded-[9px] border border-brand bg-surface px-3 text-sm font-medium shadow-[0_0_0_3px_var(--color-brand-soft)]"
                  />
                  <input
                    value={draft.duration}
                    onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                    placeholder="mm:ss"
                    className="h-10 w-24 rounded-[9px] border border-line-strong bg-surface px-3 text-sm font-medium"
                  />
                  <input
                    value={draft.videoKey}
                    onChange={(e) => setDraft({ ...draft, videoKey: e.target.value })}
                    placeholder="Video URL ya file name"
                    className="h-10 w-40 rounded-[9px] border border-line-strong bg-surface px-3 text-sm font-medium"
                  />
                  <label className="flex items-center gap-1.5 text-[13px] font-medium text-body">
                    <input
                      type="checkbox"
                      checked={draft.isFree}
                      onChange={(e) => setDraft({ ...draft, isFree: e.target.checked })}
                      className="h-4 w-4 accent-brand"
                    />
                    Free
                  </label>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      const ok = await call("/api/admin/lessons", "PATCH", { id: l.id, ...draft });
                      if (ok) setEditing(null);
                    }}
                    className="rounded-[9px] bg-brand px-3.5 py-2.75 text-[13px] font-semibold text-white hover:bg-brand-dark"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded-[9px] border border-line-strong bg-surface px-3 py-2.5 text-[13px] font-semibold text-body"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  key={l.id}
                  className="flex flex-wrap items-center gap-2.5 border-b border-line-soft px-4.5 py-2.5"
                >
                  <VideoIcon size={15} className="shrink-0 text-muted" />
                  <span className="min-w-0 flex-[1_1_180px] text-sm font-medium leading-snug text-ink">
                    {l.title}
                  </span>
                  <span className="font-mono text-xs font-medium text-muted">{l.duration}</span>
                  {l.isFree && (
                    <span className="rounded-md bg-ok-soft px-1.75 py-1 text-[10.5px] font-semibold text-ok">
                      Free
                    </span>
                  )}
                  <button
                    type="button"
                    title="Edit"
                    onClick={() => {
                      setEditing(l.id);
                      setDraft({
                        title: l.title,
                        duration: l.duration,
                        isFree: l.isFree,
                        videoKey: "",
                      });
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong bg-surface text-muted hover:border-transparent hover:bg-brand-soft hover:text-brand"
                  >
                    <PencilIcon size={14} />
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    disabled={busy}
                    onClick={() => {
                      if (!window.confirm(`"${l.title}" delete karein?`)) return;
                      void call(`/api/admin/lessons?id=${encodeURIComponent(l.id)}`, "DELETE");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong bg-surface text-muted hover:border-transparent hover:bg-danger-soft hover:text-danger"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              ),
            )}

            {m.lessons.length === 0 && (
              <p className="px-4.5 py-3.5 text-sm text-muted">Is module mein abhi koi lesson nahi.</p>
            )}
          </div>
        ))}
      </div>

      {/* ---------- add forms ---------- */}
      <div className="flex flex-[1_1_300px] flex-col gap-3.5">
        <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface p-4.5">
          <span className="text-[15px] font-bold text-ink">Naya lesson add karein</span>
          <select
            value={newLesson.moduleId}
            onChange={(e) => setNewLesson({ ...newLesson, moduleId: e.target.value })}
            className="h-11 rounded-[10px] border border-line-strong bg-surface px-2.5 text-sm font-medium text-ink"
          >
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.position}. {m.title}
              </option>
            ))}
          </select>
          <input
            value={newLesson.title}
            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
            placeholder="Lesson title"
            className={inputCls}
          />
          <input
            value={newLesson.duration}
            onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
            placeholder="Duration (mm:ss)"
            className={inputCls}
          />
          <input
            value={newLesson.videoKey}
            onChange={(e) => setNewLesson({ ...newLesson, videoKey: e.target.value })}
            placeholder="Video URL ya file name"
            className={inputCls}
          />
          <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed border-line-strong bg-surface-muted p-4.5 text-center hover:border-brand">
            <UploadIcon size={20} className="text-muted" />
            <span className="text-[13px] font-semibold leading-snug text-body">
              {uploading ? "Upload ho raha hai..." : "Video upload karein"}
            </span>
            <span className="text-[11.5px] font-medium leading-snug text-muted">
              MP4 / WebM / MOV · max 500 MB
            </span>
            <span className="text-[11.5px] font-medium leading-snug text-muted">
              Ya upar wale field mein seedha video ka URL paste kar dein
            </span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void uploadVideo(f);
              }}
              className="hidden"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-[13.5px] font-medium text-body">
            <input
              type="checkbox"
              checked={newLesson.isFree}
              onChange={(e) => setNewLesson({ ...newLesson, isFree: e.target.checked })}
              className="h-4 w-4 accent-brand"
            />
            Free preview lesson
          </label>
          <button
            type="button"
            disabled={busy || uploading || !newLesson.moduleId}
            onClick={async () => {
              const ok = await call("/api/admin/lessons", "POST", newLesson);
              if (ok) setNewLesson({ ...newLesson, title: "", duration: "", isFree: false });
            }}
            className="rounded-[10px] bg-brand px-4 py-3.25 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            + Lesson add karein
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface p-4.5">
          <span className="text-[15px] font-bold text-ink">Naya module</span>
          <input
            value={newModule}
            onChange={(e) => setNewModule(e.target.value)}
            placeholder="Module title"
            className={inputCls}
          />
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              const ok = await call("/api/admin/modules", "POST", { title: newModule });
              if (ok) setNewModule("");
            }}
            className="rounded-[10px] border border-line-strong bg-surface px-4 py-3 text-sm font-semibold text-ink hover:bg-[#f7f8fa] disabled:opacity-60"
          >
            + Module add karein
          </button>
        </div>
      </div>
    </div>
  );
}
