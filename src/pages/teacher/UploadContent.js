import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import { PageLayout } from '../../components/layout/Sidebar';
import { Spinner } from '../../components/ui';
import { SUBJECTS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE, formatFileSize } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function UploadContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview]   = useState(null);
  const [fileInfo, setFileInfo]         = useState(null);
  const [fileError, setFileError]       = useState('');
  const [isDragging, setIsDragging]     = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { rotationDuration: 30 },
  });

  const startTime = watch('startTime');

  const processFile = useCallback((file) => {
    setFileError('');
    if (!file) return;
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError('Only JPG, PNG, and GIF files are allowed.');
      setFilePreview(null); setFileInfo(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File too large. Max size is 10 MB (yours: ${formatFileSize(file.size)}).`);
      setFilePreview(null); setFileInfo(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    setFileInfo({ name: file.name, size: file.size, type: file.type });
    setValue('file', file);
  }, [setValue]);

  const onFileChange = (e) => processFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const onSubmit = async (data) => {
    if (!data.file) { setFileError('Please select a file to upload.'); return; }
    setIsSubmitting(true);
    try {
      await contentService.uploadContent(data, user.id, user.name);
      toast.success('Content uploaded successfully! Awaiting principal approval.');
      navigate('/teacher/content');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout role="teacher">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Upload Content</h1>
          <p className="text-slate-400 text-sm mt-1">Upload educational material for principal review</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* File Upload */}
          <div className="card">
            <h2 className="font-semibold text-slate-200 mb-4">Media File</h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                isDragging ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 hover:border-brand-500/50 hover:bg-slate-800/40'
              }`}
            >
              {filePreview ? (
                <div className="relative p-4">
                  <img src={filePreview} alt="Preview" className="w-full max-h-60 object-contain rounded-lg" />
                  <div className="flex items-center gap-3 mt-3 px-1">
                    <span className="text-slate-300 text-sm font-medium truncate">{fileInfo?.name}</span>
                    <span className="text-slate-500 text-xs shrink-0">{formatFileSize(fileInfo?.size)}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="text-4xl">🖼️</div>
                  <div className="text-center">
                    <p className="text-slate-300 font-medium">Drop your image here or click to browse</p>
                    <p className="text-slate-500 text-sm mt-1">JPG, PNG, GIF — max 10 MB</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif"
              className="hidden" onChange={onFileChange}
            />
            {fileError && <p className="text-red-400 text-xs mt-2">{fileError}</p>}
          </div>

          {/* Content Details */}
          <div className="card space-y-5">
            <h2 className="font-semibold text-slate-200">Content Details</h2>

            <div>
              <label className="label">Title *</label>
              <input
                className={`input ${errors.title ? 'border-red-500/50' : ''}`}
                placeholder="e.g. Introduction to Photosynthesis"
                {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 characters' } })}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="label">Subject *</label>
              <select
                className={`input ${errors.subject ? 'border-red-500/50' : ''}`}
                {...register('subject', { required: 'Subject is required' })}
              >
                <option value="">Select a subject…</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Brief description of this content…"
                {...register('description')}
              />
            </div>
          </div>

          {/* Scheduling */}
          <div className="card space-y-5">
            <h2 className="font-semibold text-slate-200">Scheduling</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Time *</label>
                <input
                  type="datetime-local"
                  className={`input ${errors.startTime ? 'border-red-500/50' : ''}`}
                  {...register('startTime', { required: 'Start time is required' })}
                />
                {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime.message}</p>}
              </div>
              <div>
                <label className="label">End Time *</label>
                <input
                  type="datetime-local"
                  className={`input ${errors.endTime ? 'border-red-500/50' : ''}`}
                  {...register('endTime', {
                    required: 'End time is required',
                    validate: (val) => {
                      if (!startTime) return true;
                      return new Date(val) > new Date(startTime) || 'End time must be after start time';
                    },
                  })}
                />
                {errors.endTime && <p className="text-red-400 text-xs mt-1">{errors.endTime.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Rotation Duration (seconds)</label>
              <input
                type="number"
                min={5}
                max={3600}
                className="input"
                placeholder="30"
                {...register('rotationDuration', {
                  min: { value: 5, message: 'Min 5 seconds' },
                  max: { value: 3600, message: 'Max 3600 seconds' },
                })}
              />
              <p className="text-slate-500 text-xs mt-1">How long this content is displayed before rotating to the next</p>
              {errors.rotationDuration && <p className="text-red-400 text-xs mt-1">{errors.rotationDuration.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary px-8">
              {isSubmitting ? <><Spinner size="sm" /> Uploading…</> : '↑ Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
