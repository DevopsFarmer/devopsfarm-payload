import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET: Fetch quizzes
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
    const { email, quizId, answers } = await req.json()
    const payload = await getPayload({ config })

    if (!email || !quizId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const response = await payload.create({
      collection: 'quizResponses',
      data: {
        email, 
        quizId,
        answers,
        submittedAt: new Date().toISOString(), 
      },
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Quiz Submission Error:', error)
    return NextResponse.json({ error: 'Failed to submit answers' }, { status: 500 })
  }
}

// POST: Submit answers
// export async function POST(req: Request) {
//     try {
//       const { userId, quizId, answers } = await req.json();
//       const payload = await getPayload({ config });

//       const response = await payload.create({
//         collection: "quizResponses",
//         data: {
//           userId,
//           quizId,
//           answers,
//           submittedAt: new Date().toISOString() // ✅ Convert Date to string
//         },
//       });

//       return NextResponse.json(response, { status: 201 });
//     } catch (error) {
//       return NextResponse.json({ error: "Failed to submit answers" }, { status: 500 });
//     }
//   }
