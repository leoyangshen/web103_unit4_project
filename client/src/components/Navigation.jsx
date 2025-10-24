import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <header>
            {/* Using the standard Picocss container-fluid class for full width navigation */}
            <nav className="container-fluid">
                <ul>
                    {/* Brand Link: Home Page */}
                    <li>
                        <Link to="/" className="brand">
                            <strong>⚡ Bolt Bucket Designer</strong>
                        </Link>
                    </li> 
                </ul>
                <ul>
                    {/* Link to the Custom Cars List (/customcars) */}
                    <li>
                        <Link to="/customcars" className="contrast">
                            My Saved Configurations
                        </Link>
                    </li>
                </ul>
                
                {/* User Info / Status Area */}
                <div className="user-info">
                    {/* This area can be used for PostgreSQL user status if authentication is implemented later */}
                </div>
            </nav>
        </header>
    );
};

export default Navigation;

