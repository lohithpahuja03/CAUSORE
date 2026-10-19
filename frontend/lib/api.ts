/**
 * CAUSORE Engine API Client
 * Connects the Next.js frontend with the FastAPI backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface BackendHealthResponse {
  status: string;
  version: string;
  database: string;
}

export interface BackendInvestigation {
  id: string;
  title: string;
  description?: string;
  severity: string;
  environment: string;
  status: string;
  incident_start_time: string;
  incident_end_time?: string;
  created_at: string;
  evidence_files_count: number;
}

export async function checkBackendHealth(): Promise<{ online: boolean; info?: BackendHealthResponse }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return { online: true, info: data };
    }
  } catch {
    // Engine offline or unreachable
  }
  return { online: false };
}

export async function createBackendInvestigation(payload: {
  title: string;
  description?: string;
  severity: string;
  environment: string;
  incident_start_time: string;
  incident_end_time?: string;
}): Promise<BackendInvestigation | null> {
  try {
    const res = await fetch(`${API_BASE}/investigations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Error creating investigation in backend:', err);
    return null;
  }
}

export async function uploadEvidenceFile(
  investigationId: string,
  file: File,
  sourceType: string
): Promise<{ success: boolean; data?: unknown }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_type', sourceType);

    const res = await fetch(`${API_BASE}/investigations/${investigationId}/evidence`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) return { success: false };
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error('Error uploading evidence file:', err);
    return { success: false };
  }
}

export async function seedSampleInvestigation(): Promise<{ success: boolean; data?: unknown }> {
  try {
    const res = await fetch(`${API_BASE}/investigations/seed-sample`, {
      method: 'POST',
    });
    if (!res.ok) return { success: false };
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error('Error seeding backend sample:', err);
    return { success: false };
  }
}
