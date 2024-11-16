// backend/controllers/carController.js
const Car = require('../models/Car');
const cloudinary = require('../config/cloudinaryConfig');

exports.createCar = async (req, res) => {
  const { title, description, tags, car_type, company, dealer } = req.body;
  try {
    const images = req.files.map((file) => ({
      public_id: file.filename, // Cloudinary assigns a unique filename
      url: file.path, // The URL of the uploaded image
    }));

    const newCar = new Car({
      user: req.user,
      title,
      description,
      tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
      car_type,
      company,
      dealer,
      images,
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    console.error('Error creating car:', err.message);
    res.status(500).send('Server error');
  }
};

exports.listCars = async (req, res) => {
  const { search } = req.query;
  try {
    let query = { user: req.user };
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const cars = await Car.find(query);
    res.json(cars);
  } catch (err) {
    console.error('Error listing cars:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.user });
    if (!car) return res.status(404).json({ msg: 'Car not found' });
    res.json(car);
  } catch (err) {
    console.error('Error getting car:', err.message);
    res.status(500).send('Server error');
  }
};

exports.updateCar = async (req, res) => {
  const { title, description, tags, car_type, company, dealer } = req.body;
  try {
    let car = await Car.findOne({ _id: req.params.id, user: req.user });
    if (!car) return res.status(404).json({ msg: 'Car not found' });

    // Update fields
    if (title) car.title = title;
    if (description) car.description = description;
    if (tags) car.tags = tags.split(',').map((tag) => tag.trim());
    if (car_type) car.car_type = car_type;
    if (company) car.company = company;
    if (dealer) car.dealer = dealer;

    // Handle new images
    if (req.files && req.files.length > 0) {
      // Optionally, delete old images from Cloudinary
      for (const img of car.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      const images = req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
      car.images = images;
    }

    await car.save();
    res.json(car);
  } catch (err) {
    console.error('Error updating car:', err.message);
    res.status(500).send('Server error');
  }
};


exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!car) return res.status(404).json({ msg: 'Car not found' });

    // Delete images from Cloudinary
    for (const img of car.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    res.json({ msg: 'Car deleted successfully' });
  } catch (err) {
    console.error('Error deleting car:', err.message);
    res.status(500).send('Server error');
  }
};

