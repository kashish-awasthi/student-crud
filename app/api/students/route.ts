import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// READ - Display all students
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM students ORDER BY id"
    );

    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// CREATE - Add a student
export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *",
      [name.trim(), email.trim()]
    );

    return NextResponse.json(result.rows[0], {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}

// UPDATE - Modify student
export async function PUT(req: NextRequest) {
  try {
    const { id, name, email } = await req.json();

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return NextResponse.json(
        { error: "Valid id, name and email are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "UPDATE students SET name=$1, email=$2 WHERE id=$3 RETURNING *",
      [name.trim(), email.trim(), id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE - Remove student
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Valid student id is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM students WHERE id=$1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Student deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
