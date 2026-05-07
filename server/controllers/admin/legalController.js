import fs from 'fs';
import path from 'path';

const legalDir = path.join(process.cwd(), 'legal');

if (!fs.existsSync(legalDir)) {
  fs.mkdirSync(legalDir, { recursive: true });
}

const getLegalDocument = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['terms', 'privacy', 'cookies'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid document type.' });
    }

    const filePath = path.join(legalDir, `${type}.html`);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).json({ message: 'Document not found.' });
    }
  } catch (error) {
    console.error('Get legal error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateLegalDocument = async (req, res) => {
  try {
    const { type } = req.params;
    const { content } = req.body;
    const validTypes = ['terms', 'privacy', 'cookies'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid document type.' });
    }
    if (!content) return res.status(400).json({ message: 'Content required.' });

    const filePath = path.join(legalDir, `${type}.html`);
    fs.writeFileSync(filePath, content);
    res.json({ message: `${type} updated.` });
  } catch (error) {
    console.error('Update legal error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getLegalDocument, updateLegalDocument };