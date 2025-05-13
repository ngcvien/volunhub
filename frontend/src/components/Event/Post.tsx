import React from "react";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface ImageGridProps {
    images: string[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
    if (!images || images.length === 0) return null;

    const renderGrid = () => {
        const count = images.length;
        if (count === 1) {
            return (
                <div className="image-grid image-grid-1">
                    <PhotoView src={images[0]}>
                        <img src={images[0]} alt="post-img-1" style={{ width: "100%", maxHeight: 600, objectFit: "cover", borderRadius: 8 }} />
                    </PhotoView>
                </div>
            );
        }
        if (count === 2) {
            return (
                <div className="image-grid image-grid-2" style={{ display: "flex", gap: 4 }}>
                    {images.map((img, idx) => (
                        <PhotoView key={idx} src={img}>
                            <img src={img} alt={`post-img-${idx}`} style={{ width: "50%", height: 250, objectFit: "cover", borderRadius: 8 }} />
                        </PhotoView>
                    ))}
                </div>
            );
        }
        if (count === 3) {
            return (
                <div className="image-grid image-grid-3" style={{ display: "flex", gap: 4 }}>
                    <div style={{ width: "66%", marginRight: 4 }}>
                        <PhotoView src={images[0]}>
                            <img src={images[0]} alt="post-img-0" style={{ width: "100%", height: 250, objectFit: "cover", borderRadius: 8 }} />
                        </PhotoView>
                    </div>
                    <div style={{ width: "34%", display: "flex", flexDirection: "column", gap: 4 }}>
                        <PhotoView src={images[1]}>
                            <img src={images[1]} alt="post-img-1" style={{ width: "100%", height: 122, objectFit: "cover", borderRadius: 8 }} />
                        </PhotoView>
                        <PhotoView src={images[2]}>
                            <img src={images[2]} alt="post-img-2" style={{ width: "100%", height: 122, objectFit: "cover", borderRadius: 8 }} />
                        </PhotoView>
                    </div>
                </div>
            );
        }
        if (count === 4) {
            return (
                <div className="image-grid image-grid-4" style={{ display: "flex", gap: 4 }}>
                        <div style={{ width: "60%",  display: "flex", flexDirection: "column",justifyContent: "center", gap: 4 }}>
                            <PhotoView src={images[0]}>
                                <img src={images[0]} alt="post-img-0" style={{ width: "100%", height: 508, objectFit: "cover", borderRadius: 8 }} />
                            </PhotoView>
                            
                        </div>
                        <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 4 }}>
                            <PhotoView src={images[1]}>
                                <img src={images[1]} alt="post-img-1" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }} />
                            </PhotoView>
                            <PhotoView src={images[3]}>
                                <img src={images[3]} alt="post-img-3" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }} />
                            </PhotoView>
                            <PhotoView src={images[2]}>
                                <img src={images[2]} alt="post-img-2" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }} />
                            </PhotoView>
                        </div>
                </div>
            );
        }
        if (count >= 5) {
            return (
                <div className="image-grid image-grid-5" style={{ display: "flex", gap: 4 }}>
                    {/* Bên trái: 2 ảnh dọc */}
                    <div style={{ width: "65%", display: "flex", flexDirection: "column", gap: 4 }}>
                        <PhotoView src={images[0]}>
                            <img src={images[0]} alt="post-img-0" style={{ width: "100%", height: 304, objectFit: "cover", borderRadius: 8 }} />
                        </PhotoView>
                        <PhotoView src={images[1]}>
                            <img src={images[1]} alt="post-img-1" style={{ width: "100%", height: 304, objectFit: "cover", borderRadius: 8 }} />
                        </PhotoView>
                    </div>
                    {/* Bên phải: 3 ảnh ngang */}
                    <div style={{ width: "35%", display: "flex", flexDirection: "column", justifyContent: "center",gap: 4 }}>
                        {[2, 3, 4].map(idx => (
                            <div key={idx} style={{  position: "relative" }}>
                                <PhotoView src={images[idx]}>
                                    <img
                                        src={images[idx]}
                                        alt={`post-img-${idx}`}
                                        style={{
                                            width: "100%",
                                            height: 190,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                            filter: images.length > 5 && idx === 4 ? "brightness(0.7)" : undefined
                                        }}
                                    />
                                </PhotoView>
                                {images.length > 5 && idx === 4 && (
                                    <div style={{
                                        position: "absolute",
                                        top: 0, left: 0, width: "100%", height: "100%",
                                        background: "rgba(0,0,0,0.5)",
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 32,
                                        fontWeight: 700,
                                        borderRadius: 8
                                    }}>
                                        +{images.length - 5}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <PhotoProvider>
            {renderGrid()}
        </PhotoProvider>
    );
};

export default ImageGrid;