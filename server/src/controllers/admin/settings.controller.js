import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";

export const updateSettings = asyncHandler(async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
  const valid = await bcrypt.compare(currentPassword, admin.password);
  if (!valid) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  const data = {};
  if (username && username !== admin.username) data.username = username;
  if (newPassword) data.password = await bcrypt.hash(newPassword, 10);

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data,
    select: { id: true, username: true },
  });

  res.json(updated);
});
