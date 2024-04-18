import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // Need on Older version ( this is used to check if method is not get then return this message)

  //   if (request.method !== "GET") {
  //     return Response.json(
  //       {
  //         success: false,
  //         message: "Mathod not allowed (Only Get Method is Allowed)",
  //       },
  //       { status: 400 }
  //     );
  //   }

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod

    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log(result); // Remove

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already Taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Username is unique",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
