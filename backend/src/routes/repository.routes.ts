import { Router } from 'express';
import { repositoryController } from '../controllers/repository.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes are protected
router.use(authenticate);

// GitHub repository browsing
router.get('/github', repositoryController.listGitHubRepos);

// Imported repository management
router.get('/', repositoryController.listRepositories);
router.post('/import', repositoryController.importRepository);
router.get('/:id', repositoryController.getRepository);
router.delete('/:id', repositoryController.deleteRepository);
router.post('/:id/sync', repositoryController.syncRepository);
router.get('/:id/pulls', repositoryController.getPullRequests);

export default router;
