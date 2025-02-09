// app/page.tsx

import Navbar from '../components/Navbar';
export default function Home() {
    return (
        <div>
            <Navbar />
            <main className="p-4">
                <h1 className="text-3xl font-bold">欢迎来到我们的网站</h1>
                <p className="mt-4 text-lg">这是一个使用 Next.js 和 TypeScript 创建的导航项目。</p>
            </main>
        </div>
    );
}