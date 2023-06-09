import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Container, Form, InputGroup, FormControl, Button } from 'react-bootstrap';

function QRGenerator() {
  const [text, setText] = useState('');
  const qrRef = useRef(null);

  function handleChange(event) {
    const value = event.target.value;
    setText(value);
    const url = new URL(window.location);
    url.searchParams.set('value', value);
    window.history.replaceState({}, '', url);
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
        <InputGroup className="mb-3">
          <FormControl type="text" onChange={handleChange} value={text} placeholder="Enter text to generate QR code" />
        </InputGroup>
      </Form>
      {text && (
        <div className="mt-5 text-center">
          <div className="border border-secondary rounded p-3 d-inline-block" ref={qrRef}>
            <QRCode value={text} size={200} />
          </div>
          <br />
          <Button className="mt-3" variant="primary" onClick={handleDownload}>Download</Button>
        </div>
      )}
    </Container>
  );
}

export default QRGenerator;
