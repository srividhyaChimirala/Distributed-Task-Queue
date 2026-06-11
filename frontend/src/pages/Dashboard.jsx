import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>

      <h1 className="text-5xl font-bold text-white">
        Task throughput is healthy
      </h1>

      <p className="text-slate-400 mt-3">
        4 of 6 workers online, processing 248 tasks/min.
      </p>

    </Layout>
  );
}