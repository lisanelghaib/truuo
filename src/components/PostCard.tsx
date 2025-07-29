"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: "up" | "down") => void;
}

export default function PostCard({ post, onVote }: PostCardProps) {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);

  const hasUpvoted = user && post.upvotes.includes(user.$id);
  const hasDownvoted = user && post.downvotes.includes(user.$id);

  const handleVote = async (voteType: "up" | "down") => {
    if (!user || isVoting) return;

    setIsVoting(true);
    try {
      await onVote(post.id, voteType);
    } finally {
      setIsVoting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  };

  const getAbsoluteUrl = (url: string) => {
    if (!url) return "";
    // If URL already has protocol, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // If URL starts with //, add https
    if (url.startsWith("//")) {
      return `https:${url}`;
    }
    // If URL doesn't have protocol, add https://
    return `https://${url}`;
  };

  return (
    <div className="bg-gray-800 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex space-x-3">
        {/* Voting */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={() => handleVote("up")}
            disabled={isVoting || !user}
            className={`p-1 rounded transition-colors ${
              hasUpvoted
                ? "text-orange-600 bg-orange-200"
                : " text-orange-500 bg-gray-100 hover:bg-orange-200 hover:cursor-pointer"
            } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {post.points}
          </span>

          <button
            onClick={() => handleVote("down")}
            disabled={isVoting || !user}
            className={`p-1 rounded transition-colors ${
              hasDownvoted
                ? "text-blue-600 bg-blue-200 "
                : "text-blue-500 bg-gray-100 hover:bg-blue-200 hover:cursor-pointer"
            } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start space-x-3">
            {/* Preview Image */}
            {post.previewImage && (
              <div className="w-44 h-44 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={post.previewImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Post Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                <a
                  href={getAbsoluteUrl(post.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  {post.title}
                </a>
              </h3>

              {post.caption && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                  {post.caption}
                </p>
              )}

              <div className="flex items-center space-x-4 text-xs text-amber-200 ">
                <div className="flex items-center space-x-1">
                  <span>by {post.author}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>

                {getDomain(post.url) && (
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>{getDomain(post.url)}</span>
                  </div>
                )}

                <button className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  <MessageCircle className="w-3 h-3" />
                  <span>discuss</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
