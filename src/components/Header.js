import React from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';


const Header = () => {
  return (
    <div className="header">
      <h1 style={{marginTop:"10px"}}>Employee Management Library</h1>
      <nav>
        <NavLink activeClassName="active" to="/" exact={true}>
          <Button>Companies list</Button>
        </NavLink>
        {/* <div class="vl"></div> */}
        <NavLink activeClassName="active" to="/list">
          <Button>Employees List</Button>
        </NavLink>
      </nav>
    </div>
  );
};

export default Header;
