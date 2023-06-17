import Navbar from "../components/navbar";
import navbarItems from "./navbarItems";

const employees = [
  {
    name: "John Doe",
    username: "johndoe",
    position: "Founder",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "Jane Smith",
    username: "janesmith",
    position: "Co-Founder",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "Mike Johnson",
    username: "mikejohnson",
    position: "CEO",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "Sarah Brown",
    username: "sarahbrown",
    position: "CTO",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const JobDetails = () => {
  return (
    <div className="text-center text-gray-200 bg-gray-900 rounded drop-shadow-lg py-5 mb-2">
      <h2 className="text-2xl font-bold mb-4">Foreman Engineering Produksi</h2>
      <p className="mb-2">Berakhir pada: 31 Agustus 2023</p>
      
      <JobRequirements />
    </div>
  );
};

const AboutUs = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">About Us</h2>
      <div className="grid grid-cols-2 gap-4 rounded drop-shadow-lg">
        {employees.map((employee) => (
          <div key={employee.username} className="p-4 bg-gray-100 rounded">
            <h3 className="text-lg font-bold">{employee.name}</h3>
            <hr />
            <hr />
            <hr />
            <p className="text-gray-600">{employee.position}</p>
            <p className="mt-2">{employee.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const JobRequirements = () => {
  return (
    <div className="mt-2 flex justify-center">
      <ul className="text-left">
      <h3 className="text-lg text-center font-bold mb-2">Persyaratan:</h3>
        <li>Penuh Waktu</li>
        <li>- Umur: 23-30 tahun</li>
        <li>- Laki-laki</li>
        <li>- S1</li>
        <li>- Jurusan: Electrical</li>
        <li>- 1 tahun sebagai teknisi/maintenance</li>
      </ul>
    </div>
  );
};

const HomePage = () => {
  return (
    <>
    <div className="container mx-auto py-3">
      <JobDetails />
        <AboutUs />  
    </div>
    <Navbar navbarItems={navbarItems} />
    </>
  );
};

export default HomePage;
