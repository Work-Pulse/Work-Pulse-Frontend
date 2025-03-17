import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.png';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full text-center border border-gray-200">
            <img 
                    src={logo}
                    alt="Work Schedule" 
                    className="mx-auto w-64 h-auto rounded-lg"
                />

            <h1 className="text-3xl font-extrabold text-[#122D3B] mb-10">Welcome to Work Pulse!</h1>
            
                
            <Link to='/userselection' className="bg-[#122D3B] hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg mt-4 shadow-md transition duration-300 mb-10">
                Get Started
            </Link>
        </div>
    </div>
  )
}

export default Home
