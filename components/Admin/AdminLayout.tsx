import Head from 'next/head';
import styles from '../../styles/Admin.module.scss';

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Admin Dashboard - PC Shop</title>
      </Head>
      <div className={styles.adminLayout}>
        {children}
      </div>
    </>
  );
}