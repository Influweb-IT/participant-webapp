import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./BlogPosts.module.css";

interface GhostPost {
  id: string;
  title: string;
  url: string;
  feature_image: string | null;
  excerpt: string;
  custom_excerpt: string | null;
  published_at: string;
  reading_time: number;
}

interface BlogPostsProps {
  pageKey: string;
  itemKey: string;
  className?: string;
  ghostUrl?: string;
  apiKey?: string;
  blogUrl?: string;
  limit?: number;
}

const cx = (...c: Array<string | undefined | false>) =>
  c.filter(Boolean).join(" ");

const BlogPosts: React.FC<BlogPostsProps> = (props) => {
  const { t, i18n } = useTranslation([props.pageKey, "global"]);
  const [posts, setPosts] = useState<GhostPost[] | null>(null);
  const [errored, setErrored] = useState(false);

  const ghostUrl = props.ghostUrl ?? process.env.REACT_APP_GHOST_URL;
  const apiKey = props.apiKey ?? process.env.REACT_APP_GHOST_CONTENT_API_KEY;
  const blogUrl = props.blogUrl ?? ghostUrl;
  const limit = props.limit ?? 3;

  useEffect(() => {
    if (!ghostUrl || !apiKey) return;

    const fields =
      "id,title,url,feature_image,excerpt,custom_excerpt,published_at,reading_time";
    const url =
      `${ghostUrl.replace(/\/$/, "")}/ghost/api/content/posts/` +
      `?key=${encodeURIComponent(apiKey)}` +
      `&limit=${limit}` +
      `&fields=${fields}` +
      `&order=published_at%20desc`;

    let cancelled = false;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setPosts(data.posts ?? []);
      })
      .catch(() => {
        if (!cancelled) setErrored(true);
      });

    return () => {
      cancelled = true;
    };
  }, [ghostUrl, apiKey, limit]);

  if (!ghostUrl || !apiKey) return null;

  const sectionTitle = t(`${props.itemKey}.title`, "Latest from the blog");
  const readMoreLabel = t(`${props.itemKey}.readMore`, "Read more");
  const viewAllLabel = t(`${props.itemKey}.viewAll`, "Visit our blog");
  const errorLabel = t(
    `${props.itemKey}.error`,
    "Couldn't load blog posts right now."
  );
  const emptyLabel = t(`${props.itemKey}.empty`, "No posts yet.");

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <section className={cx("py-4", props.className)} aria-label={sectionTitle}>
      <div className="d-flex flex-wrap align-items-baseline justify-content-between mb-3 gap-2">
        <h2 className="h4 m-0">{sectionTitle}</h2>
        {blogUrl && (
          <a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cx("text-decoration-none fw-bold", styles.viewAll)}
          >
            {viewAllLabel} <span aria-hidden>&rarr;</span>
          </a>
        )}
      </div>

      {errored && (
        <p className="text-muted small mb-0">{errorLabel}</p>
      )}

      {!errored && posts === null && (
        <div className="row g-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="col-12 col-md-4">
              <div
                className={cx("card h-100 border-0 shadow-sm", styles.skeleton)}
                aria-hidden
              >
                <div className={styles.skeletonImage} />
                <div className="card-body">
                  <div className={styles.skeletonLine} />
                  <div
                    className={cx(styles.skeletonLine, styles.skeletonLineShort)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!errored && posts && posts.length === 0 && (
        <p className="text-muted small mb-0">{emptyLabel}</p>
      )}

      {!errored && posts && posts.length > 0 && (
        <div className="row g-3">
          {posts.map((post) => {
            const excerpt = post.custom_excerpt || post.excerpt || "";
            return (
              <div key={post.id} className="col-12 col-md-4">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(
                    "card h-100 border-0 shadow-sm text-decoration-none text-reset",
                    styles.card
                  )}
                >
                  {post.feature_image && (
                    <div className={styles.imageWrap}>
                      <img
                        src={post.feature_image}
                        alt=""
                        className={styles.image}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h3 className="h6 fw-bold mb-2">{post.title}</h3>
                    {excerpt && (
                      <p className="small text-muted mb-3 flex-grow-1">
                        {excerpt}
                      </p>
                    )}
                    <div className="d-flex justify-content-between align-items-center small text-muted mt-auto">
                      <span>{formatDate(post.published_at)}</span>
                      {post.reading_time > 0 && (
                        <span>{post.reading_time} min</span>
                      )}
                    </div>
                  </div>
                  <div
                    className={cx(
                      "card-footer bg-transparent border-0 pt-0 pb-3",
                      styles.readMore
                    )}
                  >
                    <span className="fw-bold small">
                      {readMoreLabel} <span aria-hidden>&rarr;</span>
                    </span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default BlogPosts;
