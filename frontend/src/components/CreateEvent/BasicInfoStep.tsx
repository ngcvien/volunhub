import React from 'react';
import { Form } from 'react-bootstrap';
import { Calendar2Event } from 'react-bootstrap-icons';

interface BasicInfoStepProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  errors: any;
  touched: any;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  handleInputChange,
  errors,
  touched
}) => {
  return (
    <div className="form-step">
      <Form.Group className="mb-4">
        <Form.Label>Tên sự kiện</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập tên sự kiện"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          isInvalid={touched.title && errors.title}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Thời gian diễn ra</Form.Label>
        <div className="input-with-icon">
          <Calendar2Event className="input-icon" />
          <Form.Control
            type="datetime-local"
            value={formData.eventTime}
            onChange={(e) => handleInputChange('eventTime', e.target.value)}
            isInvalid={touched.eventTime && errors.eventTime}
          />
          <Form.Control.Feedback type="invalid">
            {errors.eventTime}
          </Form.Control.Feedback>
        </div>
      </Form.Group>
    </div>
  );
};