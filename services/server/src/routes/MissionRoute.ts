import express, { NextFunction, Request, Response } from 'express';
import controller from '../controllers/Generic';
import MissionModel from '../models/MissionModel';

const router = express.Router();

// GET all data config 
router.get('/', controller.getAll(MissionModel));

// GET single data config 
router.get('/:id', controller.get(MissionModel));

// POST new data config
router.post('/', controller.create(MissionModel));

// UPDATE a data config
router.patch('/:id', controller.update(MissionModel));

// PUT a Data into mission 
router.put('/data/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        const result = await MissionModel
            .findOneAndUpdate(
                { 
                    _id: id
                },
                { 
                    $push: {
                        Data: req.body
                    },
                    Published: true
                },
                {
                    new: true,
                    upsert: true
                }
            );
        if (!result) {
            console.log('Not found');
            return res.status(404).json({ message: `${req.body.Name} with ${id} Not found` });
        }
        result.save();
        return res.status(200).json({ result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

// DELETE a data config
router.delete('/:id', controller.deleteOne(MissionModel));

export = router;