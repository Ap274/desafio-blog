import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const formatPosts = postsPagination.results.map(post => ({
    ...post,
    first_publication_date: format(
      new Date(post.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
      ),
  }));

  const [posts, setPosts] = useState<Post[]>(formatPosts);
  //post list formatted
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  //stores the url of the next page of posts

  async function handleNextPage(): Promise<void> {
    if (!nextPage) return;

    const postsResults = await fetch(nextPage).then(response => response.json());
    // console.log(postsResults);

    setNextPage(postsResults.next_page);

    const newPosts = postsResults.results.map((post: Post) => ({
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    }));

    if (newPosts && newPosts.length > 0) {
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    }
  }

  return (
    <>
      <Head>
        <title>Blog - Desafio Ignite</title>
      </Head>

      <main className={commonStyles.contentContainer}>
        <Header />

        <section className={styles.pad}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a className={styles.post}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div>
                  <FiCalendar />
                  <time>{post.first_publication_date}</time>
                  <FiUser />
                  <p>{post.data.author}</p>
                </div>
              </a>
            </Link>
          ))}

          {nextPage && (
            <button
              className={styles.button}
              type="button"
              onClick={handleNextPage}
            >
              Carregar mais posts
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
    orderings: {
      field: 'last_publication_date',
      direction: 'desc',
    },
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  console.log(postsPagination.next_page);

  return {
    props: {
      postsPagination,
    },
  };
};
