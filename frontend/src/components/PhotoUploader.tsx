import { useState, useRef, useCallback } from "react";
import type { DragEvent, ChangeEvent } from "react";
import "./PhotoUploader.css";

interface PhotoUploaderProps {
  onChange: (file: File | null) => void;
}

function PhotoUploader({ onChange }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (file && !file.type.startsWith("image/")) {
        return;
      }
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } else {
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
      }
      onChange(file);
    },
    [onChange],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      handleFile(file);
    },
    [handleFile],
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleClear = useCallback(() => {
    handleFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [handleFile]);

  return (
    <div className="photo-uploader">
      <div
        className={`upload-zone ${isDragging ? "upload-zone--dragging" : ""} ${preview ? "upload-zone--has-preview" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="upload-preview" />
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">+</span>
            <span className="upload-text">
              Drag & drop a photo here, or click to select
            </span>
            <span className="upload-hint">Accepts image files</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="upload-input"
          aria-label="Upload photo"
        />
      </div>
      {preview && (
        <button type="button" className="btn-secondary" onClick={handleClear}>
          Remove photo
        </button>
      )}
    </div>
  );
}

export default PhotoUploader;
