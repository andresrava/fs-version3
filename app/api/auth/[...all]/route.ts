import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, { protectSignup } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";


const aj = arcjet({

  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com

  rules: [

    protectSignup({

      email: {

        mode: "LIVE", // will block requests. Use "DRY_RUN" to log only

        // Block emails that are disposable, invalid, or have no MX records

        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],

      },

      bots: {

        mode: "LIVE",

        // configured with a list of bots to allow from

        // https://arcjet.com/bot-list

        allow: [], // "allow none" will block all detected bots

      },

      // It would be unusual for a form to be submitted more than 5 times in 10

      // minutes from the same IP address

      rateLimit: {

        // uses a sliding window rate limit

        mode: "LIVE",

        interval: "10m", // counts requests over a 10 minute sliding window

        max: 5, // allows 5 submissions within the window

      },

    }),

  ],

});

const betterAuthHandlers = toNextJsHandler(auth.handler);

const ajProtectedPOST = async (req: NextRequest) => {
    const { email } = await req.clone().json()

    const decision = await aj.protect(req, { email });
    if (decision.isDenied()) {
        if (decision.reason.isEmail()) {
            let message = '';
            if (decision.reason.emailTypes.includes("INVALID")) {
                message = "email format is invalid. ¿Is there a typo?"
            }
            else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
                message = "We do not allow disponsable email addresses?"
            }
            else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
                message = "Your email domain not have an MX record. ¿is there a typo?"
            }
            else {
                message = "Invalid email";
            }

            return NextResponse.json({
                message, reason: decision.reason,
            }, {status: 400})
        } else {
            return NextResponse.json({message: "Forbiden"}, {status: 403})
        }
    } else {
        return betterAuthHandlers.POST(req)
    }
}

export {ajProtectedPOST as POST };
export const { GET } = toNextJsHandler(auth);