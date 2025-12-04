import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Upload, Trash2, RefreshCw, Eye, X, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ImageManagerProps {
  onDelete: () => void;
}

export function ImageManager({ onDelete }: ImageManagerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1603958956194-cf9718dba4b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2hvb2wlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjQ2MjM2ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'School Building',
      section: 'Hero',
      size: '2.4 MB',
      uploadDate: 'Nov 15, 2024',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBzdHVkZW50c3xlbnwxfHx8fDE3NjQ2NjQ0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Classroom',
      section: 'About',
      size: '1.8 MB',
      uploadDate: 'Nov 12, 2024',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1668104783298-2c70ef96a1e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBmYWNpbGl0aWVzfGVufDF8fHx8MTc2NDcxNTk0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Facilities',
      section: 'Facilities',
      size: '3.1 MB',
      uploadDate: 'Nov 10, 2024',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1603530657796-cf3b12aa9e5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBib29rc3xlbnwxfHx8fDE3NjQ2Mzg0MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Library',
      section: 'Gallery',
      size: '2.1 MB',
      uploadDate: 'Nov 8, 2024',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1603958956194-cf9718dba4b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2hvb2wlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjQ2MjM2ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Campus View',
      section: 'Gallery',
      size: '2.7 MB',
      uploadDate: 'Nov 5, 2024',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBzdHVkZW50c3xlbnwxfHx8fDE3NjQ2NjQ0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Students',
      section: 'Gallery',
      size: '1.9 MB',
      uploadDate: 'Nov 3, 2024',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2">Image Manager</h1>
          <p className="text-white/90">Upload, replace, and manage website images</p>
        </div>
        <Button variant="gold" size="lg">
          <Upload className="w-5 h-5" />
          Upload New Image
        </Button>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer bg-secondary/30">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-foreground mb-2">Drag & Drop Images Here</h3>
            <p className="text-muted-foreground mb-4">or click to browse from your computer</p>
            <Button variant="primary">Choose Files</Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: JPG, PNG, WebP (Max 5MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <Card>
        <CardHeader depth>
          <div className="flex items-center justify-between">
            <h3 className="text-white">All Images ({images.length})</h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Filter by Section
              </Button>
              <Button variant="secondary" size="sm">
                Sort by Date
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative bg-secondary/30 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <ImageWithFallback
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="primary" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={onDelete}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4 space-y-2">
                  <h4 className="text-foreground">{image.name}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                      {image.section}
                    </span>
                    <span>{image.size}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{image.uploadDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Modal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        size="xl"
        title="Image Preview"
      >
        <div className="p-6">
          {selectedImage && (
            <ImageWithFallback
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
