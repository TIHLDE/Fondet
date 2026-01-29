import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const id = formData.get("id") as string | null;

  if (!file || !id) {
    return NextResponse.json({ error: "Missing file or id" }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${id}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const filePath = path.join(process.cwd(), "public", "members", filename);
  await writeFile(filePath, buffer);

  return NextResponse.json({ url: `/members/${filename}` });
}
