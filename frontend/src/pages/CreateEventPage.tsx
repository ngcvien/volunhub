// frontend/src/pages/CreateEventPage.tsx
import React, { useState } from 'react';
// Sửa dòng này:
import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Image as RBImage } from 'react-bootstrap'; // <<<--- Đổi tên Image thành RBImage ở đâyimport { useNavigate } from 'react-router-dom';
import { createEventApi } from '../api/event.api';
import { uploadFileApi } from '../api/upload.api'; 
import { useNavigate } from 'react-router-dom'; // <<<--- THÊM DÒNG NÀY

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [eventTime, setEventTime] = useState(''); 
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // File người dùng chọn
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); // URL trả về từ Cloudinary
    const [isUploading, setIsUploading] = useState(false); // Trạng thái đang upload ảnh
    const [uploadError, setUploadError] = useState<string | null>(null); // Lỗi upload ảnh
    

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Lấy file đầu tiên
        if (file) {
            setSelectedFile(file);
            setUploadedImageUrl(null); // Reset ảnh cũ (nếu có)
            setUploadError(null); // Reset lỗi cũ
            setIsUploading(true); // Bắt đầu loading upload

            try {
                const uploadResult = await uploadFileApi(file); // Gọi API upload
                setUploadedImageUrl(uploadResult.url); // Lưu URL trả về
                console.log('Upload thành công:', uploadResult.url);
            } catch (err: any) {
                setUploadError(err.message || 'Lỗi tải ảnh lên.');
                setSelectedFile(null); // Bỏ chọn file nếu lỗi
            } finally {
                setIsUploading(false); // Kết thúc loading upload
            }
        } else {
             // Trường hợp người dùng bấm cancel trong cửa sổ chọn file
             setSelectedFile(null);
             setUploadedImageUrl(null);
             setUploadError(null);
        }
         // Reset giá trị của input file để có thể chọn lại cùng file nếu muốn
        event.target.value = '';
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);
        setSuccess(null);

        if (!title || !eventTime) {
            setSubmitError('Tiêu đề và Thời gian sự kiện là bắt buộc.');
            return;
        }

        let formattedEventTime: Date;
        try {
            formattedEventTime = new Date(eventTime);
            if (isNaN(formattedEventTime.getTime())) throw new Error('Invalid Date');
        } catch (dateError) {
            setSubmitError('Định dạng Thời gian sự kiện không hợp lệ.');
            return;
        }

        // Nếu đang upload ảnh thì không cho submit form
        if (isUploading) {
            setSubmitError('Vui lòng chờ ảnh tải lên hoàn tất.');
            return;
        }

        setIsSubmitting(true); // Bắt đầu loading submit form
        try {
            await createEventApi({
                title,
                description: description || null,
                location: location || null,
                eventTime: formattedEventTime,
                imageUrl: uploadedImageUrl // <<<--- GỬI URL ẢNH ĐÃ UPLOAD
            });
            setSuccess(`Sự kiện "${title}" đã được tạo thành công!`);
            // Reset form
            setTitle('');
            setDescription('');
            setLocation('');
            setEventTime('');
            setSelectedFile(null);
            setUploadedImageUrl(null);
            setUploadError(null);

            setTimeout(() => setSuccess(null), 4000); // Ẩn thông báo thành công sau 4s
            // navigate('/'); // Có thể điều hướng về trang chủ

        } catch (err: any) {
            setSubmitError(err.message || 'Tạo sự kiện thất bại.');
        } finally {
            setIsSubmitting(false); // Kết thúc loading submit form
        }
    };


    return (
        <Container className="mt-4 mb-5">
             <Row className="justify-content-md-center">
                <Col xs={12} md={12} lg={12}>
                    <Card className="shadow-sm border-0">
                         <Card.Header as="h3" className="text-center p-3">Tạo Sự Kiện Mới</Card.Header>
                        <Card.Body className="p-4 p-md-5">
                            {/* Đổi tên error -> submitError */}
                            {submitError && <Alert variant="danger" onClose={() => setSubmitError(null)} dismissible>{submitError}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form noValidate onSubmit={handleSubmit}>
                                {/* ... các Form.Group cho title, description, location, eventTime ... */}
                                 <Form.Group className="mb-3" controlId="eventTitle">
                                    
                                 <Form.Label>Tiêu đề sự kiện <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tiêu đề sự kiện"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        disabled={isUploading}
                                    />                               
                                 </Form.Group>
                                 <Form.Group className="mb-3" controlId="eventDescription">
                                 <Form.Label>Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Nhập mô tả chi tiết về sự kiện"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isUploading}
                                    />

                                 </Form.Group>
                                 <Form.Group className="mb-3" controlId="eventLocation"> 
                                 <Form.Label>Địa điểm</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập địa điểm diễn ra sự kiện"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        disabled={isUploading}
                                    />
                                 </Form.Group>
                                 <Form.Group className="mb-3" controlId="eventTime"> 
                                 <Form.Label>Thời gian diễn ra <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="datetime-local" // Input chuẩn cho ngày giờ
                                        value={eventTime}
                                        onChange={(e) => setEventTime(e.target.value)}
                                        required
                                        disabled={isUploading}
                                    />
                                     <Form.Text muted>
                                        Chọn ngày và giờ sự kiện bắt đầu.
                                    </Form.Text>

                                 </Form.Group>

                                {/* --- THÊM INPUT UPLOAD ẢNH --- */}
                                <Form.Group controlId="eventImage" className="mb-3">
                                    <Form.Label>Ảnh sự kiện</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*" // Chỉ chấp nhận file ảnh
                                        onChange={handleFileChange}
                                        disabled={isUploading || isSubmitting} // Disable khi đang upload hoặc submit
                                    />
                                     {/* Hiển thị trạng thái upload */}
                                     {isUploading && <div className="mt-2"><Spinner size="sm" animation="border" className="me-2" /> Đang tải ảnh lên...</div>}
                                     {uploadError && <Alert variant="danger" size="sm" className="mt-2 py-1">{uploadError}</Alert>}
                                     {/* Hiển thị ảnh preview */}
                                     {uploadedImageUrl && !uploadError && (
                                         <div className="mt-3 text-center">
                                             <p className="mb-1">Ảnh đã tải lên:</p>
                                             <RBImage src={uploadedImageUrl} alt="Event preview" thumbnail fluid style={{ maxHeight: '200px' }} />
                                         </div>
                                     )}
                                     <Form.Text muted>
                                         Chọn ảnh đại diện cho sự kiện của bạn (tối đa 10MB).
                                     </Form.Text>
                                </Form.Group>
                                {/* --- KẾT THÚC INPUT UPLOAD --- */}

                                <div className="text-center mt-4">
                                    <Button variant="primary" type="submit" disabled={isUploading || isSubmitting} size="lg">
                                        {(isUploading || isSubmitting) ? (
                                            <>
                                                <Spinner size="sm" animation="border" className="me-2" /> Đang xử lý...
                                            </>
                                        ) : 'Tạo Sự Kiện'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateEventPage;