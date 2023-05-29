import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import ptBR from 'date-fns/locale/pt-BR';
import { format, parseISO } from 'date-fns';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return (
      <h3>Carregando...</h3>
    )
  }

  const numberOfWords = post.data.content.reduce((acc, item) => {
    const headingTime = item.heading.split(/\s+/).length;
    const totalWords = RichText.asText(item.body).split(/\s+/).length;

    return acc + totalWords + headingTime;
  }, 0)

  const readingTime = Math.ceil(numberOfWords/200)


  return (
    <>
    <Head>
      <title>{post.data.title} | Blog </title>
    </Head>

    <Header />
    <img src={post.data.banner.url} alt="banner" className={styles.banner}/>
    <main className={commonStyles.contentContainer}>
      <article className={styles.post}>
        <div className={styles.pad}>
          <h1>{post.data.title}</h1>
          <div>
            <FiCalendar />
            <time>{format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR })}</time>
            <FiUser />
            <p>{post.data.author}</p>
            <FiClock />
            <p>{`${readingTime} min`}</p>
          </div>
        </div>

        {post.data.content.map((content) => {
          return (
            <div key={content.heading}>
              <h2>{content.heading}</h2>
              <div
                dangerouslySetInnerHTML={{__html: RichText.asHtml(content.body)}}
                className={styles.content}
              />

            </div>
          )
        })}
      </article>
    </main>
  </>

  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post');

  const paths = posts.results.map((post) => {
    return {
      params: {
        slug: post.uid,
      },
    };
  })

  return {
    paths,
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {})

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url
      },
      author: response.data.author,
      content: response.data.content,
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 30 // 30 minutes
  }
}
