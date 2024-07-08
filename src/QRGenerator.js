import React, { useState, useRef, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { Container, Form, FormControl, Button, FormLabel } from 'react-bootstrap';

function QRGenerator() {
  const [text, setText] = useState('');
  const [imageKey, setImageKey] = useState(null);
  const [image, setImage] = useState(null);
  const [size, setSize] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [fgColor, setFgColor] = useState("");
  const [level, setLevel] = useState("");
  const [logoWidth, setLogoWidth] = useState("");

  const qrRef = useRef(null);

  function generateRandomKey() {
    return Math.random().toString(36).substring(2, 10);
  }

  function updateQueryString(params) {
    const url = new URL(window.location);
    for (const key in params) {
      if (params[key] !== null) {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    }
    window.history.replaceState({}, '', url);
  }

  function handleChange(event) {
    const value = event.target.value;
    setText(value);
    updateQueryString({ text: value });
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      const key = generateRandomKey();
      localStorage.setItem(key, imageData);
      setImageKey(key);
      setImage(imageData);
      updateQueryString({ imageKey: key });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function handleDownload() {
    const canvas = qrRef.current.querySelector('canvas');
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
  
    const valueParam = urlParams.get('text');
    const imageKeyParam = urlParams.get('imageKey');
    const sizeParam = urlParams.get('size');
    const bgColorParam = urlParams.get('bgColor');
    const fgColorParam = urlParams.get('fgColor');
    const levelParam = urlParams.get('level');
    const logoWidthParam = urlParams.get('logoWidth');
  
    if (valueParam) setText(valueParam);
  
    if (imageKeyParam) {
      setImageKey(imageKeyParam);
      const storedImage = localStorage.getItem(imageKeyParam);
      if (storedImage) setImage(storedImage);
    }
  
    if (sizeParam && !isNaN(sizeParam)) {
      setSize(parseInt(sizeParam, 10));
    } else {
      setSize(300);
    }
  
    if (logoWidthParam && !isNaN(logoWidthParam)) {
      setLogoWidth(parseInt(logoWidthParam, 10));
    } else {
      setLogoWidth(100);
    }
  
    if (bgColorParam) setBgColor(bgColorParam);
    if (fgColorParam) setFgColor(fgColorParam);
    if (levelParam) setLevel(levelParam);
  }, []);

  useEffect(() => {
    updateQueryString({
      text,
      size,
      bgColor,
      fgColor,
      level,
      logoWidth,
      imageKey
    });
  }, [text, size, bgColor, fgColor, level, logoWidth, imageKey]);

  return (
    <Container className="mt-5">
      <h1 className="mb-1">💯 Free QR Code Generator</h1>
      <p>This little app just generates QR codes. It sounds simple, but so many other QR Generators insert ads, spam, and trickery these days. Here, you can generate QR codes with peace of mind. No tracking, no ads, no bullshit.</p>
      <p><small>PS- this app was created using AI (ChatGPT-4 LLM).</small></p>
      <Form className="mt-2">
        <Form.Group className="mb-3">
          <FormLabel>QR Code Data</FormLabel>
          <FormControl type="text" onChange={handleChange} value={text} />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>Upload Logo Image</FormLabel>
          <FormControl type="file" accept="image/*" onChange={handleImageUpload} />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>QR Code Size</FormLabel>
          <FormControl
            type="number"
            onChange={e => setSize(parseInt(e.target.value, 10) || 300)}
            value={size || 300}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>Background Color</FormLabel>
          <FormControl type="color" onChange={e => setBgColor(e.target.value)} value={bgColor || '#ffffff'} title="Background Color" />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>Foreground Color</FormLabel>
          <FormControl type="color" onChange={e => setFgColor(e.target.value)} value={fgColor || '#000000'} title="Foreground Color" />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>Error Correction Level</FormLabel>
          <FormControl as="select" onChange={e => setLevel(e.target.value)} value={level || 'L'}>
            <option value="L">Low (L)</option>
            <option value="M">Medium (M)</option>
            <option value="Q">Quartile (Q)</option>
            <option value="H">High (H)</option>
          </FormControl>
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>Logo Width</FormLabel>
          <FormControl
            type="number"
            onChange={e => setLogoWidth(parseInt(e.target.value, 10) || 100)}
            value={logoWidth || 100}
          />
        </Form.Group>
      </Form>
      { text && (
        <div className="mt-5 text-center">
          <div className="border border-secondary rounded p-3 d-inline-block" ref={qrRef}>
            <QRCode 
              value={text} 
              size={size || 300} 
              bgColor={bgColor || '#FFFFFF'} 
              fgColor={fgColor || '#000000'}
              level={level || 'L'}
              logoImage={image} 
              logoWidth={logoWidth || 100} 
            />
          </div>
          <br />
          <Button className="mt-3" variant="primary" onClick={handleDownload}>Download</Button>
        </div>
      )}
    </Container>
  );
}

export default QRGenerator;