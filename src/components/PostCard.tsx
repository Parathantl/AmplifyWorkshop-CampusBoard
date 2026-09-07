import { CATEGORY_LABELS, type Post } from '../types';

type Props = {
  post: Post;
  canDelete: boolean;
  onDelete: () => void;
};

function timeAgo(iso: string) {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)} min ago`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)} h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function PostCard({ post, canDelete, onDelete }: Props) {
  const category = post.category ?? 'NOTICE';
  return (
    <article className={`card post cat-${category}`}>
      <div className="post-head">
        <span className="chip">{CATEGORY_LABELS[category]}</span>
        <span className="muted">{timeAgo(post.createdAt)}</span>
      </div>
      <h3>{post.title}</h3>
      {post.body && <p>{post.body}</p>}
      <div className="post-foot">
        <span className="muted">{post.author ? `by ${post.author}` : 'anonymous'}</span>
        <span className="actions">
          {post.link && (
            <a href={post.link} target="_blank" rel="noreferrer">
              Open link ↗
            </a>
          )}
          {canDelete && (
            <button className="link danger" onClick={onDelete}>
              Delete
            </button>
          )}
        </span>
      </div>
    </article>
  );
}
