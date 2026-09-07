import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import './App.css';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostCard from './components/PostCard';
import type { NewPost, Post } from './types';

const client = generateClient<Schema>();

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Query once, then keep receiving every create/update/delete over a WebSocket
    const subscription = client.models.Post.observeQuery().subscribe({
      next: ({ items }) =>
        setPosts([...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
    });
    return () => subscription.unsubscribe();
  }, []);

  async function addPost(input: NewPost) {
    const { errors } = await client.models.Post.create(input);
    if (errors) alert(errors.map((e) => e.message).join('\n'));
  }

  async function deletePost(id: string) {
    const { errors } = await client.models.Post.delete({ id });
    if (errors) alert(errors.map((e) => e.message).join('\n'));
  }

  return (
    <div className="page">
      <Header />
      <main className="layout">
        <aside className="compose">
          <PostForm onSubmit={addPost} />
        </aside>
        <section className="feed">
          <h2>
            Board <span className="count">{posts.length}</span>
          </h2>
          {posts.length === 0 && <p className="empty">Nothing here yet. Be the first to post.</p>}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} canDelete onDelete={() => deletePost(post.id)} />
          ))}
        </section>
      </main>
      <footer className="foot">
        Campus Board · University of Jaffna AWS Builders Group · built with AWS Amplify Gen 2
      </footer>
    </div>
  );
}
