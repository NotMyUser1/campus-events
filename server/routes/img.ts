import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const imagesDir = 'img';

// POST: Bild hochladen
router.post('/', express.raw({ type: 'image/*', limit: '10mb' }), (req: Request, res: Response) => {
  const filename = req.headers['x-filename'];
  if (!filename || !req.body) {
    return res.status(400).send('Dateiname oder Bilddaten fehlen');
  }
  const imagePath = path.join(imagesDir, filename.toString());
  fs.writeFile(imagePath, req.body, err => {
    if (err) return res.status(500).send('Fehler beim Speichern');
    res.status(201).send('Bild hochgeladen');
  });
});

// DELETE: Bild löschen
router.delete('/:id', (req: Request, res: Response) => {
  const imageId = req.params.id;
  const imagePath = path.join(imagesDir, imageId);
  fs.unlink(imagePath, err => {
    if (err) return res.status(404).send('Bild nicht gefunden oder Fehler beim Löschen');
    res.send('Bild gelöscht');
  });
});

// GET: Statische Auslieferung
router.use('/', express.static(imagesDir));

export default router;