"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent } from "react"
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Spinner,
  Image as RBImage,
  ProgressBar,
  InputGroup,
  FloatingLabel,
} from "react-bootstrap"
import { createEventApi } from "../api/event.api"
import { uploadFileApi } from "../api/upload.api"
import { useNavigate } from "react-router-dom"
import {
  Calendar2Check,
  GeoAlt,
  Image,
  FileEarmarkText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "react-bootstrap-icons"
import { getProvincesApi } from "../api/location.api"
import { useEffect } from "react"
import type { Province } from "../types/location.types"

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Form state
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.BasicInfo)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [locationLoading, setLocationLoading] = useState(false)

  // Validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Fetch provinces for location dropdown
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

  // Simulate upload progress
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isUploading && uploadProgress < 90) {
      interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 5, 90))
      }, 200)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isUploading, uploadProgress])

  // Validate form fields
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "title":
        return !value.trim() ? "Tiêu đề là bắt buộc" : ""
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

    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }))
  }

  const validateStep = (): boolean => {
    let isValid = true
    const errors: Record<string, string> = {}

    if (currentStep === FormStep.BasicInfo) {
      const titleError = validateField("title", title)
      const eventTimeError = validateField("eventTime", eventTime)

      if (titleError) {
        errors.title = titleError
        isValid = false
      }

      if (eventTimeError) {
        errors.eventTime = eventTimeError
        isValid = false
      }
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadedImageUrl(null)
      setUploadError(null)
      setIsUploading(true)
      setUploadProgress(0)

      try {
        const uploadResult = await uploadFileApi(file)
        setUploadedImageUrl(uploadResult.url)
        setUploadProgress(100)
        console.log("Upload thành công:", uploadResult.url)
      } catch (err: any) {
        setUploadError(err.message || "Lỗi tải ảnh lên.")
        setSelectedFile(null)
      } finally {
        setIsUploading(false)
      }
    } else {
      setSelectedFile(null)
      setUploadedImageUrl(null)
      setUploadError(null)
    }

    if (event.target) {
      event.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setSuccess(null)

    // Final validation
    const titleError = validateField("title", title)
    const eventTimeError = validateField("eventTime", eventTime)

    if (titleError || eventTimeError) {
      setValidationErrors({
        title: titleError,
        eventTime: eventTimeError,
      })
      setCurrentStep(FormStep.BasicInfo)
      return
    }

    if (isUploading) {
      setSubmitError("Vui lòng chờ ảnh tải lên hoàn tất.")
      return
    }

    setIsSubmitting(true)
    try {
      await createEventApi({
        title,
        description: description || null,
        location: location || null,
        eventTime: new Date(eventTime),
        imageUrl: uploadedImageUrl,
      })

      setSuccess(`Sự kiện "${title}" đã được tạo thành công!`)

      // Reset form
      setTitle("")
      setDescription("")
      setLocation("")
      setEventTime("")
      setSelectedFile(null)
      setUploadedImageUrl(null)
      setUploadError(null)
      setCurrentStep(FormStep.BasicInfo)

      // Redirect after success
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (err: any) {
      setSubmitError(err.message || "Tạo sự kiện thất bại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => (prev + 1) as FormStep)
    } else {
      // Mark all fields in current step as touched
      if (currentStep === FormStep.BasicInfo) {
        setTouched({ title: true, eventTime: true })
      }
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1) as FormStep)
  }

  const renderStepIndicator = () => {
    return (
      <div className="step-indicator mb-4">
        <div className="d-flex justify-content-between position-relative">
          {/* Progress bar */}
          <div className="progress position-absolute w-100" style={{ height: "2px", top: "15px", zIndex: 1 }}>
            <div className="progress-bar bg-primary" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
          </div>

          {/* Step circles */}
          {[
            { step: FormStep.BasicInfo, label: "Thông tin cơ bản" },
            { step: FormStep.Details, label: "Chi tiết" },
            { step: FormStep.Media, label: "Hình ảnh" },
            { step: FormStep.Review, label: "Xem lại" },
          ].map(({ step, label }) => (
            <div
              key={step}
              className="step-item d-flex flex-column align-items-center position-relative"
              style={{ zIndex: 2 }}
            >
              <div
                className={`step-circle d-flex align-items-center justify-content-center rounded-circle ${
                  currentStep >= step ? "bg-primary text-white" : "bg-light border"
                }`}
                style={{ width: "32px", height: "32px" }}
              >
                {currentStep > step ? <CheckCircle size={16} /> : step + 1}
              </div>
              <div className={`step-label mt-2 small ${currentStep >= step ? "text-primary" : "text-muted"}`}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderBasicInfoStep = () => {
    return (
      <>
        <h5 className="mb-4">Thông tin cơ bản</h5>

        <Form.Group className="mb-4" controlId="eventTitle">
          <FloatingLabel label="Tiêu đề sự kiện *">
            <Form.Control
              type="text"
              placeholder="Nhập tiêu đề sự kiện"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur("title")}
              isInvalid={touched.title && !!validationErrors.title}
              disabled={isSubmitting}
              className="border-0 border-bottom rounded-0 shadow-none"
            />
            <Form.Control.Feedback type="invalid">{validationErrors.title}</Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-4" controlId="eventTime">
          <FloatingLabel label="Thời gian diễn ra *">
            <InputGroup>
              <InputGroup.Text className="bg-transparent border-0 border-bottom rounded-0">
                <Calendar2Check className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="datetime-local"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                onBlur={() => handleBlur("eventTime")}
                isInvalid={touched.eventTime && !!validationErrors.eventTime}
                required
                disabled={isSubmitting}
                className="border-0 border-bottom rounded-0 shadow-none"
              />
            </InputGroup>
            {touched.eventTime && validationErrors.eventTime && (
              <div className="text-danger small mt-1">{validationErrors.eventTime}</div>
            )}
          </FloatingLabel>
          <Form.Text className="text-muted">Chọn ngày và giờ sự kiện bắt đầu</Form.Text>
        </Form.Group>
      </>
    )
  }

  const renderDetailsStep = () => {
    return (
      <>
        <h5 className="mb-4">Chi tiết sự kiện</h5>

        <Form.Group className="mb-4" controlId="eventLocation">
          <FloatingLabel label="Địa điểm">
            <InputGroup>
              <InputGroup.Text className="bg-transparent border-0 border-bottom rounded-0">
                <GeoAlt className="text-primary" />
              </InputGroup.Text>
              {locationLoading ? (
                <Form.Control
                  placeholder="Đang tải danh sách địa điểm..."
                  disabled
                  className="border-0 border-bottom rounded-0 shadow-none"
                />
              ) : (
                <Form.Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                  className="border-0 border-bottom rounded-0 shadow-none"
                >
                  <option value="">-- Chọn địa điểm --</option>
                  {provinces
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((province) => (
                      <option key={province.code} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                </Form.Select>
              )}
            </InputGroup>
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-4" controlId="eventDescription">
          <FloatingLabel label="Mô tả chi tiết">
            <InputGroup>
              <InputGroup.Text className="bg-transparent border-0 border-bottom rounded-0">
                <FileEarmarkText className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Nhập mô tả chi tiết về sự kiện"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="border-0 border-bottom rounded-0 shadow-none"
                style={{ minHeight: "120px" }}
              />
            </InputGroup>
          </FloatingLabel>
          <Form.Text className="text-muted">
            Mô tả chi tiết giúp người tham gia hiểu rõ hơn về sự kiện của bạn
          </Form.Text>
        </Form.Group>
      </>
    )
  }

  const renderMediaStep = () => {
    return (
      <>
        <h5 className="mb-4">Hình ảnh sự kiện</h5>

        <div className="text-center mb-4">
          <div
            className={`image-upload-area position-relative ${uploadedImageUrl ? "has-image" : ""}`}
            style={{
              border: "2px dashed #dee2e6",
              borderRadius: "8px",
              padding: "20px",
              cursor: "pointer",
              backgroundColor: "#f8f9fa",
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadedImageUrl ? (
              <div className="position-relative w-100">
                <RBImage
                  src={uploadedImageUrl}
                  alt="Event preview"
                  fluid
                  className="rounded"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />
                <div
                  className="position-absolute top-0 end-0 m-2 bg-dark bg-opacity-50 rounded-circle p-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    setUploadedImageUrl(null)
                    setSelectedFile(null)
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span className="text-white">×</span>
                </div>
              </div>
            ) : (
              <>
                <Image size={48} className="text-primary mb-3" />
                <p className="mb-1">Nhấp để tải lên hình ảnh sự kiện</p>
                <p className="text-muted small">Hỗ trợ JPG, PNG (tối đa 10MB)</p>
              </>
            )}

            <Form.Control
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading || isSubmitting}
              style={{ display: "none" }}
            />
          </div>

          {isUploading && (
            <div className="mt-3">
              <ProgressBar
                now={uploadProgress}
                label={`${uploadProgress}%`}
                variant="primary"
                animated={uploadProgress < 100}
              />
              <p className="text-muted small mt-2">{uploadProgress < 100 ? "Đang tải lên..." : "Tải lên hoàn tất!"}</p>
            </div>
          )}

          {uploadError && (
            <Alert variant="danger" className="mt-3 py-2">
              {uploadError}
            </Alert>
          )}
        </div>
      </>
    )
  }

  const renderReviewStep = () => {
    return (
      <>
        <h5 className="mb-4">Xem lại thông tin sự kiện</h5>

        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <div className="mb-3">
              <div className="d-flex flex-column flex-md-row">
                <div className="text-md-end text-muted me-md-3 mb-1 mb-md-0" style={{ minWidth: "120px" }}>
                  <strong>Tiêu đề:</strong>
                </div>
                <div className="flex-grow-1">{title}</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex flex-column flex-md-row">
                <div className="text-md-end text-muted me-md-3 mb-1 mb-md-0" style={{ minWidth: "120px" }}>
                  <strong>Thời gian:</strong>
                </div>
                <div className="flex-grow-1">
                  {eventTime ? new Date(eventTime).toLocaleString("vi-VN") : "Chưa chọn"}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex flex-column flex-md-row">
                <div className="text-md-end text-muted me-md-3 mb-1 mb-md-0" style={{ minWidth: "120px" }}>
                  <strong>Địa điểm:</strong>
                </div>
                <div className="flex-grow-1">{location || "Chưa chọn"}</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex flex-column flex-md-row">
                <div className="text-md-end text-muted me-md-3 mb-1 mb-md-0" style={{ minWidth: "120px" }}>
                  <strong>Mô tả:</strong>
                </div>
                <div className="flex-grow-1" style={{ whiteSpace: "pre-wrap" }}>
                  {description || "Không có mô tả"}
                </div>
              </div>
            </div>

            <div>
              <div className="d-flex flex-column flex-md-row">
                <div className="text-md-end text-muted me-md-3 mb-1 mb-md-0" style={{ minWidth: "120px" }}>
                  <strong>Hình ảnh:</strong>
                </div>
                <div className="flex-grow-1">
                  {uploadedImageUrl ? (
                    <RBImage src={uploadedImageUrl} alt="Event preview" thumbnail style={{ maxHeight: "150px" }} />
                  ) : (
                    "Không có hình ảnh"
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Alert variant="info">
          <Alert.Heading as="h6">Lưu ý trước khi tạo sự kiện</Alert.Heading>
          <p className="mb-0 small">
            Vui lòng kiểm tra kỹ thông tin sự kiện trước khi tạo. Sau khi tạo, bạn có thể chỉnh sửa thông tin này trong
            trang quản lý sự kiện.
          </p>
        </Alert>
      </>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case FormStep.BasicInfo:
        return renderBasicInfoStep()
      case FormStep.Details:
        return renderDetailsStep()
      case FormStep.Media:
        return renderMediaStep()
      case FormStep.Review:
        return renderReviewStep()
      default:
        return null
    }
  }

  const renderStepButtons = () => {
    return (
      <div className="d-flex justify-content-between mt-4">
        {currentStep > FormStep.BasicInfo && (
          <Button variant="outline-secondary" onClick={prevStep} disabled={isSubmitting}>
            <ArrowLeft className="me-1" /> Quay lại
          </Button>
        )}

        <div className="ms-auto">
          {currentStep < FormStep.Review ? (
            <Button variant="primary" onClick={nextStep} disabled={isSubmitting}>
              Tiếp theo <ArrowRight className="ms-1" />
            </Button>
          ) : (
            <Button variant="success" type="submit" disabled={isUploading || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="me-2" /> Tạo sự kiện
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: "800px" }}>
          <div className="mb-4 text-center">
            <h2 className="fw-bold">Tạo sự kiện mới</h2>
            <p className="text-muted">Chia sẻ thông tin về sự kiện tình nguyện của bạn</p>
          </div>

          {submitError && (
            <Alert variant="danger" onClose={() => setSubmitError(null)} dismissible>
              {submitError}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="d-flex align-items-center">
              <CheckCircle className="me-2" size={24} />
              <div>
                <Alert.Heading>Tạo sự kiện thành công!</Alert.Heading>
                <p className="mb-0">{success}</p>
                <p className="mb-0 small">Đang chuyển hướng về trang chủ...</p>
              </div>
            </Alert>
          )}

          <Card className="border-0 shadow">
            <Card.Body className="p-4 p-md-5">
              {renderStepIndicator()}

              <Form noValidate onSubmit={handleSubmit}>
                {renderStepContent()}
                {renderStepButtons()}
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default CreateEventPage
