import { Link } from 'react-router-dom';

interface NavbarItem {
  name: string;
  url: string;
  onClick?: () => void; // Tambahkan prop onClick dengan tipe fungsi tanpa argumen
}

interface NavbarProps {
  navbarItems: NavbarItem[];
}

const Navbar = ({ navbarItems }: NavbarProps) => {
  return (
    <nav className="absolute bottom-3 hover:bottom-5 duration-200 w-full">
      <ul className="flex justify-center">
        {navbarItems.map((item, index) => (
          <li className="px-4 py-2" key={index}>
            {item.onClick ? ( // Periksa apakah prop onClick didefinisikan
              <button
                className="text-white bg-gray-800 drop-shadow-lg p-2 rounded-full"
                onClick={item.onClick}
              >
                {item.name}
              </button>
            ) : (
              <Link
                className="text-white bg-gray-800 drop-shadow-lg p-2 rounded-full"
                to={item.url}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

