import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '../services/content.service';
import { useAsync } from '../hooks/useAsync';
import { MOCK_USERS } from '../utils/mockData';
import { formatDate } from '../utils/helpers';
import { LoadingPage, ErrorState, EmptyState } from '../components/ui';

const POLL_INTERVAL = 30_000; // 30 seconds

export default function LivePage() {
  const { teacherId } = useParams();
  const teacher = MOCK_USERS.find(u => u.id === teacherId);
  const [currentIdx, setCurrentIdx] = useState(0);

  const fetchFn  = useCallback(() => contentService.getLiveContent(teacherId), [teacherId]);
  const { data: items, loading, error, refetch } = useAsync(fetchFn);

  // Auto-refresh polling
  useEffect(() => {
    const interval = setInterval(refetch, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refetch]);

  // Auto-rotate content
  useEffect(() => {
    if (!items || items.length <= 1) return;
    const duration = (items[currentIdx]?.rotationDuration || 30) * 1000;
    const timer = setTimeout(() => {
      setCurrentIdx(i => (i + 1) % items.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [items, currentIdx]);

  const current = items?.[currentIdx];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600" />

      {/* Header */}
      <header className="relative z-10 glass border-b border-slate-800 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-sm">EB</div>
            <div>
              <div className="font-bold text-slate-100">EduBroadcast Live</div>
              {teacher && (
                <div className="text-xs text-slate-400">
                  {teacher.name}'s Channel
                </div>
              )}
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            {!loading && items && items.length > 0 && (
              <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            )}
            <span className="text-slate-500 text-xs">Auto-refreshes every 30s</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {loading && <LoadingPage />}

        {error && <ErrorState message={error} onRetry={refetch} />}

        {!teacher && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
            <div className="text-5xl">👤</div>
            <h2 className="text-xl font-semibold text-slate-300">Teacher not found</h2>
            <p className="text-slate-500 text-sm">The teacher ID in this URL doesn't match any known teacher.</p>
          </div>
        )}

        {!loading && !error && items?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in">
            <div className="text-6xl">📡</div>
            <h2 className="text-2xl font-semibold text-slate-300">No Content Available</h2>
            <p className="text-slate-500 text-center max-w-md">
              There's no active broadcast from {teacher?.name ?? 'this teacher'} right now.
              Check back later!
            </p>
            <button onClick={refetch} className="btn-secondary text-sm">🔄 Refresh</button>
          </div>
        )}

        {!loading && !error && current && (
          <div className="animate-fade-in">
            {/* Content card */}
            <div className="glass rounded-3xl overflow-hidden shadow-2xl shadow-brand-900/20 border border-brand-500/10">
              {/* Image */}
              <div className="relative bg-slate-900">
                <img
                  key={current.id}
                  src={current.fileUrl}
                  alt={current.title}
                  className="w-full max-h-[60vh] object-contain animate-fade-in"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    BROADCASTING LIVE
                  </span>
                </div>
                {items.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-slate-300">
                    {currentIdx + 1} / {items.length}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-8">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs font-semibold mb-3">
                      {current.subject}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-100 leading-tight mb-2">{current.title}</h1>
                    {current.description && (
                      <p className="text-slate-400 text-base leading-relaxed">{current.description}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-slate-500 shrink-0">
                    <div>By {current.teacherName}</div>
                    <div className="mt-1">Until {formatDate(current.endTime)}</div>
                  </div>
                </div>

                {/* Rotation dots */}
                {items.length > 1 && (
                  <div className="flex items-center gap-2 mt-6">
                    {items.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIdx(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === currentIdx
                            ? 'w-6 h-2 bg-brand-500'
                            : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs text-slate-500">
                      Rotates every {current.rotationDuration}s
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Other active items */}
            {items.length > 1 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Also Broadcasting</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {items.filter((_, i) => i !== currentIdx).map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIdx(items.indexOf(item))}
                      className="glass rounded-xl overflow-hidden text-left hover:border-brand-500/30 transition-all"
                    >
                      <div className="h-20 bg-slate-900 overflow-hidden">
                        <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy"
                          onError={e => { e.target.style.display='none'; }} />
                      </div>
                      <div className="p-2.5">
                        <div className="text-xs font-medium text-slate-200 truncate">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.subject}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 mt-16 py-6 px-8 text-center text-slate-600 text-xs">
        EduBroadcast — Content Broadcasting System · Public Live Feed
      </footer>
    </div>
  );
}
