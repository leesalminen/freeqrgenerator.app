import React, { useState, useRef, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { Container, Form, InputGroup, FormControl, Button, FormLabel } from 'react-bootstrap';

function QRGenerator() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [size, setSize] = useState(300);
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [fgColor, setFgColor] = useState("#000000");
  const [level, setLevel] = useState("L");
  const [logoWidth, setLogoWidth] = useState(75);
  
  const qrRef = useRef(null);

  function handleChange(event) {
    const value = event.target.value;
    setText(value);
    const url = new URL(window.location);
    url.searchParams.set('value', value);
    window.history.replaceState({}, '', url);
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
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
    const valueParam = urlParams.get('value');
    if (valueParam) {
      setText(valueParam);
    }
  }, []);

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
          <FormControl type="number" onChange={e => setSize(parseInt(e.target.value))} value={size} />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>Background Color</FormLabel>
          <FormControl type="color" onChange={e => setBgColor(e.target.value)} value={bgColor} title="Background Color" />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>Foreground Color</FormLabel>
          <FormControl type="color" onChange={e => setFgColor(e.target.value)} value={fgColor} title="Foreground Color" />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>Error Correction Level</FormLabel>
          <FormControl as="select" onChange={e => setLevel(e.target.value)} value={level}>
            <option value="L">Low (L)</option>
            <option value="M">Medium (M)</option>
            <option value="Q">Quartile (Q)</option>
            <option value="H">High (H)</option>
          </FormControl>
        </Form.Group>
        <Form.Group className="mb-3">
          <FormLabel>Logo Width</FormLabel>
          <FormControl type="number" onChange={e => setLogoWidth(parseInt(e.target.value))} value={logoWidth} />
        </Form.Group>
      </Form>
      {text && (
        <div className="mt-5 text-center">
          <div className="border border-secondary rounded p-3 d-inline-block" ref={qrRef}>
            <QRCode 
              value={text} 
              size={size} 
              bgColor={bgColor} 
              fgColor={fgColor}
              level={level}
              logoImage={image} 
              logoWidth={logoWidth} 
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