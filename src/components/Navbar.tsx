// components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4">
            <ul className="flex space-x-4">
                <li>
                    <Link href="/" className="text-white hover:text-gray-200">
                        首页
                    </Link>
                </li>
                <li>
                    <Link href="/about" className="text-white hover:text-gray-200">
                        关于我们
                    </Link>
                </li>
                <li>
                    <Link href="/contact" className="text-white hover:text-gray-200">
                        联系我们
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;