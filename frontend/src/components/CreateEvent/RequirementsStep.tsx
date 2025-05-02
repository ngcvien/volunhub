import React from 'react';
import { Form } from 'react-bootstrap';

interface RequirementsStepProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  errors: any;
  touched: any;
}

export const RequirementsStep: React.FC<RequirementsStepProps> = ({
  formData,
  handleInputChange,
  errors,
  touched
}) => {
  return (
    <div className="form-step">
      <Form.Group className="mb-4">
        <Form.Label>Yêu cầu đối với tình nguyện viên</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Các yêu cầu cụ thể..."
          value={formData.requirements}
          onChange={(e) => handleInputChange('requirements', e.target.value)}
          isInvalid={touched.requirements && errors.requirements}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requirements}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Thông tin liên hệ</Form.Label>
        <Form.Control
          type="text"
          placeholder="Số điện thoại, email..."
          value={formData.contactInfo}
          onChange={(e) => handleInputChange('contactInfo', e.target.value)}
          isInvalid={touched.contactInfo && errors.contactInfo}
        />
        <Form.Control.Feedback type="invalid">
          {errors.contactInfo}
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};