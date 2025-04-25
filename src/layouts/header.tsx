import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Clear auth tokens or any session storage if needed
        localStorage.removeItem('authToken'); // Example if you're using localStorage
        navigate('/');
    };

    return (
        <>
            <header className="app-header sticky" id="header">
                <div className="main-header-container container-fluid">
                    <div className="header-content-left">
                        <div className="header-element">
                            <div className="horizontal-logo">
                                <a href="index.html" className="header-logo">
                                    <img
                                        src="/assets/images/brand-logos/desktop-logo.png"
                                        alt="logo"
                                        className="desktop-logo"
                                    />
                                </a>
                            </div>
                        </div>
                        <div className="header-element mx-lg-0">
                            <a
                                aria-label="Hide Sidebar"
                                className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
                                data-bs-toggle="sidebar"
                                href="javascript:void(0);"
                            >
                                <span></span>
                            </a>
                        </div>
                        <div className="header-element header-search md:!block !hidden my-auto auto-complete-search">
                            <input
                                type="text"
                                className="header-search-bar form-control"
                                id="header-search"
                                placeholder="Search anything here ..."
                            />
                            <a href="javascript:void(0);" className="header-search-icon border-0">
                                <i className="ri-search-line"></i>
                            </a>
                        </div>
                    </div>

                    {/* Sign Out Button */}
                    <div className="header-content-right ms-auto">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
