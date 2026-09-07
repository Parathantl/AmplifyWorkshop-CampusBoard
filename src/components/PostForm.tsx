import { useState, type FormEvent } from 'react';
import { CATEGORIES, CATEGORY_LABELS, type Category, type NewPost } from '../types';

type Props = {
  onSubmit: (post: NewPost) => Promise<void> | void;
  /** Module 2: the signed-in user's email. When set, the name field is hidden. */
  author?: string;
};

export default function PostForm({ onSubmit, author }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Category>('NOTICE');
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim() || undefined,
        category,
        link: link.trim() || undefined,
        author: (author ?? name).trim() || undefined,
      });
      setTitle('');
      setBody('');
      setLink('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>New post</h2>
      <label>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to share?"
          maxLength={80}
          required
        />
      </label>
      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </label>
      <label>
        Details
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Where, when, who to contact…"
          maxLength={500}
        />
      </label>
      <label>
        Link <span className="muted">(optional)</span>
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" type="url" />
      </label>
      {author ? (
        <p className="muted">
          Posting as <strong>{author}</strong>
        </p>
      ) : (
        <label>
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="So people know who to ask"
            maxLength={40}
          />
        </label>
      )}
      <button className="primary" type="submit" disabled={busy || !title.trim()}>
        {busy ? 'Posting…' : 'Post to the board'}
      </button>
    </form>
  );
}
