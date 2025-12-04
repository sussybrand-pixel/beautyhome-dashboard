import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Upload, Trash2, RefreshCw, Eye, Image as ImageIcon } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { uploadImage, getSection, updateSection, withSite } from "@/lib/api";

interface ImageManagerProps {
  onDelete: () => void;
}

function ImageManager({ onDelete }: ImageManagerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<
    { id: number; url: string; name: string; section: string; size: string; uploadDate: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load existing gallery items from website content
  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        setError("");
        const data = await getSection("gallery");
            const mapped =
              data.items?.map((item: any, idx: number) => ({
                id: idx + 1,
                url: withSite(item.image),
                name: item.label || `Image ${idx + 1}`,
                section: "Gallery",
                size: "",
            uploadDate: "",
          })) || [];
        setImages(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery");
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const persistGallery = async (items: typeof images) => {
    const payload = {
      items: items.map((img) => ({
        image: img.url,
        label: img.name,
      })),
    };
    await updateSection("gallery", payload);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      const result = await uploadImage(file);
      const newImage = {
        id: Date.now(),
        url: withSite(result.url),
        name: file.name,
        section: "Gallery",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toLocaleDateString(),
      };
      const nextImages = [newImage, ...images];
      setImages(nextImages);
      await persistGallery(nextImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    const nextImages = images.filter((img) => img.id !== id);
    setImages(nextImages);
    await persistGallery(nextImages);
    onDelete();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-semibold">Gallery Manager</h1>
          <p className="text-muted-foreground">Upload, replace, and manage website images</p>
        </div>
        <label className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90">
          <Upload className="w-5 h-5" />
          {uploading ? "Uploading..." : "Upload New Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="rounded-xl border border-border bg-secondary/20 p-6">
        <div className="mb-4 flex justify-end">
          <label className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90">
            <Upload className="w-5 h-5" />
            {uploading ? "Uploading..." : "Upload New Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-secondary/30">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-foreground mb-2">Drag & Drop Images Here</h3>
          <p className="text-muted-foreground mb-4">or click Upload New Image above</p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground mt-4">
            Supported formats: JPG, PNG, WebP (Max 5MB). On Vercel, file writes may be read-only;
            use Cloudinary for production reliability.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader depth>
          <div className="flex items-center justify-between">
            <h3 className="text-white">All Images ({images.length})</h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled>
                Filter by Section
              </Button>
              <Button variant="secondary" size="sm" disabled>
                Sort by Date
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-muted-foreground">Loading gallery...</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative bg-secondary/30 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <ImageWithFallback
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 text-foreground hover:bg-white"
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                    <Button variant="primary" size="sm" className="bg-accent hover:bg-accent/90">
                      <RefreshCw className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
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

export default ImageManager;
