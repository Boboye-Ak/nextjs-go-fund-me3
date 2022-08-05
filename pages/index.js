import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Go Fund Me 3</title>
        <meta name="description" content="A Web3 CrowdFunding Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        Hello World
      </div>
    </div>
  );
}
