'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, Loader2, File, Trash2 } from "lucide-react";
import PacmanLoader from 'react-spinners/PacmanLoader';
import { toast } from 'sonner';

interface PdfDocument {
  _id: string;
  title: string;
  pageCount: number;
  createdAt: string;
}

export default function PdfListPage() {
  const [documents, setDocuments] = useState<PdfDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { status } = useSession();

  // Load documents on mount and when auth status changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDocuments();
    }
  }, [status]);

  const fetchDocuments = async () => {
    try {
      // Don't fetch if not authenticated
      if (status !== 'authenticated') {
        setDocuments([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const response = await fetch('/api/pdf', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Ensure we're not using cached responses
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch documents');
      }
      
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching documents:', error);
      toast.error(error.message || 'Failed to fetch documents');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size exceeds the limit of 10MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/pdf/upload', {
        method: 'POST',
        body: formData
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload PDF');
      }
      
      setDocuments(prev => [...prev, data]);
      
      toast.success('PDF uploaded successfully');
    } catch (err) {
      const error = err as Error;
      console.error('Error uploading PDF:', error);
      toast.error(error.message || 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/pdf?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete document');
      }

      setDocuments(prev => prev.filter(doc => doc._id !== id));
      toast.success('Document deleted successfully');
    } catch (err) {
      const error = err as Error;
      console.error('Error deleting document:', error);
      toast.error(error.message || 'Failed to delete document');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
         <PacmanLoader color="#538B81" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">Please sign in to access the PDF chat feature.</p>
        <Button onClick={() => router.push('/api/auth/signin')}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Scriba</h1>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload">
              <Button
                asChild
                disabled={isUploading}
                className="whitespace-nowrap"
              >
                <span className="flex items-center">
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileUp className="h-4 w-4 mr-2" />
                  )}
                  Upload PDF
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[calc(100vh-16rem)] overflow-y-auto rounded-lg bg-[#F2EDE0]">
          {isLoading ? (
            <div className="flex justify-center items-center h-[calc(100vh-16rem)]">
              <PacmanLoader color="#538B81" />
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] text-muted-foreground">
              <File className="h-12 w-12 mb-4" />
              <p>No documents yet. Upload your first PDF to get started!</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <Card
                    key={doc._id}
                    className="group relative overflow-hidden hover:scale-105 transition-all duration-200"
                  >
                    <div className="p-4 flex flex-col space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          className="font-semibold text-base line-clamp-2 cursor-pointer flex-1"
                          onClick={() => router.push(`/pdf/${doc._id}`)}
                        >
                          {doc.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus:opacity-100 touch-none"
                          onClick={() => handleDelete(doc._id)}
                          aria-label="Delete document"
                        >
                          <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
                        </Button>
                      </div>
                      <div 
                        className="flex items-center justify-between text-sm text-muted-foreground cursor-pointer"
                        onClick={() => router.push(`/pdf/${doc._id}`)}
                      >
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        <span>{doc.pageCount} pages</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 