import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Set up react-pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReadBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { id } = useParams();

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
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

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
          file={`http://localhost:5000${book.filePath}`}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Spinner animation="border" />}
          error={<Alert variant="danger">Failed to load PDF. Please try again later.</Alert>}
          className="d-flex justify-content-center"
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false}
            width={window.innerWidth > 768 ? 800 : window.innerWidth - 50}
          />
        </Document>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button 
          onClick={goToPrevPage} 
          disabled={pageNumber <= 1}
          variant="outline-primary"
        >
          <FaChevronLeft className="me-1" /> Previous
        </Button>
        <p className="mb-0">
          Page {pageNumber} of {numPages}
        </p>
        <Button 
          onClick={goToNextPage} 
          disabled={pageNumber >= numPages}
          variant="outline-primary"
        >
          Next <FaChevronRight className="ms-1" />
        </Button>
      </div>
    </Container>
  );
};

export default ReadBook; 