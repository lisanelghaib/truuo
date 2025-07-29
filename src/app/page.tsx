"use client";

import truuo from "@/assets/truuo.png";
import LoginOrRegister from "@/components/auth/LoginOrRegister";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import NewPostModal from "@/components/NewPostModal";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types";
import { Plus, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    const mockPosts: Post[] = [
      {
        id: "1",
        title: "The Future of Web Development: What's Coming in 2024",
        url: "https://techcrunch.com/future-web-development",
        caption:
          "An in-depth look at emerging trends and technologies that will shape web development in the coming year.",
        author: "Sarah Chen",
        authorId: "user1",
        points: 156,
        upvotes: ["user2", "user3", "user4"],
        downvotes: [],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        previewImage:
          "https://via.placeholder.com/400x200/f97316/ffffff?text=TechCrunch",
        domain: "techcrunch.com",
      },
      {
        id: "2",
        title: "Building Scalable Applications with Next.js 14",
        url: "https://github.com/vercel/next.js",
        caption:
          "Learn about the new features and performance improvements in the latest version.",
        author: "Alex Rodriguez",
        authorId: "user2",
        points: 89,
        upvotes: ["user1", "user4"],
        downvotes: [],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        previewImage:
          "https://via.placeholder.com/400x200/000000/ffffff?text=GitHub",
        domain: "github.com",
      },
      {
        id: "3",
        title: "Why TypeScript is Becoming the Standard for Large Projects",
        url: "https://medium.com/typescript-standard",
        caption:
          "Exploring the benefits and adoption trends of TypeScript in enterprise development.",
        author: "Emma Wilson",
        authorId: "user3",
        points: 67,
        upvotes: ["user1"],
        downvotes: [],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        previewImage:
          "https://via.placeholder.com/400x200/00ab6c/ffffff?text=Medium",
        domain: "medium.com",
      },
      {
        id: "4",
        title: "AI Tools That Are Revolutionizing Software Development",
        url: "https://ycombinator.com/ai-tools-development",
        caption:
          "A comprehensive guide to AI-powered development tools and their impact on productivity.",
        author: "Michael Park",
        authorId: "user4",
        points: 134,
        upvotes: ["user1", "user2", "user3"],
        downvotes: [],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        previewImage:
          "https://via.placeholder.com/400x200/ff6600/ffffff?text=YCombinator",
        domain: "ycombinator.com",
      },
    ];

    setTimeout(() => {
      setPosts(mockPosts.sort((a, b) => b.points - a.points));
      setIsLoadingPosts(false);
    }, 1000);
  }, []);

  const handleVote = async (postId: string, voteType: "up" | "down") => {
    if (!user) return;

    setPosts((prevPosts) => {
      return prevPosts
        .map((post) => {
          if (post.id !== postId) return post;

          const hasUpvoted = post.upvotes.includes(user.$id);
          const hasDownvoted = post.downvotes.includes(user.$id);
          let newUpvotes = [...post.upvotes];
          let newDownvotes = [...post.downvotes];
          let pointsChange = 0;

          if (voteType === "up") {
            if (hasUpvoted) {
              // Remove upvote
              newUpvotes = newUpvotes.filter((id) => id !== user.$id);
              pointsChange = -1;
            } else {
              // Add upvote (remove downvote if exists)
              newUpvotes.push(user.$id);
              if (hasDownvoted) {
                newDownvotes = newDownvotes.filter((id) => id !== user.$id);
                pointsChange = 2; // +1 for upvote, +1 for removing downvote
              } else {
                pointsChange = 1;
              }
            }
          } else {
            if (hasDownvoted) {
              // Remove downvote
              newDownvotes = newDownvotes.filter((id) => id !== user.$id);
              pointsChange = 1;
            } else {
              // Add downvote (remove upvote if exists)
              newDownvotes.push(user.$id);
              if (hasUpvoted) {
                newUpvotes = newUpvotes.filter((id) => id !== user.$id);
                pointsChange = -2; // -1 for downvote, -1 for removing upvote
              } else {
                pointsChange = -1;
              }
            }
          }

          return {
            ...post,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            points: post.points + pointsChange,
          };
        })
        .sort((a, b) => b.points - a.points); // Re-sort by points
    });
  };

  const handleNewPost = async (data: {
    title: string;
    url: string;
    caption: string;
    previewImage?: string;
  }) => {
    if (!user) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title: data.title,
      url: data.url,
      caption: data.caption,
      author: user.name || user.email,
      authorId: user.$id,
      points: 1,
      upvotes: [user.$id],
      downvotes: [],
      createdAt: new Date().toISOString(),
      previewImage: data.previewImage,
    };

    setPosts((prevPosts) =>
      [newPost, ...prevPosts].sort((a, b) => b.points - a.points)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-800">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12 text-left grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Image
              src={truuo}
              alt="Truuo Logo"
              width={100}
              height={100}
              className="rounded-lg mx-auto md:mx-0"
            />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-10">
              Welcome to truuo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              A place to find and share the truth in a world full of
              misinformation, lies, and propaganda.
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Sign in to get started
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join our community to submit posts, vote on content, and
              participate in discussions.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-amber-500 hover:bg-amber-600 hover:cursor-pointer mt-4 text-white px-4 py-2 rounded-full w-30  justify-center flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
              >
                <User className="w-5 h-5" />
                <span>Sign in</span>
              </button>
            </div>
          </div>
        </div>
        {/* Login/Register Modal */}
        <Modal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title={showRegister ? "Register" : "Login"}
        >
          <LoginOrRegister
            showRegister={showRegister}
            setShowRegister={setShowRegister}
          />
        </Modal>
        <div className="max-w-4xl mx-auto px-6 py-12 text-left flex flex-row items-start"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto px-6 py-8">
          {/* Header with New Post Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 ">
                Latest Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover the most interesting content from around the web
              </p>
            </div>

            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-800 hover:cursor-pointer text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>New Post</span>
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {isLoadingPosts ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
                >
                  <div className="flex space-x-3">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="w-8 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onVote={handleVote} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No posts yet. Be the first to share something interesting!
                </p>
                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Submit the first post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmit={handleNewPost}
      />
    </div>
  );
}
