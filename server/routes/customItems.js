import express from 'express';
import { 
    getCustomItems, 
    getCustomItemById, 
    createCustomItem, 
    updateCustomItem, 
    deleteCustomItem 
} from '../controllers/customItems.js';

const router = express.Router();

// Route to get all items and create a new item
router.get('/', getCustomItems);
router.post('/', createCustomItem);

// Routes to handle single item operations
router.get('/:id', getCustomItemById);
router.put('/:id', updateCustomItem);
router.delete('/:id', deleteCustomItem);

export default router;

