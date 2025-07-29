"use client";

import { URLPreview } from "@/types";
import { ExternalLink, Link, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    url: string;
    caption: string;
    previewImage?: string;
  }) => void;
}

export default function NewPostModal({
  isOpen,
  onClose,
  onSubmit,
}: NewPostModalProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<URLPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchURLPreview = async (inputUrl: string) => {
    if (!inputUrl) {
      setPreview(null);
      return;
    }

    // Normalize URL by adding https:// if no protocol is present
    let normalizedUrl = inputUrl;
    if (!inputUrl.match(/^https?:\/\//)) {
      normalizedUrl = `https://${inputUrl}`;
    }

    // Simple URL validation
    try {
      new URL(normalizedUrl);
    } catch {
      setPreview(null);
      return;
    }

    setIsLoadingPreview(true);
    try {
      // In a real app, you'd call an API endpoint that fetches metadata
      // For demo purposes, we'll simulate this with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const domain = new URL(normalizedUrl).hostname.replace("www.", "");
      const mockPreview: URLPreview = {
        title: title || `Content from ${domain}`,
        description:
          "This is a preview description that would be fetched from the actual URL.",
        image: `https://via.placeholder.com/400x200/f97316/ffffff?text=${domain}`,
        domain: domain,
      };

      setPreview(mockPreview);
      if (!title) {
        setTitle(mockPreview.title);
      }
    } catch (error) {
      console.error("Error fetching URL preview:", error);
      setPreview(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (url) {
        fetchURLPreview(url);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    // Normalize URL by adding https:// if no protocol is present
    let normalizedUrl = url.trim();
    if (!normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        url: normalizedUrl,
        caption: caption.trim(),
        previewImage: preview?.image,
      });

      // Reset form
      setUrl("");
      setTitle("");
      setCaption("");
      setPreview(null);
      onClose();
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Submit a new post
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Link className="w-4 h-4 inline mr-1" />
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com/article or https://example.com/article"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* URL Preview */}
          {isLoadingPreview && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {preview && !isLoadingPreview && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-start space-x-4">
                {preview.image && (
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={preview.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {preview.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {preview.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {preview.domain}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Caption (optional)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a description or your thoughts..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !url.trim() || isSubmitting}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-md transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
