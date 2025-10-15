import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Note from "@/lib/models/Note";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import { z } from "zod";

const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  body: z
    .string()
    .min(1, "Body is required")
    .max(5000, "Body cannot exceed 5000 characters")
    .trim(),
  tags: z
    .array(z.string().trim().min(1, "Tag cannot be empty"))
    .max(10, "Cannot have more than 10 tags")
    .optional()
    .default([]),
});

interface NotesFilter {
  search?: string;
  tag?: string;
  page?: string;
  [key: string]: string | undefined;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const filter: NotesFilter = {};

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      filter.search = search;
    }

    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Note.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const responseData = {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return NextResponse.json(
      createSuccessResponse("Notes retrieved successfully", responseData)
    );
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      createErrorResponse("Failed to fetch notes", "Internal server error"),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const validationResult = CreateNoteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse("Invalid request data", "Validation error"),
        { status: 400 }
      );
    }

    const { title, body: noteBody, tags } = validationResult.data;

    const existingNote = await Note.findOne({ title });
    if (existingNote) {
      return NextResponse.json(
        createErrorResponse(
          "Note creation failed",
          "A note with this title already exists"
        ),
        { status: 409 }
      );
    }

    const note = new Note({
      title,
      body: noteBody,
      tags: tags.map((tag) => tag.toLowerCase()),
    });

    await note.save();

    return NextResponse.json(
      createSuccessResponse("Note created successfully", note),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating note:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createErrorResponse("Invalid request data", "Validation error"),
        { status: 400 }
      );
    }

    return NextResponse.json(
      createErrorResponse("Failed to create note", "Internal server error"),
      { status: 500 }
    );
  }
}
