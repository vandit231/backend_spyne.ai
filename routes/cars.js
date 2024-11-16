// backend/routes/cars.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createCar, listCars, getCar, updateCar, deleteCar } = require('../controllers/carController');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('images', 10), createCar);

router.get('/', auth, listCars);

router.get('/:id', auth, getCar);
router.put('/:id', auth, upload.array('images', 10), updateCar);
// In backend/routes/cars.js
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received ID:', id);
  });
  
router.delete('/:id', auth, deleteCar);
module.exports = router;
