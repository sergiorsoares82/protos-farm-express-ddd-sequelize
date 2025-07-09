import express from 'express';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  // Logic to create a new user
  res.status(201).json({ message: 'User created successfully' });
});

export default userRouter;
