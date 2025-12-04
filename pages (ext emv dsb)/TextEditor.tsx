import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { ArrowLeft, Save, X, Eye } from 'lucide-react';

interface TextEditorProps {
  section?: string;
  onNavigate: (page: string) => void;
  onSave: () => void;
}

export function TextEditor({ section = 'hero', onNavigate, onSave }: TextEditorProps) {
  const sectionTitles: Record<string, string> = {
    hero: 'Hero Section',
    about: 'About Page',
    admission: 'Admission Information',
    gallery: 'Gallery',
    facilities: 'School Facilities',
    contact: 'Contact Information',
  };

  const [title, setTitle] = useState('Welcome to Emmaville Academy');
  const [subtitle, setSubtitle] = useState('Nurturing Excellence Since 1995');
  const [content, setContent] = useState(
    'At Emmaville Academy, we are committed to providing world-class education that prepares students for the challenges of tomorrow. Our dedicated faculty, state-of-the-art facilities, and comprehensive curriculum ensure that every student receives the support they need to excel academically, socially, and personally.\n\nOur mission is to foster a love of learning, critical thinking, and character development in a safe and nurturing environment.'
  );

  const handleSave = () => {
    onSave();
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => onNavigate('content')}>
        <ArrowLeft className="w-4 h-4" />
        Back to Content Manager
      </Button>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-white mb-2">Edit {sectionTitles[section]}</h1>
        <p className="text-white/90">Make changes to the content and publish when ready</p>
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <Card>
          <CardHeader depth>
            <h3 className="text-white">Content Editor</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter section title"
            />

            <Input
              label="Subtitle"
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter subtitle (optional)"
            />

            <Textarea
              label="Content"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Enter your content here..."
            />

            {/* Formatting Toolbar */}
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">Formatting Options</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm">Bold</Button>
                <Button variant="secondary" size="sm">Italic</Button>
                <Button variant="secondary" size="sm">Underline</Button>
                <Button variant="secondary" size="sm">List</Button>
                <Button variant="secondary" size="sm">Link</Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="primary" className="flex-1" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save & Publish
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('content')}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader depth>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-white" />
              <h3 className="text-white">Live Preview</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-border min-h-[500px]">
              {title && (
                <h1 className="text-foreground">{title}</h1>
              )}
              {subtitle && (
                <h3 className="text-muted-foreground">{subtitle}</h3>
              )}
              {content && (
                <div className="prose prose-sm max-w-none">
                  {content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Info */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This is a preview of how your content will appear on the live website.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
