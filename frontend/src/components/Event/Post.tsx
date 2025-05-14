"use client"

import type React from "react"
import { useState } from "react"
import { Image, Modal, Carousel } from "react-bootstrap"
import "./Post.css"

interface PostProps {
  images: string[]
}

const Post: React.FC<PostProps> = ({ images }) => {
  const [showModal, setShowModal] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return null
  }

  const handleImageClick = (index: number) => {
    setActiveIndex(index)
    setShowModal(true)
  }

  const renderImageGrid = () => {
    const imageCount = images.length

    if (imageCount === 1) {
      return (
        <div className="single-image-container">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt="Post image"
            fluid
            className="post-image"
            onClick={() => handleImageClick(0)}
          />
        </div>
      )
    }

    if (imageCount === 2) {
      return (
        <div className="two-image-grid">
          {images.map((img, index) => (
            <div key={index} className="grid-item">
              <Image
                src={img || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                fluid
                className="post-image"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
        </div>
      )
    }

    if (imageCount === 3) {
      return (
        <div className="three-image-grid">
          <div className="main-image">
            <Image
              src={images[0] || "/placeholder.svg"}
              alt="Post image 1"
              fluid
              className="post-image"
              onClick={() => handleImageClick(0)}
            />
          </div>
          <div className="side-images">
            <div className="grid-item">
              <Image
                src={images[1] || "/placeholder.svg"}
                alt="Post image 2"
                fluid
                className="post-image"
                onClick={() => handleImageClick(1)}
              />
            </div>
            <div className="grid-item">
              <Image
                src={images[2] || "/placeholder.svg"}
                alt="Post image 3"
                fluid
                className="post-image"
                onClick={() => handleImageClick(2)}
              />
            </div>
          </div>
        </div>
      )
    }

    // 4 or more images
    return (
      <div className="four-image-grid">
        {images.slice(0, 4).map((img, index) => (
          <div key={index} className="grid-item">
            <Image
              src={img || "/placeholder.svg"}
              alt={`Post image ${index + 1}`}
              fluid
              className="post-image"
              onClick={() => handleImageClick(index)}
            />
            {index === 3 && imageCount > 4 && (
              <div className="more-images-overlay" onClick={() => handleImageClick(3)}>
                <span>+{imageCount - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="post-images-container">{renderImageGrid()}</div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="image-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {activeIndex + 1}/{images.length}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel
            activeIndex={activeIndex}
            onSelect={(index) => setActiveIndex(index)}
            interval={null}
            indicators={images.length > 1}
            controls={images.length > 1}
          >
            {images.map((img, index) => (
              <Carousel.Item key={index}>
                <div className="carousel-image-container">
                  <img src={img || "/placeholder.svg"} alt={`Slide ${index + 1}`} className="carousel-image" />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Post
