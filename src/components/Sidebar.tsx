"use client";

import { UserStats } from "@/types";
import { Globe, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    onlineUsers: 0,
  });

  useEffect(() => {
    // Simulate real-time stats - replace with actual API calls
    const fetchStats = () => {
      // Mock data - replace with actual API
      setStats({
        totalUsers: Math.floor(Math.random() * 1000) + 5000,
        onlineUsers: Math.floor(Math.random() * 100) + 200,
      });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800/50 border-l border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        {/* Community Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Community
          </h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total users
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.onlineUsers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Online now
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Domains */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Top Domains
          </h3>

          <div className="space-y-2">
            {[
              "github.com",
              "techcrunch.com",
              "ycombinator.com",
              "medium.com",
            ].map((domain, index) => (
              <div key={domain} className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <Globe className="w-3 h-3 text-gray-500" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {domain}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {Math.floor(Math.random() * 50) + 10}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
