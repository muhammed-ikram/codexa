import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Chip = ({ children }) => (
  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-200">{children}</span>
);

const getHostname = (url = "") => {
  try {
    return new URL(url).hostname;
  } catch (_) {
    return "";
  }
};

const extractYouTubeId = (url = "") => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v");
    }
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }
    return null;
  } catch (_) {
    return null;
  }
};

const getThumbnailUrl = (item = {}) => {
  const ytId = extractYouTubeId(item.url || "");
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  const host = getHostname(item.url || "");
  if (host) {
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  }
  return "https://via.placeholder.com/80x80.png?text=Link";
};

const LearningSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ groups: [] });

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/ai-mentor/learning/suggest", {});
      setData(res?.data?.suggestions || { groups: [] });
    } catch (err) {
      console.error("Learning suggestions failed", err);
      setError("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Learning Suggestions</h1>
            <p className="text-gray-400 text-sm">Personalized resources based on your projects and tech stack</p>
          </div>
          <button onClick={fetchSuggestions} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm">
            Refresh
          </button>
        </div>

        {loading && (
          <div className="text-gray-300">Fetching the latest resources…</div>
        )}
        {error && (
          <div className="text-red-400">{error}</div>
        )}

        <div className="space-y-6">
          {(data.groups || []).length === 0 ? (
            <div className="text-gray-400">No suggestions yet.</div>
          ) : (
            data.groups.map((group, gi) => (
              <div key={gi} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{group.topic || "Topic"}</h2>
                  <Chip>{(group.items || []).length} items</Chip>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(group.items || []).map((item, ii) => {
                    const thumb = getThumbnailUrl(item);
                    const host = getHostname(item.url || "");
                    return (
                      <a
                        key={ii}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex gap-3 p-3 rounded-lg bg-gray-900 border border-gray-700 hover:border-blue-500 transition-colors"
                      >
                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-800 border border-gray-700">
                          <img
                            src={thumb}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-blue-300 font-medium truncate group-hover:underline">
                              {item.title || item.url}
                            </div>
                            {item.type && <Chip>{item.type}</Chip>}
                          </div>
                          {item.reason && (
                            <div className="text-sm text-gray-300 mt-1 line-clamp-2">{item.reason}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1 truncate">{host || item.url}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningSuggestions;


