const { PrismaClient } = require('@prisma/client');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

router.post('/login', async (req, res) => {
  try {
    const user = await findUserByEmail(req.body.email);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const auth = await bcrypt.compare(req.body.password, user.password);

    if (!auth) {
      return res.status(401).json({
        message: 'Incorrect password',
      });
    } else {

      return res.status(200).json({
        message: 'Login successful',
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  } finally {
    await prisma.$disconnect();
  }
});

async function addUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });
}

router.post('/create', async (req, res) => {
  try {
    const user = await addUser(req.body.email, req.body.password);
    return res.status(200).json({
      message: 'User created successfully',
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
