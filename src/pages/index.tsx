import { GetStaticProps } from 'next';
import Head from 'next/head'
import Link from 'next/link'
import { FiCalendar, FiUser } from 'react-icons/fi'

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

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

export default function Home() {
  return (
    <>
      <Head>
        <title>Blog - Desafio Ignite</title>
      </Head>

      <main className={commonStyles.contentContainer}>
        <Header />

        <section className={styles.pad}>
          <Link href="">
            <a className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida</p>
              <div>
                <FiCalendar />
                <time>15 Mar 2021</time>
                <FiUser />
                <p>Joseph Oliveira</p>
              </div>
            </a>
          </Link>

          <Link href="">
            <a className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida</p>
              <div>
                <FiCalendar />
                <time>15 Mar 2021</time>
                <FiUser />
                <p>Joseph Oliveira</p>
              </div>
            </a>
          </Link>

          <Link href="">
            <a className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida</p>
              <div>
                <FiCalendar />
                <time>15 Mar 2021</time>
                <FiUser />
                <p>Joseph Oliveira</p>
              </div>
            </a>
          </Link>
        </section>

        <button className={styles.button}>Carregar mais posts</button>
      </main>
    </>
  )
  // TODO
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
