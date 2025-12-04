import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Edit, Eye, Home, Info, GraduationCap, ImageIcon, Building, Phone } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ContentManagerProps {
  onNavigate: (page: string, section?: string) => void;
}

export function ContentManager({ onNavigate }: ContentManagerProps) {
  const sections = [
    {
      id: 'hero',
      title: 'Hero Section',
      description: 'Main banner and welcome message on homepage',
      preview: 'Welcome to Emmaville Academy - Nurturing Excellence Since 1995',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1603958956194-cf9718dba4b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2hvb2wlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjQ2MjM2ODV8MA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 'about',
      title: 'About Page',
      description: 'School history, mission, and vision',
      preview: 'Emmaville Academy is a leading educational institution dedicated to...',
      icon: Info,
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBzdHVkZW50c3xlbnwxfHx8fDE3NjQ2NjQ0MzN8MA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 'admission',
      title: 'Admission Information',
      description: 'Application process and requirements',
      preview: 'Join our community of learners. Applications open year-round...',
      icon: GraduationCap,
      image: 'https://images.unsplash.com/photo-1603530657796-cf3b12aa9e5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBib29rc3xlbnwxfHx8fDE3NjQ2Mzg0MTh8MA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 'gallery',
      title: 'Gallery',
      description: 'Photo collections and albums',
      preview: 'View our campus life, events, and achievements',
      icon: ImageIcon,
      image: 'https://images.unsplash.com/photo-1668104783298-2c70ef96a1e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBmYWNpbGl0aWVzfGVufDF8fHx8MTc2NDcxNTk0MHww&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 'facilities',
      title: 'School Facilities',
      description: 'Campus infrastructure and amenities',
      preview: 'State-of-the-art classrooms, labs, library, sports complex...',
      icon: Building,
      image: 'https://images.unsplash.com/photo-1668104783298-2c70ef96a1e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBmYWNpbGl0aWVzfGVufDF8fHx8MTc2NDcxNTk0MHww&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Address, phone, email, and map',
      preview: '123 Education Street, Learning City | Phone: (555) 123-4567',
      icon: Phone,
      image: 'https://images.unsplash.com/photo-1603958956194-cf9718dba4b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2hvb2wlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjQ2MjM2ODV8MA&ixlib=rb-4.1.0&q=80&w=400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-white mb-2">Content Manager</h1>
        <p className="text-white/90">Edit and manage all content sections of your school website</p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} hover>
              {/* Section Thumbnail */}
              <div className="relative h-40 overflow-hidden bg-muted">
                <ImageWithFallback
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="text-white">{section.title}</h3>
                </div>
              </div>

              {/* Section Content */}
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-foreground line-clamp-2">{section.preview}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => onNavigate('editor', section.id)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
