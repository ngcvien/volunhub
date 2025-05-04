import React, { useState } from 'react';
import { Nav, Card, Badge, Button, Offcanvas } from 'react-bootstrap';
import { 
  Calendar2Event, 
  GeoAlt, 
  Tags, 
  BookmarkHeart,
  PeopleFill,
  StarFill,
  List
} from 'react-bootstrap-icons';
import { User } from '../../types/user.types';
import './LeftSidebar.css';

interface LeftSidebarProps {
  currentUser: User | null;
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentUser,
  onFilterChange,
  currentFilters
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const categories = [
    { id: 'all', name: 'Tất cả', icon: Calendar2Event, count: 150 },
    { id: 'education', name: 'Giáo dục', icon: PeopleFill, count: 45 },
    { id: 'environment', name: 'Môi trường', icon: GeoAlt, count: 32 },
    { id: 'health', name: 'Sức khỏe', icon: StarFill, count: 28 },
    { id: 'community', name: 'Cộng đồng', icon: Tags, count: 55 },
    { id: 'saved', name: 'Đã lưu', icon: BookmarkHeart, count: 12 },
  ];

  const handleCategoryClick = (categoryId: string) => {
    onFilterChange({ ...currentFilters, category: categoryId });
    setShowMobileMenu(false); // Close mobile menu after selection
  };

  const SidebarContent = () => (
    <>
      <Card className="sidebar-card">
        <Card.Body>
          <h6 className="sidebar-title">Danh mục</h6>
          <Nav className="flex-column ">
            {categories.map(category => (
              <Nav.Link
                key={category.id}
                className={`sidebar-link ${currentFilters.category === category.id ? 'active' : ''}` }
                
                onClick={() => handleCategoryClick(category.id)}
              >
                <category.icon className="sidebar-icon" />
                <span className="sidebar-text ">{category.name}</span>
                <Badge bg="light" text="dark" className="ms-auto" >
                  {category.count}
                </Badge>
              </Nav.Link>
            ))}
          </Nav>
        </Card.Body>
      </Card>

      {currentUser && (
        <Card className="sidebar-card mt-3">
          <Card.Body>
            <h6 className="sidebar-title">Hoạt động của bạn</h6>
            <Nav className="flex-column">
              <Nav.Link className="sidebar-link">
                <Calendar2Event className="sidebar-icon" />
                <span className="sidebar-text">Sự kiện đã tham gia</span>
                <Badge bg="primary" className="ms-auto">8</Badge>
              </Nav.Link>
              <Nav.Link className="sidebar-link">
                <StarFill className="sidebar-icon" />
                <span className="sidebar-text">Đã hoàn thành</span>
                <Badge bg="success" className="ms-auto">5</Badge>
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="primary"
        className="d-lg-none mobile-sidebar-toggle"
        onClick={() => setShowMobileMenu(true)}
      >
        <List size={20} className="me-2" />
        Danh mục
      </Button>

      {/* Desktop Sidebar */}
      <div className="left-sidebar d-none d-lg-block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="start"
        className="mobile-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Danh mục</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default LeftSidebar;