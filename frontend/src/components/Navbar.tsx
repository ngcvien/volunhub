import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { Newspaper } from 'react-feather';

const Navbar: React.FC = () => {
  return (
    <Nav className="me-auto">
      <Nav.Link as={Link} to="/posts">
        <Newspaper className="me-1" />
        Bài viết
      </Nav.Link>
    </Nav>
  );
};

export default Navbar; 