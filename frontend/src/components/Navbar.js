import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import UserContext from '../context/UserContext';


const Navbar = ({ handleLogout }) => {
    const { currentUser } = useContext(UserContext);

    return (
        <Menu className="NavBar"  size="massive" style={{ background: 'white' }}>
            <Menu.Item as={Link} to="/" name="Marketing Planner" />

            <Menu.Menu position="right">
                {currentUser ? (
                    <>
                        <Menu.Item as={Link} to="/campaigns" name="Campaign List" />
                        <Menu.Item as={Link} to="/campaigns/add" name="Campaign Manager" />
                        <Menu.Item as={Link} to="/" onClick={handleLogout} name={`Logout (${currentUser.user.first_name})`} />
                    </>
                ) : (
                    <>
                        <Menu.Item as={Link} to="/signup" name="Signup" />
                        <Menu.Item as={Link} to="/login" name="Login" />
                    </>
                )}
            </Menu.Menu>
        </Menu>
    );
};

export default Navbar;
