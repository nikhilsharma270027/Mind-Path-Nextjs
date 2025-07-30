import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const API_URL = process.env.API_URL || 'http://localhost:5000';
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || '';

/**
 * GET: List all PDFs for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });

    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/pdf`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-user-id': token.id.toString(),
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      let errorMessage = 'Failed to fetch PDFs';

      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData?.error || errorMessage;
      } else {
        const errorText = await response.text();
        console.error('Non-JSON backend error:', errorText);
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data.pdfs || []);
  } catch (error) {
    console.error('Unhandled error in GET /api/pdf:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Upload a PDF
 */
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();

    const response = await fetch(`${API_URL}/pdf/upload`, {
      method: 'POST',
      headers: {
        'X-User-Id': token.sub || '',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to upload PDF');
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in POST /api/pdf:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

/**
 * DELETE: Remove a PDF by ID
 */
export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });

    const response = await fetch(`${API_URL}/pdf/${id}`, {
      method: 'DELETE',
      headers: {
        'X-User-Id': token.sub || '',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to delete PDF');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/pdf:', error);
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
