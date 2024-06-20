import express from 'express';
import controller from '../controllers/Generic';
import RocketModel from '../models/RocketModel';

const router = express.Router();

// GET all data config 
router.get('/', controller.getAll(RocketModel));

// GET single data config 
router.get('/:id', controller.get(RocketModel));

// POST new data config
router.post('/', controller.create(RocketModel));

// UPDATE a data config
router.patch('/:id', controller.update(RocketModel));

// PUT a Rocket
router.put('/:id', controller.update(RocketModel));

// DELETE a data config
router.delete('/:id', controller.deleteOne(RocketModel));

export = router;
