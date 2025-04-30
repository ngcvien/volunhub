import React from 'react';
import { ButtonGroup, Button, Form, InputGroup } from 'react-bootstrap';
import { 
  Grid3x3, 
  List, 
  Search, 
  SortDown 
} from 'react-bootstrap-icons';
import './EventFilterBar.css';

interface EventFilterBarProps {
  viewMode: 'card' | 'list';
  onViewModeChange: (mode: 'card' | 'list') => void;
  filters: any;
  onFilterChange: (filters: any) => void;
}

const EventFilterBar: React.FC<EventFilterBarProps> = ({
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange
}) => {
  return (
    <div className="event-filter-bar">
      <div className="filter-section">
        <InputGroup>
          <InputGroup.Text>
            <Search />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm kiếm sự kiện..."
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </InputGroup>
      </div>

      <div className="filter-section">
        <Form.Select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="sort-select"
        >
          <option value="latest">Mới nhất</option>
          <option value="popular">Phổ biến nhất</option>
          <option value="upcoming">Sắp diễn ra</option>
        </Form.Select>

        <ButtonGroup className="ms-2">
          <Button
            variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
            onClick={() => onViewModeChange('card')}
          >
            <Grid3x3 />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            onClick={() => onViewModeChange('list')}
          >
            <List />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default EventFilterBar;