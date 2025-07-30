import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "@/lib/mongodb";
import { authOptions } from "@/lib/authoptions";
import Note from "@/models/note";
import type { NextRequest } from 'next/server';

interface RouteParams {
  params: {
    noteId: string;
  };
}

// Helper function for error responses
const errorResponse = (message: string, status: number) => {
  return NextResponse.json({ error: message }, { status });
};

// Get a specific note
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    await connectMongoDB();
    const note = await Note.findOne({
      _id: params.noteId,
      userId: session.user.id
    });

    if (!note) {
      return errorResponse("Note not found", 404);
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    return errorResponse("Failed to fetch note", 500);
  }
}

// Update a note
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const data = await request.json();
    await connectMongoDB();

    const updateData = {
      title: data.title,
      content: [{
        type: 'paragraph',
        content: data.content
      }]
    };

    const note = await Note.findOneAndUpdate(
      { _id: params.noteId, userId: session.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!note) {
      return errorResponse("Note not found", 404);
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    return errorResponse("Failed to update note", 500);
  }
}

// Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    await connectMongoDB();
    const note = await Note.findOneAndDelete({
      _id: params.noteId,
      userId: session.user.id
    });

    if (!note) {
      return errorResponse("Note not found", 404);
    }

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    return errorResponse("Failed to delete note", 500);
  }
}