import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'quizzes' })
     
    return NextResponse.json(docs, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quiz data' }, { status: 500 })
  }
}


export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config });

    console.log("Available collections:", Object.keys(payload.collections));

    const { email, pnumber, name,  quizId, answers, categoryScores, totalScore } = await req.json();

    if (!email || !quizId || !answers || !pnumber || typeof totalScore !== 'number' || typeof categoryScores !== 'object') {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    if (!payload.collections.quizResponses) {
      console.error("Error: quizResponses collection not found in PayloadCMS");
      return NextResponse.json({ error: "Collection not found" }, { status: 500 });
    }

    const response = await payload.create({
      collection: "quizResponses",
      data: {
        email,
        pnumber,
        name,
        quizId,
        answers,
        categoryScores,
        totalScore,
        submittedAt: new Date().toISOString(),

      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Quiz Submission Error:", error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}

