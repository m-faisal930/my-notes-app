import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Note from "@/lib/models/Note";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import { z } from "zod";
import mongoose from "mongoose";

const UpdateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .trim()
    .optional(),
  body: z
    .string()
    .min(1, "Body is required")
    .max(5000, "Body cannot exceed 5000 characters")
    .trim()
    .optional(),
  tags: z
    .array(z.string().trim().min(1, "Tag cannot be empty"))
    .max(10, "Cannot have more than 10 tags")
    .optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        createErrorResponse("Invalid note ID", "The provided ID is not valid"),
        { status: 400 }
      );
    }

    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json(
        createErrorResponse(
          "Note not found",
          "The requested note was not found"
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createSuccessResponse("Note retrieved successfully", note)
    );
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      createErrorResponse("Failed to fetch note", "Internal server error"),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        createErrorResponse("Invalid note ID", "The provided ID is not valid"),
        { status: 400 }
      );
    }

    const body = await request.json();

    const validationResult = UpdateNoteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse("Invalid request data", "Validation error"),
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    if (updateData.tags) {
      updateData.tags = updateData.tags.map((tag) => tag.toLowerCase());
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!note) {
      return NextResponse.json(
        createErrorResponse(
          "Note not found",
          "The requested note was not found"
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createSuccessResponse("Note updated successfully", note)
    );
  } catch (error) {
    console.error("Error updating note:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createErrorResponse("Invalid request data", "Validation error"),
        { status: 400 }
      );
    }

    if (
      (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: number }).code === 11000) ||
      (error as { code: number }).code === 11001
    ) {
      return NextResponse.json(
        createErrorResponse(
          "Update failed",
          "A note with this title already exists"
        ),
        { status: 409 }
      );
    }

    return NextResponse.json(
      createErrorResponse("Failed to update note", "Internal server error"),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        createErrorResponse("Invalid note ID", "The provided ID is not valid"),
        { status: 400 }
      );
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return NextResponse.json(
        createErrorResponse(
          "Note not found",
          "The requested note was not found"
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createSuccessResponse("Note deleted successfully")
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      createErrorResponse("Failed to delete note", "Internal server error"),
      { status: 500 }
    );
  }
}
