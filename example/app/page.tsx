"use client";

import Image from "next/image";
import { HomeEndpointClient } from "@/lib/api/generated/HomeEndpoint";
import { useApiClient } from "next-endpoints/hooks/use-api-client";
import { useEffect, useState } from "react";
import { TestEndpointClient } from "@/lib/api/generated/TestEndpoint";
import { ExoticEndpointsClient } from "@/lib/api/generated/ExoticEndpoints";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <NameListComponent />
        <CreateFileComponent />
        <TestComponent />
        <Test2Component />
        <GhostComponent />
        <CounterComponent />
        <DownloadComponent />
        <FileUploadComponent />
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

function NameListComponent() {
  const { data, error, loading } = useApiClient({
    call: HomeEndpointClient.getNames,
    args: {},
    deps: [],
    headers: { "hello-header": "hello-header-value" },
  });

  if (loading) return <p>Loading names...</p>;
  if (error) return <p>Error loading names: {error.message}</p>;
  if (!data) return <p>No names found.</p>;

  return (
    <div className="text-center sm:text-left">
      <h2 className="text-2xl font-semibold">Names from API:</h2>
      <ul className="mt-2 space-y-1">
        {data.map((name, index) => (
          <li key={index} className="text-lg">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreateFileComponent() {
  const { data, error, loading, update } = useApiClient({
    call: HomeEndpointClient.createTrouble,
    args: {
      path: "/tmp/test.txt",
      data: "Hello, world!\n",
      test: { id: 1, name: "Test" },
    },
    deps: [],
    headers: { "hello-header": "hello-header-value" },
  });

  if (loading) return <p>Creating file...</p>;
  if (error) return <p>Error creating file: {error.message}</p>;
  if (!data) return <p>No response from createTrouble.</p>;

  return (
    <div>
      <p>File creation response: {data.message}</p>;
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => update({ message: "File creation response: Reset" })}
      >
        Reset
      </button>
    </div>
  );
}

function TestComponent() {
  const [data, setData] = useState<"Pass" | "Fail">();

  useEffect(() => {
    TestEndpointClient.fetchTests({
      title: "Some Test",
      id: 1,
      name: "Some Test",
    }).then((res) => setData(res.status));
  }, []);

  return <div>{data ? `Test status: ${data}` : "Loading test status..."}</div>;
}

function Test2Component() {
  const [invoked, setInvoked] = useState(false);

  const { data, error, loading } = useApiClient({
    call: TestEndpointClient.testNo2,
    args: ["3.5", 5, "cool"],
    deps: [invoked],
  });

  if (loading) return <p>Calling testNo2...</p>;
  if (error) return <p>Error calling testNo2: {error.message}</p>;
  if (!data) return <p>No response from testNo2.</p>;

  return (
    <div className="flex flex-col items-center">
      <p>testNo2 response: {data.result}</p>;
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setInvoked(!invoked)}
      >
        Re-invoke testNo2
      </button>
    </div>
  );
}

function GhostComponent() {
  const { loading } = useApiClient({
    call: ExoticEndpointsClient.ghostMethod,
    deps: [],
  });

  return (
    <div>{loading ? "Loading ghost method..." : "Ghost method completed."}</div>
  );
}

function CounterComponent() {
  const { loading, error, data, refresh } = useApiClient({
    call: ExoticEndpointsClient.getEventStream,
    deps: [],
  });

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!data) return;

    const reader = data.getReader();

    let cancelled = false;

    async function pump() {
      while (!cancelled) {
        const { done, value } = await reader.read();

        if (value && value.count > 10) {
          refresh();
        }

        if (done) break;
        setValue(value.count);
      }
    }

    pump().then();

    return () => {
      cancelled = true;
      reader.cancel().catch(() => {});
    };
  }, [data]);

  if (loading) return <p>Loading event stream...</p>;
  if (error) return <p>Error loading event stream: {error.message}</p>;

  return <p>Streamed value: {value}</p>;
}

function DownloadComponent() {
  const { data, error, loading } = useApiClient({
    call: ExoticEndpointsClient.getFile,
    deps: [],
    onComplete: (result) =>
      console.log("File data received, size:", result.length),
  });

  if (loading) return <p>Loading file...</p>;
  if (error) return <p>Error loading file: {error.message}</p>;
  if (!data) return <p>No file data.</p>;

  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  return (
    <div>
      <a
        href={url}
        download="hello.txt"
        className="text-blue-500 underline"
        onClick={() => {
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}
      >
        Download File
      </a>
    </div>
  );
}

function FileUploadComponent() {
  const [file, setFile] = useState<File | null>(null);

  const { data, error, loading, update } = useApiClient({
    call: async () => {
      if (!file) throw new Error("No file selected");

      const fileBuffer = Buffer.from(await file.arrayBuffer());

      return ExoticEndpointsClient.uploadFile(fileBuffer, (uploaded, total) => {
        console.log('Uploaded', uploaded, 'of', total);
      });
    },
    deps: [file],
    onComplete: (result) =>
      console.log("File upload response:", result.success),
  });

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          }
        }}
        className="mb-2"
      />
      {loading && <p>Uploading file...</p>}
      {error && <p>Error uploading file: {error.message}</p>}
      {data && <p>File upload successful: {data.success.toString()}</p>}
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setFile(null)}
      >
        Reset
      </button>
    </div>
  );
}
