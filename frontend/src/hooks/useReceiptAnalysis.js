import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

/**
 * Custom hook to manage bill and receipt upload, object URL memory cleanup, and OCR parsing.
 * @returns {Object} OCR state and action handlers
 */
export function useReceiptAnalysis() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Memory cleanup for previewUrl
  const cleanupPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  }, [previewUrl]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Clean up any existing preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }

    setFile(selectedFile);
    setResult(null);
    setError('');

    // If selected file is an image, generate preview URL
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  }, [previewUrl]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/ocr/parse', formData);
      if (response.success) {
        setResult(response.data);
      } else {
        setError('Extraction completed with empty response.');
      }
    } catch (err) {
      console.error('OCR analysis submit error:', err);
      setError(err.message || 'Failed to scan the invoice. Make sure files are under 5MB.');
    } finally {
      setLoading(false);
    }
  }, [file]);

  const handleClear = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
  }, [previewUrl]);

  return {
    file,
    previewUrl,
    loading,
    result,
    error,
    handleFileChange,
    handleSubmit,
    handleClear
  };
}
