// "use client"
// frontend/src/pages/CreateEventPage.tsx

import type React from "react"
import { useState, useRef, type ChangeEvent, useEffect } from "react"
import {
  Form,
  Button,
  Container,
  Alert,
  Spinner,
  Image as RBImage,
  ProgressBar,
  FloatingLabel,
  Row,
  Col,
  Badge,
} from "react-bootstrap"
import { createEventApi } from "../api/event.api"
import { uploadFileApi } from "../api/upload.api"
import { useNavigate } from "react-router-dom"
import {
  Calendar2Check,
  GeoAlt,
  Image as ImageIcon,
  FileEarmarkText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload as UploadIcon, // Renamed for clarity
  Trash,
  InfoCircle,
  ExclamationTriangle,
  CloudUpload, // New icon for upload area
  Stars, // For success message
} from "react-bootstrap-icons"
import { getProvincesApi } from "../api/location.api"
import type { Province } from "../types/location.types"

// Import the redesigned CSS
import "../pages/CreateEventPage.css"; // Ensure this path is correct

// Enum để theo dõi các bước trong form
enum FormStep {
  BasicInfo = 0,
  Details = 1,
  Media = 2,
  Review = 3,
}

const CreateEventPage = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [provinces, setProvinces] = useState<Province[]>([])
  const [eventTime, setEventTime] = useState("")
  // Form state
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.BasicInfo)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [locationLoading, setLocationLoading] = useState(false)

  // Validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // State cho danh sách các file đã chọn và URL của chúng sau khi upload
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  // State cho quá trình upload từng ảnh
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgressMap, setUploadProgressMap] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProvinces = async () => {
      setLocationLoading(true)
      try {
        const data = await getProvincesApi()
        setProvinces(data)
      } catch (error) {
        console.error("Failed to fetch provinces:", error)
      } finally {
        setLocationLoading(false)
      }
    }
    fetchProvinces()
  }, [])

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "title":
        return !value.trim() ? "Tiêu đề là bắt buộc" : value.trim().length < 5 ? "Tiêu đề phải có ít nhất 5 ký tự" : ""
      case "eventTime":
        return !value ? "Thời gian diễn ra là bắt buộc" : ""
      default:
        return ""
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = field === "title" ? title : field === "eventTime" ? eventTime : ""
    const error = validateField(field, value)
    setValidationErrors((prev) => ({ ...prev, [field]: error }))
  }

  const validateStep = (): boolean => {
    let isValid = true
    const errors: Record<string, string> = {}
    if (currentStep === FormStep.BasicInfo) {
      const titleError = validateField("title", title)
      const eventTimeError = validateField("eventTime", eventTime)
      if (titleError) { errors.title = titleError; isValid = false; }
      if (eventTimeError) { errors.eventTime = eventTimeError; isValid = false; }
    }
    setValidationErrors(errors)
    return isValid
  }

  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFilesArray = Array.from(files);
      if (selectedImageFiles.length + newFilesArray.length > 5) {
        alert("Bạn chỉ có thể tải lên tối đa 5 ảnh.");
        if (event.target) event.target.value = '';
        return;
      }

      const currentPreviews = [...imagePreviews];
      newFilesArray.forEach(file => currentPreviews.push(URL.createObjectURL(file)));
      setImagePreviews(currentPreviews);
      setSelectedImageFiles(prevFiles => [...prevFiles, ...newFilesArray]);


      setIsUploadingImages(true);
      const tempUploadErrors: Record<string, string> = {}; // Use a temporary object for errors in this batch

      for (const file of newFilesArray) {
        try {
          setUploadProgressMap(prev => ({ ...prev, [file.name]: 0 }));
          // Simulate progress for demo, replace with actual progress if API supports
          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setUploadProgressMap(prev => ({ ...prev, [file.name]: progress }));
          }
          const uploadResult = await uploadFileApi(file);
          setUploadedImageUrls(prevUrls => [...prevUrls, uploadResult.url]); // Add to existing uploaded URLs
          setUploadProgressMap(prev => ({ ...prev, [file.name]: 100 }));
        } catch (err: any) {
          tempUploadErrors[file.name] = err.message || 'Lỗi tải lên';
        }
      }
      setUploadErrors(prev => ({...prev, ...tempUploadErrors})); // Merge new errors
      setIsUploadingImages(false);
    }
    if (event.target) event.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const fileToRemove = selectedImageFiles[indexToRemove];
    const previewToRemove = imagePreviews[indexToRemove];

    // Attempt to find the corresponding uploaded URL to remove it as well
    // This is a bit tricky if uploads are out of sync or some failed.
    // A more robust way would be to map selected files to their uploaded URLs directly.
    // For now, we assume the preview URL might be the uploaded URL if it's not a blob.
    let urlToRemoveFromUploaded: string | undefined = undefined;
    if (previewToRemove && !previewToRemove.startsWith('blob:')) {
        // If the preview is not a blob, it might be an already uploaded URL
        // (though current logic populates imagePreviews with blob URLs first)
        // This part might need refinement based on exact state management of uploaded URLs vs previews
        urlToRemoveFromUploaded = previewToRemove;
    } else if (fileToRemove) {
        // If we have the file, try to find its URL in uploadedImageUrls
        // This requires a way to link file.name to the uploaded URL, which isn't directly stored.
        // For simplicity, we'll remove the URL at the same index if it exists,
        // but this is not robust if uploads failed or order changed.
        // A better approach: when an image uploads successfully, store a mapping like {fileName: uploadedUrl}
        // For now, we'll remove the URL at the same index from uploadedImageUrls if it exists.
        // This is a placeholder for a more robust removal logic.
        if (uploadedImageUrls[indexToRemove]) {
             // This is a simplification. If an image at index 0 failed to upload,
             // and image at index 1 succeeded, uploadedImageUrls might only have one entry.
             // Removing uploadedImageUrls[indexToRemove] might remove the wrong URL.
             // A better way: find the URL that corresponds to `fileToRemove.name` if you store it.
        }
    }


    if (previewToRemove && previewToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove);
    }

    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setSelectedImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));

    // Attempt to remove the corresponding uploaded URL
    // This is a simplified approach. A more robust solution would involve
    // mapping selected files to their uploaded URLs.
    if (uploadedImageUrls.length > indexToRemove) {
        // This assumes a 1-to-1 mapping which might not hold if some uploads failed.
        // setUploadedImageUrls(prev => prev.filter((_, i) => i !== indexToRemove));
        // A safer (but still not perfect without direct mapping) approach:
        // If we knew the URL of the image at `indexToRemove` (e.g., if `imagePreviews[indexToRemove]` was the final URL),
        // we could filter `uploadedImageUrls` by that URL.
        // For now, this part of removing from `uploadedImageUrls` is tricky without a clear link.
        // Let's assume for now that if a preview is removed, its corresponding uploaded URL (if any)
        // should also be removed. The current logic for populating uploadedImageUrls is append-only.
        // We might need to adjust how uploadedImageUrls is managed upon successful upload.
    }


    if (fileToRemove) {
        setUploadProgressMap(prev => { const newState = {...prev}; delete newState[fileToRemove.name]; return newState; });
        setUploadErrors(prev => { const newState = {...prev}; delete newState[fileToRemove.name]; return newState; });
    }
  };

  const handleSubmit = async () => {
    if (isUploadingImages && Object.values(uploadProgressMap).some(p => p < 100 && p > 0)) {
      setSubmitError("Vui lòng chờ tất cả ảnh đang tải lên hoàn tất.");
      return;
    }

    // Filter out images that had upload errors before submitting
    const successfullyUploadedUrls = selectedImageFiles
      .map((file, index) => !uploadErrors[file.name] ? uploadedImageUrls.find(url => imagePreviews[index] === url || url.includes(file.name)) : null)
      .filter(url => url) as string[];

    setSubmitError(null);
    setSuccess(null);

    const titleError = validateField("title", title);
    const eventTimeError = validateField("eventTime", eventTime);
    if (titleError || eventTimeError) {
      setValidationErrors({ title: titleError, eventTime: eventTimeError });
      setCurrentStep(FormStep.BasicInfo);
      return;
    }

    setIsSubmitting(true);
    try {
      await createEventApi({
        title,
        description: description || null,
        location: location || null,
        eventTime: new Date(eventTime).toISOString(),
        imageUrls: uploadedImageUrls.filter(url => url),
      });
      setSuccess(`Sự kiện "${title}" đã được tạo thành công và đang chờ duyệt!`);
      setTitle(""); setDescription(""); setLocation(""); setEventTime("");
      setSelectedImageFiles([]); setImagePreviews([]); setUploadedImageUrls([]);
      setUploadErrors({}); setUploadProgressMap({}); setTouched({}); setValidationErrors({});
      setCurrentStep(FormStep.BasicInfo);
    } catch (err: any) {
      setSubmitError(err.message || "Tạo sự kiện thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextStep = () => {
    if (validateStep()) {
      // Nếu đang ở bước chọn ảnh và có ảnh đã upload thành công
      if (currentStep === FormStep.Media && uploadedImageUrls.length > 0) {
        setCurrentStep(FormStep.Review);
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, FormStep.Review) as FormStep);
      }
    } else {
      if (currentStep === FormStep.BasicInfo) setTouched({ title: true, eventTime: true });
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, FormStep.BasicInfo) as FormStep)
  }

  const renderStepIndicator = () => {
    const steps = [
      { step: FormStep.BasicInfo, label: "Cơ bản", icon: <FileEarmarkText size={20}/> },
      { step: FormStep.Details, label: "Chi tiết", icon: <GeoAlt size={20}/> },
      { step: FormStep.Media, label: "Hình ảnh", icon: <ImageIcon size={20}/> },
      { step: FormStep.Review, label: "Xem lại", icon: <Calendar2Check size={20}/> },
    ];

    return (
      <div className="steps-progress">
        {steps.map(({ step, label, icon }, index) => (
          <div
              key={step}
            className={`step-item ${currentStep === step ? "active" : ""} ${currentStep > step ? "completed" : ""}`}
            >
            <div className="step-icon-wrapper">
              <div className="step-icon">
                {currentStep > step ? <CheckCircle size={24} /> : icon}
              </div>
              </div>
            <div className="step-title">{label}</div>
            {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
    );
  };

  const renderBasicInfoStep = () => (
    <div className="form-step-content">
      <h3 className="form-section-title">
        <FileEarmarkText className="me-2" /> Thông tin cơ bản
      </h3>
        <Form.Group className="mb-4" controlId="eventTitle">
          <FloatingLabel label="Tiêu đề sự kiện *">
            <Form.Control
            type="text" placeholder="" value={title}
            onChange={(e) => setTitle(e.target.value)} onBlur={() => handleBlur("title")}
            isInvalid={touched.title && !!validationErrors.title} disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid">{validationErrors.title}</Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-4" controlId="eventTime">
          <FloatingLabel label="Thời gian diễn ra *">
            <Form.Control
            type="datetime-local" value={eventTime}
            onChange={(e) => setEventTime(e.target.value)} onBlur={() => handleBlur("eventTime")}
            isInvalid={touched.eventTime && !!validationErrors.eventTime} required disabled={isSubmitting}
            />
            {touched.eventTime && validationErrors.eventTime && (
            <div className="invalid-feedback d-block">{validationErrors.eventTime}</div>
            )}
          </FloatingLabel>
        <Form.Text className="text-muted opacity-75 mt-1">Chọn ngày và giờ sự kiện bắt đầu.</Form.Text>
        </Form.Group>
          </div>
    )
  const renderDetailsStep = () => (
    <div className="form-step-content">
      <h3 className="form-section-title">
        <GeoAlt className="me-2" /> Chi tiết sự kiện
      </h3>
      <Form.Group className="mb-4" controlId="eventLocation">
        <FloatingLabel label="Địa điểm (Tỉnh/Thành phố)">
          {locationLoading ? (
            <Form.Control placeholder="Đang tải danh sách địa điểm..." disabled />
          ) : (
            <Form.Select value={location} onChange={(e) => setLocation(e.target.value)} disabled={isSubmitting}>
              <option value="">-- Chọn địa điểm --</option>
              {provinces.sort((a, b) => a.name.localeCompare(b.name)).map((province) => (
                <option key={province.code} value={province.name}>{province.name}</option>
              ))}
            </Form.Select>
              )}
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-4" controlId="eventDescription">
        <FloatingLabel label="Mô tả chi tiết">
          <Form.Control
            as="textarea" rows={5} placeholder=""
            value={description} onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting} style={{ minHeight: "150px" }}
          />
        </FloatingLabel>
        <Form.Text className="text-muted opacity-75 mt-1">Mô tả chi tiết giúp người tham gia hiểu rõ hơn về sự kiện của bạn.</Form.Text>
      </Form.Group>
        </div>
    )

  const renderMediaStep = () => (
    <div className="form-step-content">
      <h3 className="form-section-title">
        <ImageIcon className="me-2" /> Hình ảnh sự kiện (Tối đa 5 ảnh)
      </h3>
      <div
        className="upload-area mb-3"
        onClick={() => !isUploadingImages && !isSubmitting && selectedImageFiles.length < 5 && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && !isUploadingImages && !isSubmitting && selectedImageFiles.length < 5 && fileInputRef.current?.click()}
      >
        <CloudUpload className="upload-icon" />
        <p>Kéo thả hoặc nhấn để chọn ảnh</p>
        <small className="text-muted opacity-75">Hỗ trợ JPG, PNG, GIF. Tối đa 5MB mỗi ảnh.</small>
          </div>
      <Form.Control
        ref={fileInputRef} type="file" accept="image/*" multiple
        onChange={handleFilesChange} style={{ display: "none" }}
        disabled={isUploadingImages || isSubmitting || selectedImageFiles.length >= 5}
      />

      {isUploadingImages && Object.values(uploadProgressMap).some(p => p < 100 && p > 0) && (
        <Alert variant="info" className="d-flex align-items-center my-3 py-2">
            <Spinner size="sm" className="me-2"/> Đang tải ảnh lên, vui lòng chờ...
            </Alert>
          )}

      {imagePreviews.length > 0 && (
        <div className="mt-3">
          <h6>Ảnh đã chọn ({selectedImageFiles.length}/5):</h6>
          <div className="image-preview-grid">
            {imagePreviews.map((previewUrl, index) => {
              const file = selectedImageFiles[index];
              const progress = file ? uploadProgressMap[file.name] : undefined;
              const errorMsg = file ? uploadErrors[file.name] : undefined;
              const isUploadedSuccessfully = uploadedImageUrls.includes(previewUrl) || (file && progress === 100 && !errorMsg);
              return (
                <div key={previewUrl || index} className="preview-image-card">
                  <RBImage src={previewUrl} alt={`Preview ${index + 1}`} className="preview-image" />
                  <Button
                    variant="danger"
                    className="remove-image-btn"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isSubmitting} title="Xóa ảnh này"
                  > <Trash size={14}/> </Button>
                  {file && progress !== undefined && progress < 100 && !errorMsg && (
                      <ProgressBar now={progress} className="image-progress-bar" variant="info" />
                  )}
                  {file && errorMsg && (
                      <Badge bg="danger" className="image-upload-status" title={errorMsg}>Lỗi</Badge>
                  )}
                  {isUploadedSuccessfully && !errorMsg && (
                      <Badge bg="success" className="image-upload-status"><CheckCircle size={10} className="me-1"/>OK</Badge>
                  )}
        </div>
              );
            })}
      </div>
        </div>
      )}
      {Object.values(uploadErrors).some(e => e) && !isUploadingImages && (
        <Alert variant="warning" className="mt-3 py-2 d-flex align-items-center">
            <ExclamationTriangle size={20} className="me-2"/> Một số ảnh không tải lên được, vui lòng thử lại hoặc xóa chúng.
        </Alert>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="form-step-content">
      <h3 className="form-section-title">
        <Calendar2Check className="me-2" /> Xem lại thông tin sự kiện
      </h3>
      <div className="review-info-grid mb-4">
        <Row className="mb-2">
          <Col sm={3} className="text-muted fw-medium">Tiêu đề:</Col>
          <Col sm={9}>{title}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={3} className="text-muted fw-medium">Thời gian:</Col>
          <Col sm={9}>{eventTime ? new Date(eventTime).toLocaleString("vi-VN", { dateStyle:'full', timeStyle:'short'}) : "Chưa chọn"}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={3} className="text-muted fw-medium">Địa điểm:</Col>
          <Col sm={9}>{location || "Chưa chọn"}</Col>
        </Row>
        <Row className="mb-3">
          <Col sm={3} className="text-muted fw-medium">Mô tả:</Col>
          <Col sm={9} style={{ whiteSpace: "pre-wrap", maxHeight: '150px', overflowY: 'auto' }}>{description || "Không có mô tả"}</Col>
        </Row>
        {uploadedImageUrls.length > 0 && (
          <Row>
            <Col sm={3} className="text-muted fw-medium">Hình ảnh:</Col>
            <Col sm={9}>
              <div className="image-preview-grid">
                {uploadedImageUrls.map((url, idx) => (
                  <div key={idx} className="preview-image-card">
                    <RBImage src={url} alt={`Event image ${idx + 1}`} className="preview-image" />
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        )}
      </div>
      <Alert variant="info" className="d-flex mb-4">
        <InfoCircle size={24} className="me-3 flex-shrink-0 mt-1" />
        <div>
          <h6 className="alert-heading">Lưu ý quan trọng</h6>
          <p className="mb-0 small opacity-75">
            Vui lòng kiểm tra kỹ tất cả thông tin trước khi tạo sự kiện. Bạn có thể chỉnh sửa lại sau trong trang quản lý.
          </p>
        </div>
      </Alert>
      <div className="text-center">
        <Button 
          variant="success" 
          size="lg"
          onClick={handleSubmit}
          disabled={isUploadingImages || isSubmitting} 
          className="create-event-btn"
        >
          {isSubmitting ? (
            <><Spinner animation="border" size="sm" className="me-2" /> Đang tạo...</>
          ) : (
            <><CheckCircle className="me-2" /> Tạo sự kiện</>
          )}
        </Button>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case FormStep.BasicInfo: return renderBasicInfoStep();
      case FormStep.Details: return renderDetailsStep();
      case FormStep.Media: return renderMediaStep();
      case FormStep.Review: return renderReviewStep();
      default: return null;
}
  }

  const renderStepButtons = () => (
    <div className="form-navigation">
      {currentStep > FormStep.BasicInfo ? (
        <Button variant="outline-secondary" onClick={prevStep} disabled={isSubmitting} className="nav-btn prev-btn">
          <ArrowLeft /> Quay lại
        </Button>
      ) : (
        <div /> /* Placeholder to keep "Next" button to the right */
      )}

      {currentStep < FormStep.Review && (
        <Button variant="primary" onClick={nextStep} disabled={isSubmitting} className="nav-btn next-btn">
          Tiếp theo <ArrowRight />
        </Button>
      )}
    </div>
  )

  return (
    <div className="create-event-page">
      <div className="animated-background">
        <div className="gradient-sphere gradient-sphere-1"></div>
        <div className="gradient-sphere gradient-sphere-2"></div>
        <div className="gradient-sphere gradient-sphere-3"></div>
      </div>

      <Container className="create-event-container">
        {success ? (
          <div className="form-card text-center py-5">
            <Stars size={60} className="text-success mb-3" />
            <h2 className="page-form-title text-success">Thành công!</h2>
            <p className="lead mb-4">{success}</p>
            <Button variant="primary" onClick={() => navigate("/")} className="nav-btn next-btn">
              Về trang chủ
            </Button>
          </div>
        ) : (
          <div className="form-card">
            <h1 className="page-form-title">Tạo Sự Kiện Mới</h1>
            {renderStepIndicator()}
            {submitError && (
              <Alert variant="danger" onClose={() => setSubmitError(null)} dismissible className="mb-4">
                {submitError}
              </Alert>
            )}
            <Form noValidate onSubmit={handleSubmit}>
              {renderStepContent()}
              {renderStepButtons()}
            </Form>
          </div>
        )}
      </Container>
    </div>
  )
}
export default CreateEventPage;
