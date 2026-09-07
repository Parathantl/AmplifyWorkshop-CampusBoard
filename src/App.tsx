import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostCard from './components/PostCard';
import type { NewPost, Post } from './types';

// Local sample data. Module 1 swaps this for the cloud API.
const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to the Campus Board',
    body: 'Notices, events, lost & found and study groups, all in one place. Anyone can read; sign in to post.',
    category: 'NOTICE',
    author: 'AWS Builders Group',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Amplify Gen 2 workshop today',
    body: 'Bring a laptop with Node 20 and an AWS account. Faculty of Engineering, Lab 2.',
    category: 'EVENT',
    link: 'https://docs.amplify.aws',
    author: 'Parathan',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Lost: blue water bottle',
    body: 'Left in the library reading room on Tuesday. Has a Jaffna sticker on it.',
    category: 'LOST_FOUND',
    author: 'Kavi',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

export default function App() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);

  function addPost(input: NewPost) {
    const post: Post = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...input };
    setPosts((current) => [post, ...current]);
  }

  function deletePost(id: string) {
    setPosts((current) => current.filter((p) => p.id !== id));
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
