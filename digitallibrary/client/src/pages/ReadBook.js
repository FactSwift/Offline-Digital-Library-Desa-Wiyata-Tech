import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

const ReadBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const { id } = useParams();

  // Memoize PDF options to prevent unnecessary rerenders
  const pdfOptions = useMemo(() => ({
    cMapUrl: '/pdf-worker/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/pdf-worker/standard_fonts/'
  }), []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/books/${id}`);
        setBook(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching book. Please try again later.');
        setLoading(false);
        console.error('Error fetching book:', err);
      }
    };

    fetchBook();
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = useCallback(() => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }, [pageNumber]);

  const goToNextPage = useCallback(() => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber, numPages]);

  const zoomIn = useCallback(() => {
    if (scale < 2.0 && !isZooming) {
      setIsZooming(true);
      setScale(prevScale => prevScale + 0.1);
      setTimeout(() => setIsZooming(false), 300);
    }
  }, [scale, isZooming]);

  const zoomOut = useCallback(() => {
    if (scale > 0.5 && !isZooming) {
      setIsZooming(true);
      setScale(prevScale => prevScale - 0.1);
      setTimeout(() => setIsZooming(false), 300);
    }
  }, [scale, isZooming]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  const onError = useCallback((error) => {
    console.error('PDF error:', error);
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading book...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/" variant="outline-primary">
            <FaArrowLeft className="me-2" />
            Back to Library
          </Button>
        </div>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Book not found.</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/" variant="outline-primary">
            <FaArrowLeft className="me-2" />
            Back to Library
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button as={Link} to={`/books/${id}`} variant="outline-primary">
          <FaArrowLeft className="me-2" />
          Back to Book Details
        </Button>
        <h4 className="mb-0">{book.title}</h4>
      </div>

      <div className="pdf-container p-3">
        <Document
          file={book.filePath}
          onLoadSuccess={onDocumentLoadSuccess}
          onError={onError}
          loading={<Spinner animation="border" />}
          error={
            <Alert variant="danger" className="text-center p-4">
              Failed to load PDF viewer. Please try again later.
            </Alert>
          }
          className="d-flex justify-content-center"
          options={pdfOptions}
        >
          <Page 
            pageNumber={pageNumber}
            scale={scale}
            width={window.innerWidth > 768 ? 800 : window.innerWidth - 50}
            error={
              <Alert variant="warning" className="text-center p-2">
                Error rendering this page. Try zooming out.
              </Alert>
            }
          />
        </Document>
      </div>

      <Row className="mt-3 align-items-center">
        <Col xs={12} md={4} className="d-flex justify-content-start mb-3 mb-md-0">
          <Button 
            onClick={goToPrevPage} 
            disabled={pageNumber <= 1}
            variant="outline-primary"
            className="me-2"
          >
            <FaChevronLeft className="me-1" /> Previous
          </Button>
          <Button 
            onClick={goToNextPage} 
            disabled={pageNumber >= numPages}
            variant="outline-primary"
          >
            Next <FaChevronRight className="ms-1" />
          </Button>
        </Col>
        
        <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
          <p className="mb-0">
            Page {pageNumber} of {numPages || '-'}
          </p>
        </Col>
        
        <Col xs={12} md={4} className="d-flex justify-content-end">
          <Button 
            onClick={zoomOut} 
            disabled={scale <= 0.5 || isZooming}
            variant="outline-secondary"
            className="me-2"
          >
            <FaSearchMinus />
          </Button>
          <Button 
            onClick={zoomIn} 
            disabled={scale >= 2.0 || isZooming}
            variant="outline-secondary"
          >
            <FaSearchPlus />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ReadBook; 