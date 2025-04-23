"use client"

import type React from "react"

import { useState, useEffect, type ChangeEvent } from "react"
import { Form, Button, Spinner, Alert, Row, Col, Image } from "react-bootstrap"
import type { Province } from "../../types/location.types"
import { getProvincesApi } from "../../api/location.api"
import { useAuth } from "../../contexts/AuthContext"
import { updateProfileApi } from "../../api/auth.api"
import { uploadFileApi } from "../../api/upload.api"
import { PencilFill, CloudUploadFill, XCircleFill } from "react-bootstrap-icons"

interface EditProfileFormProps {
  onSaveSuccess?: () => void
  onCancel?: () => void
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onSaveSuccess, onCancel }) => {
  const { user, updateUserContext } = useAuth()

  // State cho form fields
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("")

  // State cho Avatar Upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null)

  // State cho Location Dropdown
  const [provinces, setProvinces] = useState<Province[]>([])
  const [initialLocationSet, setInitialLocationSet] = useState(false)
  const [locationLoading, setLocationLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)

  // State cho submit form
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLocationLoading(true)
      setLocationError(null)
      try {
        const provinceData = await getProvincesApi()
        setProvinces(provinceData)
      } catch (err: any) {
        setLocationError(err.message || "Lỗi tải danh sách tỉnh.")
      } finally {
        setLocationLoading(false)
      }
    }
    fetchProvinces()
  }, [])

  // Set initial form values based on user context
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "")
      setBio(user.bio || "")
      setAvatarPreview(user.avatarUrl || null)

      if (provinces.length > 0 && user.location && !initialLocationSet) {
        const currentProvince = provinces.find((p) => p.name === user.location)
        if (currentProvince) {
          setSelectedProvinceCode(currentProvince.code.toString())
        }
        setInitialLocationSet(true)
      } else if (provinces.length > 0 && !user.location && !initialLocationSet) {
        setInitialLocationSet(true)
      }
    }
  }, [user, provinces, initialLocationSet])

  // Handle Avatar File Selection & Upload
  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setAvatarFile(file || null)
    setAvatarUploadError(null)
    setSubmitError(null)
    setSubmitSuccess(null)

    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)

      setIsUploadingAvatar(true)
      try {
        const uploadResult = await uploadFileApi(file)
        setAvatarPreview(uploadResult.url)
        console.log("Avatar uploaded:", uploadResult.url)
      } catch (err: any) {
        setAvatarUploadError(err.message || "Lỗi tải ảnh đại diện.")
        setAvatarPreview(user?.avatarUrl || null)
        setAvatarFile(null)
      } finally {
        setIsUploadingAvatar(false)
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
      }
    } else {
      setAvatarPreview(user?.avatarUrl || null)
    }
    event.target.value = ""
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    if (isUploadingAvatar) {
      setSubmitError("Vui lòng chờ ảnh đại diện tải lên xong.")
      setIsSubmitting(false)
      return
    }

    const selectedProvince = provinces.find((p) => p.code.toString() === selectedProvinceCode)
    const locationNameToSend = selectedProvince ? selectedProvince.name : null

    const updateData = {
      fullName: fullName || null,
      bio: bio || null,
      location: locationNameToSend,
      avatarUrl: avatarPreview || null,
    }

    try {
      const response = await updateProfileApi(updateData)
      setSubmitSuccess("Cập nhật hồ sơ thành công!")
      updateUserContext(response.user)
      setAvatarFile(null)
      onSaveSuccess?.()
      setTimeout(() => setSubmitSuccess(null), 3000)
    } catch (err: any) {
      setSubmitError(err.message || "Cập nhật thất bại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit} noValidate className="edit-profile-form">
      {submitError && (
        <Alert variant="danger" onClose={() => setSubmitError(null)} dismissible>
          {submitError}
        </Alert>
      )}
      {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}

      <Row>
        <Col md={4} className="mb-4">
          {/* Upload Avatar */}
          <div className="avatar-upload-container text-center">
            <div className="avatar-preview position-relative mx-auto mb-3">
              <Image
                src={avatarPreview || "/default-avatar.png"}
                roundedCircle
                className="avatar-image"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                alt="Avatar preview"
              />

              <div
                className="avatar-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("avatar-input")?.click()}
              >
                <PencilFill color="white" size={24} />
              </div>
            </div>

            <Form.Control
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar || isSubmitting}
              style={{ display: "none" }}
            />

            <Button
              variant="outline-primary"
              size="sm"
              className="d-flex align-items-center mx-auto mb-2"
              onClick={() => document.getElementById("avatar-input")?.click()}
              disabled={isUploadingAvatar}
            >
              <CloudUploadFill className="me-2" />
              Thay đổi ảnh đại diện
            </Button>

            {isUploadingAvatar && (
              <div className="text-center mt-2">
                <Spinner size="sm" animation="border" /> Đang tải ảnh...
              </div>
            )}

            {avatarUploadError && (
              <Alert variant="danger" size="sm" className="mt-2 py-1">
                {avatarUploadError}
              </Alert>
            )}

            {avatarPreview && !isUploadingAvatar && (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setAvatarPreview(null)
                  setAvatarFile(null)
                }}
                className="text-danger"
              >
                <XCircleFill className="me-1" /> Xóa ảnh
              </Button>
            )}
          </div>
        </Col>

        <Col md={8}>
          {/* Form Fields */}
          <div className="form-fields">
            {/* Tên đầy đủ */}
            <Form.Group className="mb-3" controlId="profileFullName">
              <Form.Label>Tên đầy đủ</Form.Label>
              <Form.Control
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Nhập tên đầy đủ của bạn"
              />
            </Form.Group>

            {/* Tiểu sử */}
            <Form.Group className="mb-3" controlId="profileBio">
              <Form.Label>Tiểu sử</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isSubmitting}
                placeholder="Giới thiệu về bản thân (sở thích, kỹ năng, kinh nghiệm...)"
              />
              <Form.Text className="text-muted">
                Tiểu sử giúp mọi người hiểu thêm về bạn và các hoạt động tình nguyện bạn quan tâm.
              </Form.Text>
            </Form.Group>

            {/* Tỉnh/Thành phố */}
            <Form.Group className="mb-3" controlId="profileLocation">
              <Form.Label>Tỉnh/Thành phố</Form.Label>
              {locationLoading && <Spinner animation="border" size="sm" className="ms-2" />}
              {locationError && (
                <Alert variant="danger" size="sm" className="py-1">
                  {locationError}
                </Alert>
              )}
              {!locationLoading && !locationError && (
                <>
                  <Form.Select
                    value={selectedProvinceCode}
                    onChange={(e) => setSelectedProvinceCode(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">-- Chọn tỉnh/thành phố --</option>
                    {provinces
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Địa điểm giúp bạn tìm thấy các sự kiện tình nguyện gần bạn.
                  </Form.Text>
                </>
              )}
            </Form.Group>
          </div>
        </Col>
      </Row>

      {/* Nút bấm */}
      <div className="d-flex justify-content-end mt-4">
        <Button variant="outline-secondary" onClick={onCancel} className="me-2" disabled={isSubmitting}>
          Hủy
        </Button>
        <Button variant="primary" type="submit" disabled={isUploadingAvatar || isSubmitting} className="px-4">
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" /> Đang lưu...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </div>
    </Form>
  )
}

export default EditProfileForm
