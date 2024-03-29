'use client';

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { ExtendedPost } from '@/types/db';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import Post from './Post';
import { Loader2 } from 'lucide-react';

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const PostFeed: React.FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const lastPostRef = useRef<HTMLElement | null>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const session = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['infinite-query'],
    queryFn: async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '');

      const { data } = await axios.get(query);

      return data as ExtendedPost[];
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const posts =
    [...initialPosts, ...(data?.pages.flatMap((page) => page) || [])] ??
    initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1;
          if (vote.type === 'DOWN') return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session.data?.user.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                post={post}
                currentVote={currentVote}
                votesAmt={votesAmt}
              />
            </li>
          );
        }

        return (
          <li key={post.id}>
            <Post
              commentAmt={post.comments.length}
              subredditName={post.subreddit.name}
              post={post}
              currentVote={currentVote}
              votesAmt={votesAmt}
            />
          </li>
        );
      })}
      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </li>
      )}
    </ul>
  );
};

export default PostFeed;
