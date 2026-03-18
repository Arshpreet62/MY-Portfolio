import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";

type VisitorCounterDoc = {
  _id: string;
  count: number;
};

const VISITS_COLLECTION = "stats";
const VISITS_DOC_ID = "portfolio_visits";
const VISITOR_COOKIE = "portfolio_visitor_seen";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5;

const getCurrentVisits = async () => {
  const db = await getMongoDb();
  const doc = await db
    .collection<VisitorCounterDoc>(VISITS_COLLECTION)
    .findOne({ _id: VISITS_DOC_ID });

  return typeof doc?.count === "number" ? doc.count : 0;
};

const incrementVisits = async () => {
  const db = await getMongoDb();
  const updated = await db
    .collection<VisitorCounterDoc>(VISITS_COLLECTION)
    .findOneAndUpdate(
      { _id: VISITS_DOC_ID },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: "after" },
    );

  return typeof updated?.count === "number" ? updated.count : 1;
};

export async function GET(request: NextRequest) {
  try {
    const hasVisited = request.cookies.get(VISITOR_COOKIE)?.value === "1";

    if (hasVisited) {
      const count = await getCurrentVisits();
      return NextResponse.json({ count });
    }

    const count = await incrementVisits();
    const response = NextResponse.json({ count });

    response.cookies.set({
      name: VISITOR_COOKIE,
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Failed to update visits:", error);
    return NextResponse.json(
      { error: "Unable to load visitor count." },
      { status: 500 },
    );
  }
}
