import { UUID } from "crypto";
import jwt from "jsonwebtoken";

const SignToken = async (data: { email: string; _id: string }) => {
  const token = await jwt.sign(
    {
      email: data?.email,
      _id: data?._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10d" }
  ) as string;
  return token;
};

export default SignToken;
