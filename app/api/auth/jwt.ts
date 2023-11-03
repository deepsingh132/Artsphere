import jwt from "jsonwebtoken";

const SignToken = async (data: { email: any; _id: any }) => {
  const token = await jwt.sign(
    {
      email: data?.email,
      _id: data?._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10d" }
  );
  return token;
};

export default SignToken;
