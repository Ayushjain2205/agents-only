import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Collectors Arena</title>
        <meta
          name="description"
          content="Collect and battle with powerful characters in this epic fantasy game"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="rpgui-content">
        <div
          className="rpgui-container framed h-screen w-screen overflow-y-auto"
          style={{ height: "100vh", width: "100vw" }}
        >
          {/* Header section */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src="/robot-head.png"
                alt="game logo"
                className="w-12 h-12 rounded-full"
              />
              <h1 className="text-white text-[24px] title">Collectors Arena</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="rpgui-icon potion-red"></div>
                <span className="text-white">1250</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rpgui-icon potion-blue"></div>
                <span className="text-white">15</span>
              </div>
            </div>
          </div>

          <div className="py-8">{children}</div>
        </div>
      </div>
    </>
  );
}
