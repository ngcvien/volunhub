import React from 'react';
import { Form } from 'react-bootstrap';
import { GeoAlt } from 'react-bootstrap-icons';

interface DetailsStepProps {
  formData: any;
  handleInputChange: (field: string, value: string | number) => void;
  errors: any;
  touched: any;
  provinces: any[];
}

export const DetailsStep: React.FC<DetailsStepProps> = ({
  formData,
  handleInputChange,
  errors,
  touched,
  provinces
}) => {
  return (
    <div className="form-step">
      <Form.Group className="mb-4">
        <Form.Label>Địa điểm</Form.Label>
        <div className="input-with-icon">
          <GeoAlt className="input-icon" />
          <Form.Select
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            isInvalid={touched.location && errors.location}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.name}>
                {province.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.location}
          </Form.Control.Feedback>
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Mô tả sự kiện</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Mô tả chi tiết về sự kiện..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          isInvalid={touched.description && errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Số lượng tình nguyện viên tối đa</Form.Label>
        <Form.Control
          type="number"
          min="1"
          placeholder="Nhập số lượng"
          value={formData.maxParticipants}
          onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
          isInvalid={touched.maxParticipants && errors.maxParticipants}
        />
        <Form.Control.Feedback type="invalid">
          {errors.maxParticipants}
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};