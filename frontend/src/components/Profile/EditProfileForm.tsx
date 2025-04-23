// frontend/src/components/Profile/EditProfileForm.tsx (Giả sử bạn tạo component riêng)
// Hoặc đặt code này trực tiếp trong ProfilePage.tsx nếu muốn

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Form, Button, Spinner, Alert, Image as RBImage } from 'react-bootstrap'; // Thêm RBImage
import { Province } from '../../types/location.types';
import { getProvincesApi } from '../../api/location.api';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfileApi } from '../../api/auth.api'; // Đảm bảo đường dẫn đúng
import { uploadFileApi } from '../../api/upload.api'; // Import hàm upload

interface EditProfileFormProps {
    onSaveSuccess?: () => void; // Callback khi lưu thành công
    onCancel?: () => void;      // Callback khi nhấn nút Hủy
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onSaveSuccess, onCancel }) => {
    const { user, updateUserContext } = useAuth(); // Lấy user và hàm updateUserContext mới

    // State cho form fields
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('');

    // State cho Avatar Upload
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null); // Preview URL
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);

    // State cho Location Dropdown
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [initialLocationSet, setInitialLocationSet] = useState(false);
    const [locationLoading, setLocationLoading] = useState(true);
    const [locationError, setLocationError] = useState<string | null>(null);

    // State cho submit form
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    // Fetch provinces
    useEffect(() => {
        // ... (code fetchProvinces giữ nguyên) ...
         const fetchProvinces = async () => {
             setLocationLoading(true);setLocationError(null);
             try {
                 const provinceData = await getProvincesApi(); setProvinces(provinceData);
             } catch (err: any) { setLocationError(err.message || 'Lỗi tải danh sách tỉnh.');
             } finally { setLocationLoading(false); }
         };
         fetchProvinces();
    }, []);

    // Set initial form values based on user context
     useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setBio(user.bio || '');
            setAvatarPreview(user.avatarUrl || null); // Cập nhật preview ban đầu
            // Logic set initial province code dựa trên user.location (tên tỉnh)
            if (provinces.length > 0 && user.location && !initialLocationSet) {
                const currentProvince = provinces.find(p => p.name === user.location);
                if (currentProvince) {
                    setSelectedProvinceCode(currentProvince.code.toString());
                }
                setInitialLocationSet(true);
            } else if (provinces.length > 0 && !user.location && !initialLocationSet) {
                setInitialLocationSet(true);
            }
        }
    }, [user, provinces, initialLocationSet]);


    // Handle Avatar File Selection & Upload
    const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setAvatarFile(file || null); // Lưu file đã chọn
        setAvatarUploadError(null);
        setSubmitError(null); // Xóa lỗi submit cũ
        setSubmitSuccess(null);

        if (file) {
            // Tạo preview tạm thời bằng URL object
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl); // Hiển thị ảnh mới chọn ngay lập tức

            // Tự động upload khi chọn file
            setIsUploadingAvatar(true);
            try {
                const uploadResult = await uploadFileApi(file);
                setAvatarPreview(uploadResult.url); // Cập nhật preview bằng URL Cloudinary
                 // Không cần state avatarUrl riêng nữa, sẽ lấy từ avatarPreview khi submit
                console.log('Avatar uploaded:', uploadResult.url);
            } catch (err: any) {
                setAvatarUploadError(err.message || 'Lỗi tải ảnh đại diện.');
                setAvatarPreview(user?.avatarUrl || null); // Quay lại ảnh cũ nếu lỗi
                setAvatarFile(null); // Bỏ chọn file
            } finally {
                setIsUploadingAvatar(false);
                 // Thu hồi URL object sau khi dùng để tránh memory leak (sau khi upload xong hoặc lỗi)
                if (previewUrl) {
                     URL.revokeObjectURL(previewUrl);
                }
            }
        } else {
            // Nếu người dùng hủy chọn file, quay lại avatar cũ
            setAvatarPreview(user?.avatarUrl || null);
        }
         event.target.value = ''; // Reset input file
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        if (isUploadingAvatar) {
            setSubmitError('Vui lòng chờ ảnh đại diện tải lên xong.');
            setIsSubmitting(false);
            return;
        }

        const selectedProvince = provinces.find(p => p.code.toString() === selectedProvinceCode);
        const locationNameToSend = selectedProvince ? selectedProvince.name : null;

        const updateData = {
            // Thêm username nếu cho phép sửa
            fullName: fullName || null,
            bio: bio || null,
            location: locationNameToSend,
            // Gửi URL avatar từ state preview (đã được cập nhật sau khi upload thành công)
            avatarUrl: avatarPreview || null,
        };

        try {
            const response = await updateProfileApi(updateData);
            setSubmitSuccess('Cập nhật hồ sơ thành công!');
            // Cập nhật context với dữ liệu user mới nhất từ response
            updateUserContext(response.user);
            setAvatarFile(null); // Reset file đã chọn
            onSaveSuccess?.(); // Gọi callback báo thành công (để ProfilePage đóng form)
            setTimeout(() => setSubmitSuccess(null), 3000);
        } catch (err: any) {
            setSubmitError(err.message || 'Cập nhật thất bại.');
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- PHẦN JSX CỦA FORM ---
     return (
        <Form onSubmit={handleSubmit} noValidate >
            {/* Thông báo lỗi/thành công chung */}
            {submitError && <Alert variant="danger" onClose={() => setSubmitError(null)} dismissible>{submitError}</Alert>}
            {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}

            {/* Upload Avatar */}
            <Form.Group className="mb-3 text-center" controlId="profileAvatar">
                <Form.Label>Ảnh đại diện</Form.Label>
                <div>
                    <RBImage
                        src={avatarPreview || '/default-avatar.png'} // Dùng preview hoặc ảnh mặc định
                        roundedCircle
                        thumbnail
                        style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer', marginBottom: '10px' }}
                        onClick={() => document.getElementById('avatar-input')?.click()} // Click vào ảnh để mở chọn file
                    />
                </div>
                <Form.Control
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isUploadingAvatar || isSubmitting}
                    style={{ display: 'none' }} // Ẩn input gốc
                />
                {isUploadingAvatar && <div className="mt-2"><Spinner size="sm" animation="border" /> Đang tải ảnh...</div>}
                {avatarUploadError && <Alert variant="danger" size="sm" className="mt-2 py-1">{avatarUploadError}</Alert>}
                 {/* Nút xóa ảnh (tùy chọn) */}
                 {avatarPreview && !isUploadingAvatar && <Button variant="link" size="sm" onClick={() => {setAvatarPreview(null); setAvatarFile(null);}} className="text-danger">Xóa ảnh</Button>}
            </Form.Group>

            {/* Tên đầy đủ */}
            <Form.Group className="mb-3" controlId="profileFullName">
                <Form.Label>Tên đầy đủ</Form.Label>
                <Form.Control type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isSubmitting} />
            </Form.Group>

            {/* Tiểu sử */}
            <Form.Group className="mb-3" controlId="profileBio">
                <Form.Label>Tiểu sử</Form.Label>
                <Form.Control as="textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} disabled={isSubmitting} />
            </Form.Group>

            {/* Tỉnh/Thành phố */}
            <Form.Group className="mb-3" controlId="profileLocation">
                <Form.Label>Tỉnh/Thành phố</Form.Label>
                {locationLoading && <Spinner animation="border" size="sm" />}
                {locationError && <Alert variant="danger" size="sm" className="py-1">{locationError}</Alert>}
                {!locationLoading && !locationError && (
                    <Form.Select value={selectedProvinceCode} onChange={(e) => setSelectedProvinceCode(e.target.value)} disabled={isSubmitting}>
                        <option value="">-- Chọn tỉnh/thành phố --</option>
                        {provinces.sort((a, b) => a.name.localeCompare(b.name)).map((province) => (
                            <option key={province.code} value={province.code}>{province.name}</option>
                        ))}
                    </Form.Select>
                )}
            </Form.Group>

            {/* Nút bấm */}
            <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={onCancel} className="me-2" disabled={isSubmitting}>
                    Hủy
                </Button>
                <Button variant="primary" type="submit" disabled={isUploadingAvatar || isSubmitting}>
                    {isSubmitting ? <Spinner animation="border" size="sm"/> : 'Lưu thay đổi'}
                </Button>
            </div>
        </Form>
    );
};

export default EditProfileForm;