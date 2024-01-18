const { PrismaClient } = require('@prisma/client');
const express = require('express');
const prisma = new PrismaClient();
const router = express.Router();

// Function to add a new wine entry
async function addWine(name, year, type, varietal, rating, consumed, dateConsumed, email) {
    try {
      const wine = await prisma.wine.create({
        data: {
          name,
          year,
          type,
          varietal,
          rating,
          consumed,
          dateConsumed,
          email,
        },
      });
      return wine; // Return the created wine entry
    } catch (error) {
      throw error; // Throw the error for handling in the calling function
    }
  }
  
  // Endpoint to create a new wine entry
  router.post('/create',async (req, res) => {
    const { name, year, type, varietal, rating, consumed, dateConsumed, email } = req.body;
  
    try {
      // Call the addWine function to create a new wine entry
      const createdWine = await addWine(name, year, type, varietal, rating, consumed, dateConsumed, email);
  
      // Respond with the created wine entry
      res.json(createdWine);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    } finally {
      // Disconnect from the database
      await prisma.$disconnect();
    }
  });




  async function listWine() {
    try {
        const wines = await prisma.wine.findMany();
        return wines;
    } catch (error) {
        throw error;
    }
}

router.get('/WineList',async (req, res) => {
    try {
        const wineList = await listWine();
        res.status(200).json(wineList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
});

async function deletewine(id) {
    const deleteUser = await prisma.wine.delete({
        where: {
          id: id,
        },
      })   
}
 
router.delete('/:id', async (req, res) => {
    try {
         id = parseInt(req.params.id)
        await deletewine(id);
        res.status(200).json({
            message:"Wine deleted"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
});



async function updateWine(id, updatedFields) {
    try {
        const updatedWine = await prisma.wine.update({
            where: {
                id: id,
            },
            data: updatedFields,
        });

        return updatedWine;
    } catch (error) {
        throw error;
    }
}

router.put('/update/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const updatedFields = req.body; // Assuming updated fields are sent in the request body

    try {
        // Call the updateWine function to update the wine entry
        const updatedWine = await updateWine(id, updatedFields);

        // Respond with the updated wine entry
        res.json(updatedWine);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    } finally {
        // Disconnect from the database
        await prisma.$disconnect();
    }
});
 

  
 



module.exports=router;